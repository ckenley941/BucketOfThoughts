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
    Task MarkThoughtAsViewedAsync(long thoughtId);
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext, IUserSessionProvider userSessionProvider, ICacheService cacheService): IThoughtService
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
            .Where(t => t.Id == id && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted)
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
        
        // Cache as Added
        await CacheRecentThoughtAsync(savedThought, RecentThoughtStatus.Added);
        
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
        var userId = userSessionProvider.LoginProfileId;
        var keys = await cacheService.GetUserRecentThoughtKeysAsync(userId);
        
        var recentThoughts = new List<RecentThoughtDto>();
        foreach (var key in keys)
        {
            var cachedThought = await cacheService.GetAsync<RecentThoughtDto>(key);
            if (cachedThought != null)
            {
                recentThoughts.Add(cachedThought);
            }
        }
        
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

        // Cache as Random
        await CacheRecentThoughtAsync(thought, RecentThoughtStatus.Random);

        return new ApplicationServiceResult<ThoughtDto>(thought);
    }

    public async Task MarkThoughtAsViewedAsync(long thoughtId)
    {
        var userId = userSessionProvider.LoginProfileId;
        var cacheKey = $"{userId}_{thoughtId}";
        
        // Check if exists in cache
        var existing = await cacheService.GetAsync<RecentThoughtDto>(cacheKey);
        
        if (existing != null)
        {
            // Update status and move to top
            existing.Status = RecentThoughtStatus.Viewed;
            await cacheService.SetAsync(cacheKey, existing);
            await cacheService.AddUserRecentThoughtKeyAsync(userId, cacheKey);
        }
        else
        {
            // Get thought from database and cache it
            var thought = await dbContext.Thoughts
                .Where(t => t.Id == thoughtId && t.LoginProfileId == userId && !t.IsDeleted)
                .Select(SelectFullThought)
                .FirstOrDefaultAsync();
            
            if (thought != null)
            {
                await CacheRecentThoughtAsync(thought, RecentThoughtStatus.Viewed);
            }
        }
    }

    private async Task CacheRecentThoughtAsync(ThoughtDto thought, RecentThoughtStatus status)
    {
        var userId = userSessionProvider.LoginProfileId;
        var cacheKey = $"{userId}_{thought.Id}";
        
        var recentThought = new RecentThoughtDto
        {
            Id = thought.Id,
            Description = thought.Description,
            TextType = thought.TextType,
            LoginProfileId = thought.LoginProfileId,
            ShowOnDashboard = thought.ShowOnDashboard,
            ThoughtDate = thought.ThoughtDate,
            Bucket = thought.Bucket,
            Status = status
        };
        
        await cacheService.SetAsync(cacheKey, recentThought);
        await cacheService.AddUserRecentThoughtKeyAsync(userId, cacheKey);
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
            ModuleDescription = t.Bucket.ThoughtModule.Description,
            ParentId = t.Bucket.ParentId,
            ParentDescription = t.Bucket.Parent != null ? t.Bucket.Parent.Description : null,
            SortOrder = t.Bucket.SortOrder,
            ShowOnDashboard = t.Bucket.ShowOnDashboard
        },
        Details = t.Details
            .Where(d => !d.IsDeleted)
            .Select(d => new ThoughtDetailDto
            {
                Id = d.Id,
                Description = d.Description,
                ThoughtId = d.ThoughtId,
                SortOrder = d.SortOrder,
                TextType = t.TextType
            })
            .OrderBy(d => d.SortOrder)
            .ToList()
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
