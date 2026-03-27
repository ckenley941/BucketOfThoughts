using BucketOfThoughts.Data;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;

namespace BucketOfThoughts.Services;

public interface IThoughtModuleService
{
    Task<ApplicationServiceResult<ThoughtModuleDto>> GetThoughtModules();
}

public class ThoughtModuleService(BucketOfThoughtsDbContext dbContext) : IThoughtModuleService
{
    public async Task<ApplicationServiceResult<ThoughtModuleDto>> GetThoughtModules()
    {
        var modules = await dbContext.ThoughtModules
            .AsNoTracking()
            .OrderBy(tm => tm.Description)
            .Select(tm => new ThoughtModuleDto
            {
                Id = tm.Id,
                Description = tm.Description,
            })
            .ToListAsync();

        return new ApplicationServiceResult<ThoughtModuleDto>(modules);
    }
}
