using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtAdditionalInfo
    {
        public int ThoughtAdditionalInfoId { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int ThoughtDetailId { get; set; }
        public int ThoughtCategoryAdditionalInfoId { get; set; }
        public string Value { get; set; }

        public virtual ThoughtCategoryAdditionalInfo ThoughtCategoryAdditionalInfo { get; set; }
        public virtual ThoughtDetail ThoughtDetail { get; set; }
    }
}
