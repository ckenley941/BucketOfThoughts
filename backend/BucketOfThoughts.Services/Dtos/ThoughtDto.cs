namespace BucketOfThoughts.Services.Dtos;

public partial class ThoughtDto : BaseDto
{
    public string Description { get; set; } = null!;
    public string TextType { get; set; } = "PlainText";
    //public virtual ThoughtBucket ThoughtBucket { get; set; } = null!;
    //public virtual ICollection<ThoughtDetail> ThoughtDetails { get; set; } = new List<ThoughtDetail>();
    //public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = new List<ThoughtWebsiteLink>();
}
