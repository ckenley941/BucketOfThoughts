using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class ThoughtDetailDto : BaseDto
{
    public string Description { get; set; } = null!;
    public long ThoughtId { get; set; }
    public int SortOrder { get; set; }
}

public static class ThoughtDetailMapper
{
    extension(ThoughtDetailDto thoughtDetailDto)
    {
        public ThoughtDetail MapInsert()
        {
            return new ThoughtDetail
            {
                Id = thoughtDetailDto.Id,
                Description = thoughtDetailDto.Description,
                ThoughtId = thoughtDetailDto.ThoughtId,
                SortOrder = thoughtDetailDto.SortOrder
            };
        }

        public ThoughtDetail MapUpdate(ThoughtDetail dbRow)
        {
            if (dbRow.Id != thoughtDetailDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtDetailDto)} Id mismatch passed to Dto mapper");
            dbRow.Id = thoughtDetailDto.Id;
            dbRow.Description = thoughtDetailDto.Description;
            dbRow.ThoughtId = thoughtDetailDto.ThoughtId;
            dbRow.SortOrder = thoughtDetailDto.SortOrder;
            return dbRow;
        }
    }
}





