using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("RelatedThought")]
public partial class RelatedThought : BaseDbTable
{
    public int ThoughtId1 { get; set; }
    public int ThoughtId2 { get; set; }
    public virtual Thought ThoughtId1Navigation { get; set; } = null!;
    public virtual Thought ThoughtId2Navigation { get; set; } = null!;
}
