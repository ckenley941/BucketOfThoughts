using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;

public partial class Thought : BaseUserDbTable
{
    public Guid ThoughtGuid { get; set; } = Guid.NewGuid();
    public string Description { get; set; } = null!;
    public long ThoughtBucketId { get; set; }
    public virtual ThoughtBucket ThoughtBucket { get; set; } = null!;
    [MaxLength(25)]
    public string TextType { get; set; } = "PlainText";
    public bool IsDeleted { get; set; } = false;
    public ICollection<RelatedThought> ParentLinks { get; set; } = [];
    public ICollection<RelatedThought> RelatedThoughts { get; set; } = [];
    public ICollection<ThoughtDetail> ThoughtDetails { get; set; } = [];
    public ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = [];
}
