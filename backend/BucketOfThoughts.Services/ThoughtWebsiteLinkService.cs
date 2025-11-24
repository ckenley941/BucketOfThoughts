using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BucketOfThoughts.Services;

public interface IThoughtWebsiteLinkService
{
    Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLinks();
    Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLinksByThoughtId(long thoughtId);
    Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLink(long thoughtId, long websiteLinkId);
    Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> AddThoughtWebsiteLink(ThoughtWebsiteLinkDto thoughtWebsiteLinkDto);
    Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> UpdateThoughtWebsiteLink(ThoughtWebsiteLinkDto thoughtWebsiteLinkDto);
    Task<BaseApplicationServiceResult> DeleteThoughtWebsiteLink(long thoughtId, long websiteLinkId);
}

public class ThoughtWebsiteLinkService(BucketOfThoughtsDbContext dbContext, IUserSessionProvider userSessionProvider) : IThoughtWebsiteLinkService
{
    public async Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLinks()
    {
        var thoughtWebsiteLinks = await dbContext.ThoughtWebsiteLinks
            .Where(twl => twl.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !twl.IsDeleted)
            .Select(SelectFullThoughtWebsiteLink)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLinks);
    }

    public async Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLinksByThoughtId(long thoughtId)
    {
        if (!await IsValidThoughtUser(thoughtId))
        {
            return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtWebsiteLinks = await dbContext.ThoughtWebsiteLinks
            .Where(twl => twl.ThoughtId == thoughtId && !twl.IsDeleted)
            .Select(SelectFullThoughtWebsiteLink)
            .OrderBy(twl => twl.SortOrder)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLinks);
    }

    public async Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> GetThoughtWebsiteLink(long thoughtId, long websiteLinkId)
    {
        if (!await IsValidThoughtUser(thoughtId))
        {
            return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtWebsiteLink = await dbContext.ThoughtWebsiteLinks
            .Where(twl => twl.ThoughtId == thoughtId && twl.WebsiteLinkId == websiteLinkId && twl.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !twl.IsDeleted)
            .Select(SelectFullThoughtWebsiteLink)
            .SingleAsync();
        return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLink);
    }

    public async Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> AddThoughtWebsiteLink(ThoughtWebsiteLinkDto thoughtWebsiteLinkDto)
    {
        if (!await IsValidThoughtUser(thoughtWebsiteLinkDto.ThoughtId))
        {
            return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        // Check if the link already exists
        var existingLink = await dbContext.ThoughtWebsiteLinks
            .FirstOrDefaultAsync(twl => twl.ThoughtId == thoughtWebsiteLinkDto.ThoughtId && 
                                        twl.WebsiteLinkId == thoughtWebsiteLinkDto.WebsiteLinkId && 
                                        !twl.IsDeleted);
        
        if (existingLink != null)
        {
            // If it exists but is deleted, restore it
            if (existingLink.IsDeleted)
            {
                existingLink.IsDeleted = false;
                dbContext.ThoughtWebsiteLinks.Update(existingLink);
                await dbContext.SaveChangesAsync();
                return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLinkDto);
            }
            else
            {
                return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
                {
                    StatusCode = ServiceStatusCodes.InternalServerError,
                    ErrorMessage = "This website link is already associated with the thought."
                };
            }
        }

        var entity = thoughtWebsiteLinkDto.MapInsert();
        dbContext.ThoughtWebsiteLinks.Add(entity);
        await dbContext.SaveChangesAsync();
        return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLinkDto);
    }

    public async Task<ApplicationServiceResult<ThoughtWebsiteLinkDto>> UpdateThoughtWebsiteLink(ThoughtWebsiteLinkDto thoughtWebsiteLinkDto)
    {
        if (!await IsValidThoughtUser(thoughtWebsiteLinkDto.ThoughtId))
        {
            return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtWebsiteLinkDbRow = await dbContext.ThoughtWebsiteLinks
            .SingleAsync(twl => twl.ThoughtId == thoughtWebsiteLinkDto.ThoughtId && 
                                twl.WebsiteLinkId == thoughtWebsiteLinkDto.WebsiteLinkId && 
                                twl.Thought.LoginProfileId == userSessionProvider.LoginProfileId && 
                                !twl.IsDeleted);
        var entity = thoughtWebsiteLinkDto.MapUpdate(thoughtWebsiteLinkDbRow);
        dbContext.ThoughtWebsiteLinks.Update(entity);
        await dbContext.SaveChangesAsync();
        return new ApplicationServiceResult<ThoughtWebsiteLinkDto>(thoughtWebsiteLinkDto);
    }

    public async Task<BaseApplicationServiceResult> DeleteThoughtWebsiteLink(long thoughtId, long websiteLinkId)
    {
        if (!await IsValidThoughtUser(thoughtId))
        {
            return new BaseApplicationServiceResult
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtWebsiteLinkDbRow = await dbContext.ThoughtWebsiteLinks
            .SingleAsync(twl => twl.ThoughtId == thoughtId && 
                                twl.WebsiteLinkId == websiteLinkId && 
                                twl.Thought.LoginProfileId == userSessionProvider.LoginProfileId && 
                                !twl.IsDeleted);
        thoughtWebsiteLinkDbRow.IsDeleted = true;
        dbContext.ThoughtWebsiteLinks.Update(thoughtWebsiteLinkDbRow);
        await dbContext.SaveChangesAsync();
        return new BaseApplicationServiceResult();
    }

    private async Task<bool> IsValidThoughtUser(long thoughtId)
    {
        return await dbContext.Thoughts
            .CountAsync(t => t.Id == thoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted) > 0;
    }

    private static Expression<Func<ThoughtWebsiteLink, ThoughtWebsiteLinkDto>> SelectFullThoughtWebsiteLink =
        twl => new ThoughtWebsiteLinkDto
        {
            ThoughtId = twl.ThoughtId,
            WebsiteLinkId = twl.WebsiteLinkId,
            WebsiteUrl = twl.WebsiteLink.WebsiteUrl,
            Description = twl.WebsiteLink.Description,
            SortOrder = twl.WebsiteLink.SortOrder
        };
}

