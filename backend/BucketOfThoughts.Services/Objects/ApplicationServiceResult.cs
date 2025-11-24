using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;

namespace BucketOfThoughts.Services.Objects;

public class BaseApplicationServiceResult
{
    public ServiceStatusCodes StatusCode { get; set; }
    public string? ErrorMessage { get; set; }
    public bool IsSuccess { get { return string.IsNullOrEmpty(ErrorMessage); } }
}

public class ApplicationServiceResult<TDto>: BaseApplicationServiceResult where TDto : BaseDto, new()
{
    public ApplicationServiceResult() { }
    public ApplicationServiceResult(TDto result) => Results = [result];
    public ApplicationServiceResult(IEnumerable<TDto> results) => Results = results;
    public IEnumerable<TDto> Results { get; set; } = [];
    public TDto SingleResult { get { return Results.FirstOrDefault() ?? new TDto(); } }
}