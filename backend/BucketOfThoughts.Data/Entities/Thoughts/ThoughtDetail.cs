using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;
public partial class ThoughtDetail : BaseModifiableDbTable
{
    [MaxLength(Int32.MaxValue)]
    public string Description { get; set; } = null!;
    public long ThoughtId { get; set; }
    public int? SortOrder { get; set; }
    public Thought Thought { get; set; } = null!;
}
