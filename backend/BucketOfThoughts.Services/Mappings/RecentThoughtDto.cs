namespace BucketOfThoughts.Services.Mappings;

public enum RecentThoughtStatus
{
    Added,
    Viewed,
    Random
}

public class RecentThoughtDto : ThoughtDto
{
    public RecentThoughtStatus Status { get; set; }
}

