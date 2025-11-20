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
    public long LoginProfileId { get; set; }
    Task<ApplicationServiceResult<ThoughtDto>> GetThoughts();
    Task<ApplicationServiceResult<ThoughtDto>> GetThoughtById(long id);
    Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto);
    Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto);
    Task<bool> DeleteThought(long id);
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext): IThoughtService
{
    public long LoginProfileId { get; set; }
    public async Task<ApplicationServiceResult<ThoughtDto>> GetThoughts()
    {
        var thoughts = await dbContext.Thoughts
            .Where(t => t.LoginProfileId == LoginProfileId && !t.IsDeleted)
            .Select(SelectFullThought)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtDto>(thoughts);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> GetThoughtById(long id)
    {
        var thought = await dbContext.Thoughts
            .Where(t => t.Id == id && t.LoginProfileId == LoginProfileId && !t.IsDeleted )
            .Select(SelectFullThought)
            .SingleAsync();        
        return new ApplicationServiceResult<ThoughtDto>(thought);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto)
    {
        await Validate(thoughtDto.Id);
        var entity = thoughtDto.MapInsert();
        dbContext.Thoughts.Add(entity);
        await dbContext.SaveChangesAsync();
        thoughtDto.Id = entity.Id;
        return new ApplicationServiceResult<ThoughtDto>(thoughtDto);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto)
    {
        await Validate(thoughtDto.Id);
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == thoughtDto.Id && t.LoginProfileId == LoginProfileId && !t.IsDeleted);
        var entity = thoughtDto.MapUpdate(thoughtDbRow);
        dbContext.Thoughts.Update(entity);
        await dbContext.SaveChangesAsync();
        return new ApplicationServiceResult<ThoughtDto>(thoughtDto);
    }

    public async Task<bool> DeleteThought(long id)
    {
        await Validate(id);
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == id && t.LoginProfileId == LoginProfileId && !t.IsDeleted);
        thoughtDbRow.IsDeleted = true;
        dbContext.Thoughts.Update(thoughtDbRow);
        return await dbContext.SaveChangesAsync() > 0;
    }

    private async Task Validate(long thoughtId)
    {
        if (await dbContext.Thoughts.CountAsync(t => t.Id == thoughtId && t.LoginProfileId == LoginProfileId) == 0)
        {
            throw new UserForbiddenCustomException();
        }
    }

    private static Expression<Func<Thought, ThoughtDto>> SelectFullThought =
    t => new ThoughtDto
    {
        Id = t.Id,
        Description = t.Description,
        TextType = t.TextType,
        Bucket = new ThoughtBucketDto
        {
            Description = t.Bucket.Description,
            Id = t.Bucket.Id
        },
        Details = t.Details
            .Where(d => !d.IsDeleted)
            .Select(d => new ThoughtDetailDto
            {
                Id = d.Id,
                Description = d.Description,
                SortOrder = d.SortOrder
            })
            .OrderBy(d => d.SortOrder)
            .ToList(),
        WebsiteLinks = t.WebsiteLinks
            .Where(w => !w.IsDeleted)
            .Select(w => new ThoughtWebsiteLinkDto
            {
                ThoughtId = w.ThoughtId,
                WebsiteLinkId = w.WebsiteLinkId,
                WebsiteUrl = w.WebsiteLink.WebsiteUrl,
                Description = w.WebsiteLink.Description,
                SortOrder = w.WebsiteLink.SortOrder
            })
            .OrderBy(w => w.SortOrder)
            .ToList()
    };
}
