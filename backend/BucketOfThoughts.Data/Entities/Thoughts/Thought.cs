using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;

public partial class Thought : BaseUserDbTable
{
    public Guid ThoughtGuid { get; set; } = Guid.NewGuid();
    public string Description { get; set; } = null!;
    public long ThoughtBucketId { get; set; }
    public virtual ThoughtBucket Bucket { get; set; } = null!;
    [MaxLength(25)]
    public string TextType { get; set; } = "PlainText";
    public DateTime ThoughtDate { get; set; }
    public bool ShowOnDashboard { get; set; }
    public bool IsDeleted { get; set; } = false;
    public ICollection<RelatedThought> ParentLinks { get; set; } = [];
    public ICollection<RelatedThought> RelatedThoughts { get; set; } = [];
    public ICollection<ThoughtDetail> Details { get; set; } = [];
    public ICollection<ThoughtWebsiteLink> WebsiteLinks { get; set; } = [];
}
