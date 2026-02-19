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

        // Create or get WebsiteLink
        WebsiteLink websiteLink;
        if (thoughtWebsiteLinkDto.WebsiteLinkId > 0)
        {
            // Use existing WebsiteLink
            var existingWebsiteLink = await dbContext.WebsiteLinks
                .FirstOrDefaultAsync(wl => wl.Id == thoughtWebsiteLinkDto.WebsiteLinkId);
            
            if (existingWebsiteLink == null)
            {
                return new ApplicationServiceResult<ThoughtWebsiteLinkDto>
                {
                    StatusCode = ServiceStatusCodes.InternalServerError,
                    ErrorMessage = "Website link not found."
                };
            }

            websiteLink = existingWebsiteLink;

            websiteLink.WebsiteUrl = thoughtWebsiteLinkDto.WebsiteUrl;
            websiteLink.Description = thoughtWebsiteLinkDto.Description ?? string.Empty;
            websiteLink.SortOrder = (int)thoughtWebsiteLinkDto.SortOrder;
            dbContext.WebsiteLinks.Update(websiteLink);
        }
        else
        {
            // Create new WebsiteLink
            websiteLink = new WebsiteLink
            {
                WebsiteUrl = thoughtWebsiteLinkDto.WebsiteUrl,
                Description = thoughtWebsiteLinkDto.Description,
                SortOrder = (int)thoughtWebsiteLinkDto.SortOrder
            };
            dbContext.WebsiteLinks.Add(websiteLink);
            await dbContext.SaveChangesAsync(); // Save to get the ID
        }

        // Check if the ThoughtWebsiteLink already exists
        var existingLink = await dbContext.ThoughtWebsiteLinks
            .FirstOrDefaultAsync(twl => twl.ThoughtId == thoughtWebsiteLinkDto.ThoughtId && 
                                        twl.WebsiteLinkId == websiteLink.Id && 
                                        !twl.IsDeleted);
        
        if (existingLink != null)
        {
            // If it exists but is deleted, restore it
            if (existingLink.IsDeleted)
            {
                existingLink.IsDeleted = false;
                dbContext.ThoughtWebsiteLinks.Update(existingLink);
                await dbContext.SaveChangesAsync();
                thoughtWebsiteLinkDto.WebsiteLinkId = websiteLink.Id;
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

        // Create ThoughtWebsiteLink
        var entity = new ThoughtWebsiteLink
        {
            ThoughtId = thoughtWebsiteLinkDto.ThoughtId,
            WebsiteLinkId = websiteLink.Id
        };
        dbContext.ThoughtWebsiteLinks.Add(entity);
        await dbContext.SaveChangesAsync();
        
        thoughtWebsiteLinkDto.WebsiteLinkId = websiteLink.Id;
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
            .Include(twl => twl.WebsiteLink)
            .SingleAsync(twl => twl.ThoughtId == thoughtWebsiteLinkDto.ThoughtId && 
                                twl.WebsiteLinkId == thoughtWebsiteLinkDto.WebsiteLinkId && 
                                twl.Thought.LoginProfileId == userSessionProvider.LoginProfileId && 
                                !twl.IsDeleted);
        
        // Update WebsiteLink properties
        if (thoughtWebsiteLinkDbRow.WebsiteLink != null)
        {
            thoughtWebsiteLinkDbRow.WebsiteLink.WebsiteUrl = thoughtWebsiteLinkDto.WebsiteUrl;
            thoughtWebsiteLinkDbRow.WebsiteLink.Description = thoughtWebsiteLinkDto.Description ?? string.Empty;
            thoughtWebsiteLinkDbRow.WebsiteLink.SortOrder = (int)thoughtWebsiteLinkDto.SortOrder;
            dbContext.WebsiteLinks.Update(thoughtWebsiteLinkDbRow.WebsiteLink);
        }
        
        dbContext.ThoughtWebsiteLinks.Update(thoughtWebsiteLinkDbRow);
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

