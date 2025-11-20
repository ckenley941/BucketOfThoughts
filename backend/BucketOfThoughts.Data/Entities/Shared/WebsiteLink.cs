using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("WebsiteLink")]
public partial class WebsiteLink : BaseModifiableDbTable
{
    public string WebsiteUrl { get; set; } = null!;
    public string? Description { get; set; }
    public int? SortOrder { get; set; }
    public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = new List<ThoughtWebsiteLink>();
}
