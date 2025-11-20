using System.ComponentModel.DataAnnotations;

namespace BucketOfThoughts.Data.Entities;

public partial class WebsiteLink : BaseModifiableDbTable
{
    [MaxLength(1000)]
    public string WebsiteUrl { get; set; } = null!;
    [MaxLength(256)]
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = [];
}
