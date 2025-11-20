using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;
public partial class ThoughtDetail : BaseModifiableDbTable
{
    [MaxLength(Int32.MaxValue)]
    public string Description { get; set; } = null!;
    public long ThoughtId { get; set; }
    public Thought Thought { get; set; } = null!;
    public int SortOrder { get; set; }
    public bool IsDeleted { get; set; } = false;
}
