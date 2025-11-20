using BucketOfThoughts.Data;
using BucketOfThoughts.Services.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BucketOfThoughts.Services;

public interface IThoughtService
{
    Task<IList<ThoughtDto>> GetThoughts();
    Task<ThoughtDto> AddThought(ThoughtDto thoughtDto);
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext): IThoughtService
{
    public async Task<IList<ThoughtDto>> GetThoughts()
    {
        var thoughts = await dbContext.Thoughts.Select(t => new ThoughtDto
        {
            Id = t.Id,
            Description = t.Description,
            TextType = t.TextType
        }).ToListAsync();
        return thoughts;
    }

    public async Task<ThoughtDto> AddThought(ThoughtDto thoughtDto)
    {
        var entity = ThoughtMapper.ToEntity(thoughtDto);
        dbContext.Thoughts.Add(entity);
        await dbContext.SaveChangesAsync();
        thoughtDto.Id = entity.Id;
        return thoughtDto;
    }
}
