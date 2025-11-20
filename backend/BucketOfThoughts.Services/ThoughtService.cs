using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Dtos;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;

namespace BucketOfThoughts.Services;

public interface IThoughtService
{
    Task<ApplicationServiceResult<ThoughtDto>> GetThoughts();
    Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto);
    Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto);
    Task<bool> DeleteThought(long id);
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext): IThoughtService
{
    public async Task<ApplicationServiceResult<ThoughtDto>> GetThoughts()
    {
        var thoughts = await dbContext.Thoughts.Select(t => new ThoughtDto
        {
            Id = t.Id,
            Description = t.Description,
            TextType = t.TextType
        }).ToListAsync();
        return new ApplicationServiceResult<ThoughtDto>(thoughts);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> AddThought(ThoughtDto thoughtDto)
    {
        var entity = thoughtDto.MapInsert();
        dbContext.Thoughts.Add(entity);
        await dbContext.SaveChangesAsync();
        thoughtDto.Id = entity.Id;
        return new ApplicationServiceResult<ThoughtDto>(thoughtDto);
    }

    public async Task<ApplicationServiceResult<ThoughtDto>> UpdateThought(ThoughtDto thoughtDto)
    {
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == thoughtDto.Id);
        var entity = thoughtDto.MapUpdate(thoughtDbRow);
        dbContext.Thoughts.Update(entity);
        await dbContext.SaveChangesAsync();
        return new ApplicationServiceResult<ThoughtDto>(thoughtDto);
    }

    public async Task<bool> DeleteThought(long id)
    {
        var thoughtDbRow = await dbContext.Thoughts.SingleAsync(t => t.Id == id);
        thoughtDbRow.IsDeleted = true;
        dbContext.Thoughts.Update(thoughtDbRow);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
