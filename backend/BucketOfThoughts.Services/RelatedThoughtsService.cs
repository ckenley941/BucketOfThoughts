using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BucketOfThoughts.Services;

public interface IRelatedThoughtsService
{
    Task<ApplicationServiceResult<RelatedThoughtDto>> GetRelatedThoughts(long parentThoughtId);
    Task<ApplicationServiceResult<RelatedThoughtDto>> AddRelatedThought(RelatedThoughtDto relatedThoughtDto);
    Task<BaseApplicationServiceResult> DeleteRelatedThought(long id);
}

public class RelatedThoughtsService(BucketOfThoughtsDbContext dbContext, IUserSessionProvider userSessionProvider) : IRelatedThoughtsService
{
    public async Task<ApplicationServiceResult<RelatedThoughtDto>> GetRelatedThoughts(long parentThoughtId)
    {
        // Verify the parent thought belongs to the current user
        var parentThought = await dbContext.Thoughts
            .FirstOrDefaultAsync(t => t.Id == parentThoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);

        if (parentThought == null)
        {
            return new ApplicationServiceResult<RelatedThoughtDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var relatedThoughts = await dbContext.RelatedThoughts
            .Where(rt => rt.ParentThoughtId == parentThoughtId)
            .OrderBy(rt => rt.SortOrder)
            .Select(SelectFullRelatedThought)
            .ToListAsync();

        return new ApplicationServiceResult<RelatedThoughtDto>(relatedThoughts);
    }

    public async Task<ApplicationServiceResult<RelatedThoughtDto>> AddRelatedThought(RelatedThoughtDto relatedThoughtDto)
    {
        // Verify the parent thought belongs to the current user
        var parentThought = await dbContext.Thoughts
            .FirstOrDefaultAsync(t => t.Id == relatedThoughtDto.ParentThoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);

        if (parentThought == null)
        {
            return new ApplicationServiceResult<RelatedThoughtDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        // Verify the related thought exists and belongs to the current user
        var relatedThought = await dbContext.Thoughts
            .FirstOrDefaultAsync(t => t.Id == relatedThoughtDto.RelatedThoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted);

        if (relatedThought == null)
        {
            return new ApplicationServiceResult<RelatedThoughtDto>
            {
                StatusCode = ServiceStatusCodes.NotFound,
                ErrorMessage = "Related thought not found or you don't have access to it."
            };
        }

        // Check if the relationship already exists
        var existing = await dbContext.RelatedThoughts
            .FirstOrDefaultAsync(rt => rt.ParentThoughtId == relatedThoughtDto.ParentThoughtId && rt.RelatedThoughtId == relatedThoughtDto.RelatedThoughtId);

        if (existing != null)
        {
            return new ApplicationServiceResult<RelatedThoughtDto>
            {
                StatusCode = ServiceStatusCodes.InternalServerError,
                ErrorMessage = "This relationship already exists."
            };
        }

        // Get the next sort order
        var maxSortOrder = await dbContext.RelatedThoughts
            .Where(rt => rt.ParentThoughtId == relatedThoughtDto.ParentThoughtId)
            .Select(rt => (int?)rt.SortOrder)
            .MaxAsync() ?? 0;

        relatedThoughtDto.SortOrder = maxSortOrder + 1;

        var entity = relatedThoughtDto.MapInsert();
        dbContext.RelatedThoughts.Add(entity);
        await dbContext.SaveChangesAsync();

        // Reload with full data
        var savedRelatedThought = await dbContext.RelatedThoughts
            .Where(rt => rt.Id == entity.Id)
            .Select(SelectFullRelatedThought)
            .FirstOrDefaultAsync();

        if (savedRelatedThought == null)
        {
            return new ApplicationServiceResult<RelatedThoughtDto>
            {
                StatusCode = ServiceStatusCodes.InternalServerError,
                ErrorMessage = "Failed to retrieve saved related thought."
            };
        }

        return new ApplicationServiceResult<RelatedThoughtDto>(savedRelatedThought);
    }

    public async Task<BaseApplicationServiceResult> DeleteRelatedThought(long id)
    {
        var relatedThought = await dbContext.RelatedThoughts
            .Include(rt => rt.ParentThought)
            .FirstOrDefaultAsync(rt => rt.Id == id);

        if (relatedThought == null)
        {
            return new BaseApplicationServiceResult
            {
                StatusCode = ServiceStatusCodes.NotFound,
                ErrorMessage = "Related thought not found."
            };
        }

        // Verify the parent thought belongs to the current user
        if (relatedThought.ParentThought.LoginProfileId != userSessionProvider.LoginProfileId)
        {
            return new BaseApplicationServiceResult
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        dbContext.RelatedThoughts.Remove(relatedThought);
        await dbContext.SaveChangesAsync();

        return new BaseApplicationServiceResult();
    }

    private static Expression<Func<RelatedThought, RelatedThoughtDto>> SelectFullRelatedThought =
        rt => new RelatedThoughtDto
        {
            Id = rt.Id,
            ParentThoughtId = rt.ParentThoughtId,
            RelatedThoughtId = rt.RelatedThoughtId,
            SortOrder = rt.SortOrder,
            RelatedThought = new ThoughtDto
            {
                Id = rt.RelatedThoughtEntity.Id,
                Description = rt.RelatedThoughtEntity.Description,
                TextType = rt.RelatedThoughtEntity.TextType,
                LoginProfileId = rt.RelatedThoughtEntity.LoginProfileId,
                ShowOnDashboard = rt.RelatedThoughtEntity.ShowOnDashboard,
                ThoughtDate = rt.RelatedThoughtEntity.ThoughtDate,
                Bucket = new ThoughtBucketDto
                {
                    Id = rt.RelatedThoughtEntity.Bucket.Id,
                    Description = rt.RelatedThoughtEntity.Bucket.Description,
                    ThoughtModuleId = rt.RelatedThoughtEntity.Bucket.ThoughtModuleId,
                    ParentId = rt.RelatedThoughtEntity.Bucket.ParentId,
                    SortOrder = rt.RelatedThoughtEntity.Bucket.SortOrder,
                    ShowOnDashboard = rt.RelatedThoughtEntity.Bucket.ShowOnDashboard
                }
            }
        };
}
