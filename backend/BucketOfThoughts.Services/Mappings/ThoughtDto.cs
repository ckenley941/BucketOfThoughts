using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class ThoughtDto : BaseDto
{
    public long LoginProfileId { get; set; }
    public string Description { get; set; } = null!;
    public string TextType { get; set; } = "PlainText";
    public bool ShowOnDashboard { get; set; } = true;
    public DateTime? ThoughtDate { get; set; }
    public virtual ThoughtBucketDto Bucket { get; set; } = null!;
    public virtual ICollection<ThoughtDetailDto> Details { get; set; } = [];
    public virtual ICollection<ThoughtWebsiteLinkDto> WebsiteLinks { get; set; } = [];
}

public static class ThoughtMapper
{
    extension(ThoughtDto thoughtDto)
    {
        public Thought MapInsert()
        {
            return new Thought
            {
                Id = thoughtDto.Id,
                Description = thoughtDto.Description,
                TextType = thoughtDto.TextType,
                ShowOnDashboard = thoughtDto.ShowOnDashboard,
                LoginProfileId = thoughtDto.LoginProfileId,
                ThoughtDate = thoughtDto.ThoughtDate ?? DateTime.UtcNow,
                ThoughtBucketId = thoughtDto.Bucket.Id
            };
        }

        public Thought MapUpdate(Thought dbRow)
        {
            if (dbRow.Id != thoughtDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtDto)} Id mismatch passed to Dto mapper");
            dbRow.Id = thoughtDto.Id;
            dbRow.Description = thoughtDto.Description;
            dbRow.TextType = thoughtDto.TextType;
            dbRow.ThoughtDate = thoughtDto.ThoughtDate ?? dbRow.ThoughtDate;
            dbRow.ShowOnDashboard  = thoughtDto.ShowOnDashboard;
            dbRow.ThoughtBucketId = thoughtDto.Bucket.Id;
            //TODO figure out update for details and website links - probably do separtely?
            return dbRow;
        }
    }
}
