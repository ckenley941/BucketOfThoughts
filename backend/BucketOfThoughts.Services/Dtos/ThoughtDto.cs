using BucketOfThoughts.Data.Entities;

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
    extension(ThoughtDto thoughtDto)
    {
        public Thought MapInsert()
        {
            if (thoughtDto == null) throw new Exception($"MapInsert: {nameof(ThoughtDto)} null value passed to Dto mapper");
            return new Thought
            {
                Id = thoughtDto.Id,
                Description = thoughtDto.Description,
                TextType = thoughtDto.TextType
            };
        }

        public Thought MapUpdate(Thought dbRow)
        {
            if (thoughtDto == null || dbRow == null) throw new Exception($"MapUpdate: {nameof(ThoughtDto)} null value passed to Dto mapper");
            if (dbRow.Id != thoughtDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtDto)} Id mismatch passed to Dto mapper");
            dbRow.Id = thoughtDto.Id;
            dbRow.Description = thoughtDto.Description;
            dbRow.TextType = thoughtDto.TextType;
            return dbRow;
        }
    }
}
