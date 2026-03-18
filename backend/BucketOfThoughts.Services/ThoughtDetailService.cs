using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BucketOfThoughts.Services;

public interface IThoughtDetailService
{
    Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetails();
    Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetailsByThoughtId(long thoughtId);
    Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetailById(long id);
    Task<ApplicationServiceResult<ThoughtDetailDto>> AddThoughtDetail(InsertThoughtDetailDto thoughtDetailDto);
    Task<ApplicationServiceResult<ThoughtDetailDto>> UpdateThoughtDetail(InsertThoughtDetailDto thoughtDetailDto);
    Task<BaseApplicationServiceResult> DeleteThoughtDetail(long id);
}

public class ThoughtDetailService(BucketOfThoughtsDbContext dbContext, IUserSessionProvider userSessionProvider) : IThoughtDetailService
{
    public async Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetails()
    {
        var thoughtDetails = await dbContext.ThoughtDetails
            .Where(td => td.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !td.IsDeleted)
            .Select(SelectFullThoughtDetail)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetails);
    }

    public async Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetailsByThoughtId(long thoughtId)
    {
        if (!await IsValidThoughtUser(thoughtId))
        {
            return new ApplicationServiceResult<ThoughtDetailDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtDetails = await dbContext.ThoughtDetails
            .Where(td => td.ThoughtId == thoughtId && !td.IsDeleted)
            .Select(SelectFullThoughtDetail)
            .OrderBy(td => td.SortOrder)
            .ToListAsync();
        return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetails);
    }

    public async Task<ApplicationServiceResult<ThoughtDetailDto>> GetThoughtDetailById(long id)
    {
        if (!await IsValidUser(id))
        {
            return new ApplicationServiceResult<ThoughtDetailDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtDetail = await dbContext.ThoughtDetails
            .Where(td => td.Id == id && td.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !td.IsDeleted)
            .Select(SelectFullThoughtDetail)
            .SingleAsync();
        return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetail);
    }

    public async Task<ApplicationServiceResult<ThoughtDetailDto>> AddThoughtDetail(InsertThoughtDetailDto thoughtDetailDto)
    {
        if (!await IsValidThoughtUser(thoughtDetailDto.ThoughtId))
        {
            return new ApplicationServiceResult<ThoughtDetailDto>
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        if (thoughtDetailDto.TextType == TextTypes.Json)
        {
            var i = 0;
            thoughtDetailDto.JsonDetails.Keys.ForEach((k) =>
            {
                i++;
                thoughtDetailDto.JsonDetails.Json = thoughtDetailDto.JsonDetails.Json.Replace($"Column{i}", k);
            });

            var jsonHeader = new ThoughtDetail
            {
                ThoughtId = thoughtDetailDto.ThoughtId,
                Description = string.Join("|", thoughtDetailDto.JsonDetails.Keys),
                SortOrder = 1
            };
            var jsonDetail = new ThoughtDetail
            {
                ThoughtId = thoughtDetailDto.ThoughtId,
                Description = thoughtDetailDto.JsonDetails.Json,
                SortOrder = 2
            };
            dbContext.ThoughtDetails.AddRange([jsonHeader, jsonDetail]);
            await dbContext.SaveChangesAsync();
            thoughtDetailDto.Id = jsonHeader.Id;
            return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetailDto);
        }
        else
        {
            var entity = thoughtDetailDto.MapInsert();
            dbContext.ThoughtDetails.Add(entity);
            await dbContext.SaveChangesAsync();
            thoughtDetailDto.Id = entity.Id;
            return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetailDto);
        }
    }

    public async Task<ApplicationServiceResult<ThoughtDetailDto>> UpdateThoughtDetail(InsertThoughtDetailDto thoughtDetailDto)
    {
        if (thoughtDetailDto.TextType == TextTypes.Json)
        {
            // For Json type, validate ThoughtId ownership first
            if (!await IsValidThoughtUser(thoughtDetailDto.ThoughtId))
            {
                return new ApplicationServiceResult<ThoughtDetailDto>
                {
                    StatusCode = ServiceStatusCodes.UserForbidden,
                    ErrorMessage = ApplicationServiceMessages.UserForbidden
                };
            }

            // For Json type, we need to update both the header (SortOrder 1) and detail (SortOrder 2) records
            // Find both records by ThoughtId and SortOrder
            var existingHeader = await dbContext.ThoughtDetails
                .SingleOrDefaultAsync(td => td.ThoughtId == thoughtDetailDto.ThoughtId && td.SortOrder == 1 && !td.IsDeleted);
            var existingDetail = await dbContext.ThoughtDetails
                .SingleOrDefaultAsync(td => td.ThoughtId == thoughtDetailDto.ThoughtId && td.SortOrder == 2 && !td.IsDeleted);

            if (existingHeader == null || existingDetail == null)
            {
                return new ApplicationServiceResult<ThoughtDetailDto>
                {
                    StatusCode = ServiceStatusCodes.InternalServerError,
                    ErrorMessage = "Json detail records not found for update"
                };
            }

            // Replace Column placeholders with actual column names
            var i = 0;
            thoughtDetailDto.JsonDetails.Keys.ForEach((k) =>
            {
                i++;
                thoughtDetailDto.JsonDetails.Json = thoughtDetailDto.JsonDetails.Json.Replace($"Column{i}", k);
            });

            // Update header record
            existingHeader.Description = string.Join("|", thoughtDetailDto.JsonDetails.Keys);
            existingHeader.SortOrder = 1;

            // Update detail record
            existingDetail.Description = thoughtDetailDto.JsonDetails.Json;
            existingDetail.SortOrder = 2;

            dbContext.ThoughtDetails.UpdateRange([existingHeader, existingDetail]);
            await dbContext.SaveChangesAsync();
            thoughtDetailDto.Id = existingHeader.Id;

            return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetailDto);
        }
        else
        {
            // For PlainText type, validate by detail Id
            if (!await IsValidUser(thoughtDetailDto.Id))
            {
                return new ApplicationServiceResult<ThoughtDetailDto>
                {
                    StatusCode = ServiceStatusCodes.UserForbidden,
                    ErrorMessage = ApplicationServiceMessages.UserForbidden
                };
            }

            var thoughtDetailDbRow = await dbContext.ThoughtDetails
                .SingleAsync(td => td.Id == thoughtDetailDto.Id && td.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !td.IsDeleted);
            var entity = thoughtDetailDto.MapUpdate(thoughtDetailDbRow);
            dbContext.ThoughtDetails.Update(entity);
            await dbContext.SaveChangesAsync();
            return new ApplicationServiceResult<ThoughtDetailDto>(thoughtDetailDto);
        }
    }

    public async Task<BaseApplicationServiceResult> DeleteThoughtDetail(long id)
    {
        if (!await IsValidUser(id))
        {
            return new BaseApplicationServiceResult
            {
                StatusCode = ServiceStatusCodes.UserForbidden,
                ErrorMessage = ApplicationServiceMessages.UserForbidden
            };
        }

        var thoughtDetailDbRow = await dbContext.ThoughtDetails
            .SingleAsync(td => td.Id == id && td.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !td.IsDeleted);
        thoughtDetailDbRow.IsDeleted = true;
        dbContext.ThoughtDetails.Update(thoughtDetailDbRow);
        await dbContext.SaveChangesAsync();
        return new BaseApplicationServiceResult();
    }

    private async Task<bool> IsValidUser(long thoughtDetailId)
    {
        return await dbContext.ThoughtDetails
            .CountAsync(td => td.Id == thoughtDetailId && td.Thought.LoginProfileId == userSessionProvider.LoginProfileId && !td.IsDeleted) > 0;
    }

    private async Task<bool> IsValidThoughtUser(long thoughtId)
    {
        return await dbContext.Thoughts
            .CountAsync(t => t.Id == thoughtId && t.LoginProfileId == userSessionProvider.LoginProfileId && !t.IsDeleted) > 0;
    }

    private static Expression<Func<ThoughtDetail, ThoughtDetailDto>> SelectFullThoughtDetail =
        td => new ThoughtDetailDto
        {
            Id = td.Id,
            Description = td.Description,
            ThoughtId = td.ThoughtId,
            SortOrder = td.SortOrder,
            TextType = td.Thought.TextType
        };
}

