using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;

public partial class ThoughtModule : BaseDbTable
{
    [MaxLength(256)]
    public string Description { get; set; } = null!;
    public ICollection<ThoughtBucket> ThoughtBuckets { get; set; } = [];
}
