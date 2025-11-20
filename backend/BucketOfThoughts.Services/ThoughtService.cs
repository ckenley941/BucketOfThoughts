using BucketOfThoughts.Data;
using BucketOfThoughts.Services.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BucketOfThoughts.Services;

public interface IThoughtService
{
    Task<IList<ThoughtDto>> GetThoughts();
}

public class ThoughtService(BucketOfThoughtsDbContext dbContext): IThoughtService
{
    public async Task<IList<ThoughtDto>> GetThoughts()
    {
        var thoughts = new List<ThoughtDto>()
        {
            new ThoughtDto()
            {
                Id = 1,
                Description = "testing"
            }
        };
        //var thoughts = await dbContext.Thoughts.Select(t => new ThoughtDto
        //{
        //    Id = t.Id,
        //    Description = t.Description,
        //    TextType = t.TextType
        //}).ToListAsync();
        return thoughts;
    }
}
