using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;

public partial class ThoughtBucket : BaseUserDbTable
{
    public long ThoughtModuleId { get; set; }
    public ThoughtModule ThoughtModule { get; set; } = null!;
    [MaxLength(256)]
    public string Description { get; set; } = null!;
    public long? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool ShowOnDashboard { get; set; } = true;
    public ICollection<Thought> Thoughts { get; set; } = [];
}
