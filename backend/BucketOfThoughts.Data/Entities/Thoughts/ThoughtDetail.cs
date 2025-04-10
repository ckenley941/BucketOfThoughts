using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;
[Table("ThoughtDetail")]
public partial class ThoughtDetail : BaseModifiableDbTable
{
    public string Description { get; set; } = null!;
    public int ThoughtId { get; set; }
    public int? SortOrder { get; set; }
    public virtual Thought Thought { get; set; } = null!;
}
