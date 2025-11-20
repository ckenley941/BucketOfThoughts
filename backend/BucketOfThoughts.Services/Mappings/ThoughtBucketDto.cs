using BucketOfThoughts.Data.Entities;

namespace BucketOfThoughts.Services.Mappings;

public partial class ThoughtBucketDto : BaseDto
{
    public long ThoughtModuleId { get; set; }
    public string Description { get; set; } = null!;
    public long? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool ShowOnDashboard { get; set; } = true;
}

public static class ThoughtBucketMapper
{
    extension(ThoughtBucketDto thoughtBucketDto)
    {
        public ThoughtBucket MapInsert()
        {
            return new ThoughtBucket
            {
                Id = thoughtBucketDto.Id,
                ThoughtModuleId = thoughtBucketDto.ThoughtModuleId,
                Description = thoughtBucketDto.Description,
                ParentId = thoughtBucketDto.ParentId,
                SortOrder = thoughtBucketDto.SortOrder,
                ShowOnDashboard = thoughtBucketDto.ShowOnDashboard
            };
        }

        public ThoughtBucket MapUpdate(ThoughtBucket dbRow)
        {
            if (dbRow.Id != thoughtBucketDto.Id) throw new Exception($"MapUpdate: {nameof(ThoughtBucketDto)} Id mismatch passed to Dto mapper");
            dbRow.Id = thoughtBucketDto.Id;
            dbRow.ThoughtModuleId = thoughtBucketDto.ThoughtModuleId;
            dbRow.Description = thoughtBucketDto.Description;
            dbRow.ParentId = thoughtBucketDto.ParentId;
            dbRow.SortOrder = thoughtBucketDto.SortOrder;
            dbRow.ShowOnDashboard = thoughtBucketDto.ShowOnDashboard;
            return dbRow;
        }
    }
}

