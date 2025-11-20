namespace BucketOfThoughts.Services.Models
{
    public class ServiceResponse<TModel> where TModel : BaseModel
    {
        public IEnumerable<TModel> Results { get; set; } = [];
        public bool IsSuccess { get { return string.IsNullOrEmpty(ErrorMessage); } }
        public string? ErrorMessage { get; set; }
    }
}
