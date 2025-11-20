using BucketOfThoughts.Services.Dtos;

namespace BucketOfThoughts.Api.Objects;

public class ApiResponse<TDto> where TDto : BaseDto
{
    public IEnumerable<TDto> Results { get; set; } = [];
    public bool IsSuccess { get { return string.IsNullOrEmpty(ErrorMessage); } }
    public string? ErrorMessage { get; set; }
}
