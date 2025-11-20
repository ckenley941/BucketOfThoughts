using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("Thought")]
public partial class Thought : BaseUserDbTable
{
    public Guid ThoughtGuid { get; set; } = Guid.NewGuid();
    public string Description { get; set; } = null!;
    public long ThoughtBucketId { get; set; }
    [MaxLength(25)]
    public string TextType { get; set; } = "PlainText";
    public bool IsDeleted { get; set; } = false;
    //public virtual ICollection<RelatedThought> RelatedThoughtThoughtId1Navigations { get; set; } = new List<RelatedThought>();
    //public virtual ICollection<RelatedThought> RelatedThoughtThoughtId2Navigations { get; set; } = new List<RelatedThought>();
    //public virtual ThoughtBucket ThoughtBucket { get; set; } = null!;
    //public virtual ICollection<ThoughtDetail> ThoughtDetails { get; set; } = new List<ThoughtDetail>();
    //public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = new List<ThoughtWebsiteLink>();
}
