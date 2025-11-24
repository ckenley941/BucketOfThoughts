using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BucketOfThoughts.Services;

public interface IThoughtBucketService
{
    Task<ApplicationServiceResult<ThoughtBucketDto>> GetThoughtBuckets();
    Task<ApplicationServiceResult<ThoughtBucketDto>> GetThoughtBucketById(long id);
    Task<ApplicationServiceResult<ThoughtBucketDto>> AddThoughtBucket(ThoughtBucketDto thoughtBucketDto);
    Task<ApplicationServiceResult<ThoughtBucketDto>> UpdateThoughtBucket(ThoughtBucketDto thoughtBucketDto);
    Task<bool> DeleteThoughtBucket(long id);
}

public class ThoughtBucketService(BucketOfThoughtsDbContext dbContext) : IThoughtBucketService
{
    public async Task<ApplicationServiceResult<ThoughtBucketDto>> GetThoughtBuckets()
    {
        var thoughtBuckets = await dbContext.ThoughtBuckets
            .Select(SelectFullThoughtBucket)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtBucketDto>(thoughtBuckets);
    }

    public async Task<ApplicationServiceResult<ThoughtBucketDto>> GetThoughtBucketById(long id)
    {
        var thoughtBucket = await dbContext.ThoughtBuckets
            .Where(tb => tb.Id == id)
            .Select(SelectFullThoughtBucket)
            .SingleAsync();
        return new ApplicationServiceResult<ThoughtBucketDto>(thoughtBucket);
    }

    public async Task<ApplicationServiceResult<ThoughtBucketDto>> AddThoughtBucket(ThoughtBucketDto thoughtBucketDto)
    {
        var entity = thoughtBucketDto.MapInsert();
        dbContext.ThoughtBuckets.Add(entity);
        await dbContext.SaveChangesAsync();
        thoughtBucketDto.Id = entity.Id;
        return new ApplicationServiceResult<ThoughtBucketDto>(thoughtBucketDto);
    }

    public async Task<ApplicationServiceResult<ThoughtBucketDto>> UpdateThoughtBucket(ThoughtBucketDto thoughtBucketDto)
    {
        var thoughtBucketDbRow = await dbContext.ThoughtBuckets.SingleAsync(tb => tb.Id == thoughtBucketDto.Id);
        var entity = thoughtBucketDto.MapUpdate(thoughtBucketDbRow);
        dbContext.ThoughtBuckets.Update(entity);
        await dbContext.SaveChangesAsync();
        return new ApplicationServiceResult<ThoughtBucketDto>(thoughtBucketDto);
    }

    public async Task<bool> DeleteThoughtBucket(long id)
    {
        var thoughtBucketDbRow = await dbContext.ThoughtBuckets.SingleAsync(tb => tb.Id == id);
        dbContext.ThoughtBuckets.Remove(thoughtBucketDbRow);
        return await dbContext.SaveChangesAsync() > 0;
    }

    private static Expression<Func<ThoughtBucket, ThoughtBucketDto>> SelectFullThoughtBucket =
        tb => new ThoughtBucketDto
        {
            Id = tb.Id,
            ThoughtModuleId = tb.ThoughtModuleId,
            Description = tb.Description,
            ParentId = tb.ParentId,
            SortOrder = tb.SortOrder,
            ShowOnDashboard = tb.ShowOnDashboard
        };
}




