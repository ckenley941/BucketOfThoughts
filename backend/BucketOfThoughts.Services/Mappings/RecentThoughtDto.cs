namespace BucketOfThoughts.Services.Mappings;

public class RecentThoughtDto : BaseDto
{
    public string Description { get; set; } = null!;
    public string Bucket { get; set; } = null!;
}

