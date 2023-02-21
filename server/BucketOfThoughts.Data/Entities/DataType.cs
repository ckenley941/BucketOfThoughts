using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class DataType
    {
        public DataType()
        {
            ThoughtCategoryAdditionalInfo = new HashSet<ThoughtCategoryAdditionalInfo>();
        }

        public int DataTypeId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Description { get; set; }

        public virtual ICollection<ThoughtCategoryAdditionalInfo> ThoughtCategoryAdditionalInfo { get; set; }
    }
}
