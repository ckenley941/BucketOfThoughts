namespace BucketOfThoughts.Services.Dtos;

public partial class ThoughtDto : BaseDto
{
    public string Description { get; set; } = null!;
    public string TextType { get; set; } = "PlainText";
    //public virtual ThoughtBucket ThoughtBucket { get; set; } = null!;
    //public virtual ICollection<ThoughtDetail> ThoughtDetails { get; set; } = new List<ThoughtDetail>();
    //public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; } = new List<ThoughtWebsiteLink>();
}

public static class ThoughtMapper
{
    public static ThoughtDto ToDto(this Data.Entities.Thought thought)
    {
        if (thought == null) return null!;
        return new ThoughtDto
        {
            Id = thought.Id,
            Description = thought.Description,
            TextType = thought.TextType
        };
    }

    public static Data.Entities.Thought ToEntity(this ThoughtDto thoughtDto)
    {
        if (thoughtDto == null) return null!;
        return new Data.Entities.Thought
        {
            Id = thoughtDto.Id,
            Description = thoughtDto.Description,
            TextType = thoughtDto.TextType
        };
    }

}
