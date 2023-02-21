using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtCategoryAdditionalInfo
    {
        public ThoughtCategoryAdditionalInfo()
        {
            ThoughtAdditionalInfo = new HashSet<ThoughtAdditionalInfo>();
        }

        public int ThoughtCategoryAdditionalInfoId { get; set; }
        public Guid ThoughtCategoryAdditionalInfoGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int ThoughtCategoryId { get; set; }
        public string Description { get; set; }
        public int DataTypeId { get; set; }
        public int ColOrder { get; set; }

        public virtual DataType DataType { get; set; }
        public virtual ThoughtCategory ThoughtCategory { get; set; }
        public virtual ICollection<ThoughtAdditionalInfo> ThoughtAdditionalInfo { get; set; }
    }
}
