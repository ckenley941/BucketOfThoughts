using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

[Table("ThoughtWebsiteLink")]
public partial class ThoughtWebsiteLink 
{
    public int ThoughtId { get; set; }
    public int WebsiteLinkId { get; set; }
    public virtual Thought Thought { get; set; } = null!;
    public virtual WebsiteLink WebsiteLink { get; set; } = null!;
}
