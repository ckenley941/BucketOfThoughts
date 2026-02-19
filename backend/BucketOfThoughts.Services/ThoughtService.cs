using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BucketOfThoughts.Services;

public interface IThoughtService
{
    Task<ApplicationServiceResult<ThoughtDto>> GetThoughts();
    Task<ApplicationServiceResult<ThoughtDto>> GetThoughtById(long id);
    Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto);
    Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto);
    Task<BaseApplicationServiceResult> DeleteThought(long id);
    Task<ApplicationServiceResult<RecentThoughtDto>> GetRecentThoughts();
    Task<ApplicationServiceResult<ThoughtDto>> GetRandomThought(long? bucketId = null);
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext, IUserSessionProvider userSessionProvider): IThoughtService
{
    public async Task<ApplicationServiceResult<ThoughtDto>> GetThoughts()
    {
        var thoughts = await dbContext.Thoughts
            .Where(t => t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted)
            .Select(SelectFullThought)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtDto>(thoughts);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> GetThoughtById(long id)
    {
        if (!await IsValidUser(id))
        {
            return new ApplicationServiceResult<ThoughtDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thought = await dbContext.Thoughts
            .Where(t => t.Id == id && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted )
            .Select(SelectFullThought)
            .SingleAsync();        
        return new ApplicationServiceResult<ThoughtDto>(thought);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto)
    {
        thoughtDto.LoginProfileId = userSessionProvider.LoginProfileId;
        var entity = thoughtDto.MapInsert();
        dbContext.Thoughts.Add(entity);
        await dbContext.SaveChangesAsync();
        
        // Reload the thought with the bucket to return complete data
        var savedThought = await dbContext.Thoughts
            .Where(t => t.Id == entity.Id && t.LoginProfileId == userSessionProvider.LoginProfileId)
            .Select(SelectFullThought)
            .SingleAsync();
        
        return new ApplicationServiceResult<ThoughtDto>(savedThought);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto)
    {
        if (!await IsValidUser(thoughtDto.Id))
        {
            return new ApplicationServiceResult<ThoughtDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == thoughtDto.Id && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);
        var entity = thoughtDto.MapUpdate(thoughtDbRow);
        dbContext.Thoughts.Update(entity);
        await dbContext.SaveChangesAsync();
        
        // Reload the thought with the bucket to return complete data
        var updatedThought = await dbContext.Thoughts
            .Where(t => t.Id == thoughtDto.Id && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted)
            .Select(SelectFullThought)
            .SingleAsync();
        
        return new ApplicationServiceResult<ThoughtDto>(updatedThought);
    }

    public async Task<BaseApplicationServiceResult> DeleteThought(long id)
    {
        if (!await IsValidUser(id))
        {
            return new BaseApplicationServiceResult
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == id && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);
        thoughtDbRow.IsDeleted = true;
        dbContext.Thoughts.Update(thoughtDbRow);
        await dbContext.SaveChangesAsync();
        return new BaseApplicationServiceResult();
    }

    public async Task<ApplicationServiceResult<RecentThoughtDto>> GetRecentThoughts()
    {
        var recentThoughts = await dbContext.Thoughts
            .Where(t => t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted)
            .OrderByDescending(t => t.CreatedDateTime)
            .Take(10)
            .Select(t => new RecentThoughtDto
            {
                Id = t.Id,
                Description = t.Description,
                Bucket = t.Bucket.Description
            })
            .ToListAsync();
        return new ApplicationServiceResult<RecentThoughtDto>(recentThoughts);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> GetRandomThought(long? bucketId = null)
    {
        var query = dbContext.Thoughts
            .Where(t => t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);

        if (bucketId.HasValue && bucketId.Value > 0)
        {
            query = query.Where(t => t.ThoughtBucketId == bucketId.Value);
        }

        var count = await query.CountAsync();
        if (count == 0)
        {
            return new ApplicationServiceResult<ThoughtDto>();
        }            

        var random = new Random();
        var skip = random.Next(0, count);
        
        var thought = await query
            .Select(SelectFullThought)
            .Skip(skip)
            .Take(1)
            .FirstOrDefaultAsync();

        if (thought == null)
        {
            return new ApplicationServiceResult<ThoughtDto>
            {
                StatusCode = ServiceStatusCodes.InternalServerError,
                ErrorMessage = "No thought found."
            };
        }

        return new ApplicationServiceResult<ThoughtDto>(thought);
    }

    private async Task<bool> IsValidUser(long thoughtId)
    {
        return await dbContext.Thoughts.CountAsync(t => t.Id == thoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId) > 0;
    }

    private static Expression<Func<Thought, ThoughtDto>> SelectFullThought =
    t => new ThoughtDto
    {
        Id = t.Id,
        Description = t.Description,
        TextType = t.TextType,
        LoginProfileId = t.LoginProfileId,
        ShowOnDashboard = t.ShowOnDashboard,
        ThoughtDate = t.ThoughtDate,
        Bucket = new ThoughtBucketDto
        {
            Id = t.Bucket.Id,
            Description = t.Bucket.Description,
            ThoughtModuleId = t.Bucket.ThoughtModuleId,
            ParentId = t.Bucket.ParentId,
            SortOrder = t.Bucket.SortOrder,
            ShowOnDashboard = t.Bucket.ShowOnDashboard
        },
        //Details = t.Details
        //    .Where(d => !d.IsDeleted)
        //    .Select(d => new ThoughtDetailDto
        //    {
        //        Id = d.Id,
        //        Description = d.Description,
        //        SortOrder = d.SortOrder
        //    })
        //    .OrderBy(d => d.SortOrder)
        //    .ToList(),
        //WebsiteLinks = t.WebsiteLinks
        //    .Where(w => !w.IsDeleted)
        //    .Select(w => new ThoughtWebsiteLinkDto
        //    {
        //        ThoughtId = w.ThoughtId,
        //        WebsiteLinkId = w.WebsiteLinkId,
        //        WebsiteUrl = w.WebsiteLink.WebsiteUrl,
        //        Description = w.WebsiteLink.Description,
        //        SortOrder = w.WebsiteLink.SortOrder
        //    })
        //    .OrderBy(w => w.SortOrder)
        //    .ToList()
    };
}
