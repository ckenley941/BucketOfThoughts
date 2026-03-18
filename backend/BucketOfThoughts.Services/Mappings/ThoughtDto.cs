using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class ThoughtDto : BaseDto
{
    public long LoginProfileId { get; set; }
    public string Description { get; set; } = null!;
    public string TextType { get; set; } = TextTypes.PlainText;
    public bool ShowOnDashboard { get; set; } = true;
    public DateTime? ThoughtDate { get; set; }
    public virtual ThoughtBucketDto Bucket { get; set; } = null!;
    //public virtual ICollection<ThoughtDetailDto> Details { get; set; } = [];
    //public virtual ICollection<ThoughtWebsiteLinkDto> WebsiteLinks { get; set; } = [];
}

public static class ThoughtMapper
{
    extension(ThoughtDto thoughtDto)
    {
        public Thought MapInsert()
        {
            // Validate and default TextType to PlainText if invalid
            var textType = thoughtDto.TextType == TextTypes.Json 
                ? TextTypes.Json 
                : TextTypes.PlainText;

            return new Thought
            {
                Id = thoughtDto.Id,
                Description = thoughtDto.Description,
                TextType = textType,
                ShowOnDashboard = thoughtDto.ShowOnDashboard,
                LoginProfileId = thoughtDto.LoginProfileId,
                ThoughtDate = thoughtDto.ThoughtDate ?? DateTime.UtcNow,
                ThoughtBucketId = thoughtDto.Bucket.Id
            };
        }

        public Thought MapUpdate(Thought dbRow)
        {
            if (dbRow.Id != thoughtDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtDto)} Id mismatch passed to Dto mapper");
            
            // Validate and default TextType to PlainText if invalid
            var textType = thoughtDto.TextType == TextTypes.Json 
                ? TextTypes.Json 
                : TextTypes.PlainText;

            dbRow.Id = thoughtDto.Id;
            dbRow.Description = thoughtDto.Description;
            dbRow.TextType = textType;
            dbRow.ThoughtDate = thoughtDto.ThoughtDate ?? dbRow.ThoughtDate;
            dbRow.ShowOnDashboard  = thoughtDto.ShowOnDashboard;
            dbRow.ThoughtBucketId = thoughtDto.Bucket.Id;
            //TODO figure out update for details and website links - probably do separtely?
            return dbRow;
        }
    }
}
