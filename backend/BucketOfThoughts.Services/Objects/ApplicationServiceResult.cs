using BucketOfThoughts.Services.Constants;
using BucketOfThoughts.Services.Mappings;

namespace BucketOfThoughts.Services.Objects;

public class ApplicationServiceResult<TDto> where TDto : BaseDto
{
    public ApplicationServiceResult() { }
    public ApplicationServiceResult(TDto result) => Results = [result];
    public ApplicationServiceResult(IEnumerable<TDto> results) => Results = results;
    public IEnumerable<TDto> Results { get; set; } = [];
    public TDto SingleResult { get { return Results.Single() ?? throw new Exception(ApplicationServiceMessage.SingleResultNotFound); } }
}