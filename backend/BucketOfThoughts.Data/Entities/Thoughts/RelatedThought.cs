namespace BucketOfThoughts.Data.Entities;

public partial class RelatedThought : BaseDbTable
{
    public long ParentThoughtId { get; set; }
    public long RelatedThoughtId { get; set; }
    public Thought ParentThought { get; set; } = null!;
    public Thought RelatedThoughtEntity { get; set; } = null!;
}
