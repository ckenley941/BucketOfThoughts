using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class RelatedThoughtDto : BaseDto
{
    public long ParentThoughtId { get; set; }
    public long RelatedThoughtId { get; set; }
    public int SortOrder { get; set; }
    public ThoughtDto? RelatedThought { get; set; }
}

public static class RelatedThoughtMapper
{
    extension(RelatedThoughtDto relatedThoughtDto)
    {
        public RelatedThought MapInsert()
        {
            return new RelatedThought
            {
                Id = relatedThoughtDto.Id,
                ParentThoughtId = relatedThoughtDto.ParentThoughtId,
                RelatedThoughtId = relatedThoughtDto.RelatedThoughtId,
                SortOrder = relatedThoughtDto.SortOrder
            };
        }
    }
}
