namespace BucketOfThoughts.Data.Entities;

public partial class ThoughtWebsiteLink 
{
    public long ThoughtId { get; set; }
    public long WebsiteLinkId { get; set; }
    public Thought Thought { get; set; } = null!;
    public WebsiteLink WebsiteLink { get; set; } = null!;
    public bool IsDeleted { get; set; } = false;
}
