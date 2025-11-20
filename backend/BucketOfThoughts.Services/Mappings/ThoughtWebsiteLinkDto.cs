using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class ThoughtWebsiteLinkDto
{
    public long ThoughtId { get; set; }
    public long WebsiteLinkId { get; set; }
    public string WebsiteUrl { get; set; } = null!;
    public string? Description { get; set; }
    public long SortOrder { get; set; }
}

public static class ThoughtWebsiteLinkMapper
{
    extension(ThoughtWebsiteLinkDto thoughtWebsiteLinkDto)
    {
        public ThoughtWebsiteLink MapInsert()
        {
            return new ThoughtWebsiteLink
            {
                ThoughtId = thoughtWebsiteLinkDto.ThoughtId,
                WebsiteLinkId = thoughtWebsiteLinkDto.WebsiteLinkId
            };
        }

        public ThoughtWebsiteLink MapUpdate(ThoughtWebsiteLink dbRow)
        {
            if (dbRow.ThoughtId != thoughtWebsiteLinkDto.ThoughtId || 
                dbRow.WebsiteLinkId != thoughtWebsiteLinkDto.WebsiteLinkId)
            {
                throw new Exception($"MapUpdate: {nameof(ThoughtWebsiteLinkDto)} Key mismatch passed to Dto mapper");
            }
            dbRow.ThoughtId = thoughtWebsiteLinkDto.ThoughtId;
            dbRow.WebsiteLinkId = thoughtWebsiteLinkDto.WebsiteLinkId;
            return dbRow;
        }
    }
}

