using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("ThoughtBucket")]
public partial class ThoughtBucket : BaseUserDbTable
{
    public long ThoughtModuleId { get; set; }
    public virtual ThoughtModule ThoughtModule { get; set; } = null!;
    public string Description { get; set; } = null!;
    public long? ParentId { get; set; }
    public int? SortOrder { get; set; }
    public bool? ShowOnDashboard { get; set; } = true;
    public virtual ICollection<Thought> Thoughts { get; set; } = new List<Thought>();
}
