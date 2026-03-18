using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class InsertThoughtDetailDto : ThoughtDetailDto
{
    public JsonDetail JsonDetails { get; set; } = new();
}

public partial class ThoughtDetailDto : BaseDto
{
    public string? Description { get; set; }
    public long ThoughtId { get; set; }
    public int SortOrder { get; set; }
    public string TextType { get; set; } = TextTypes.PlainText;
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
                Description = thoughtDetailDto.Description ?? throw new Exception($"MapInsert: Description missing for ThoughtId: {thoughtDetailDto.ThoughtId}"),
                ThoughtId = thoughtDetailDto.ThoughtId,
                SortOrder = thoughtDetailDto.SortOrder
            };
        }

        public ThoughtDetail MapUpdate(ThoughtDetail dbRow)
        {
            if (dbRow.Id != thoughtDetailDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtDetailDto)} Id mismatch passed to Dto mapper");
            dbRow.Id = thoughtDetailDto.Id;
            dbRow.Description = thoughtDetailDto.Description ?? throw new Exception($"MapUpdate: Description missing for ThoughtDetailId: {thoughtDetailDto.Id}");
            dbRow.ThoughtId = thoughtDetailDto.ThoughtId;
            dbRow.SortOrder = thoughtDetailDto.SortOrder;
            return dbRow;
        }
    }
}





