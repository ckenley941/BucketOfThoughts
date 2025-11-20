using BucketOfThoughts.Services.Dtos;

namespace BucketOfThoughts.Services.Objects;

public class ApplicationServiceResult<TDto> where TDto : BaseDto
{
    public ApplicationServiceResult() { }
    public ApplicationServiceResult(TDto result) => Results = [result];
    public ApplicationServiceResult(IEnumerable<TDto> results) => Results = results;

    public IEnumerable<TDto> Results { get; set; } = [];
    public bool IsSuccess { get { return string.IsNullOrEmpty(ErrorMessage); } }
    public string? ErrorMessage { get; set; }
}