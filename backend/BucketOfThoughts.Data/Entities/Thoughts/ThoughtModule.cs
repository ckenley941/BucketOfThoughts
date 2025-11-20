using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("ThoughtModule")]
public partial class ThoughtModule : BaseDbTable
{
    public string Description { get; set; } = null!;
    public virtual ICollection<ThoughtBucket> ThoughtBuckets { get; set; } = new List<ThoughtBucket>();
}
