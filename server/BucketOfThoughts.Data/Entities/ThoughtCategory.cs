using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtCategory
    {
        public ThoughtCategory()
        {
            Thought = new HashSet<Thought>();
            ThoughtCategoryAdditionalInfo = new HashSet<ThoughtCategoryAdditionalInfo>();
        }

        public int ThoughtCategoryId { get; set; }
        public Guid ThoughtCategoryGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public int? SortOrder { get; set; }
        public int? ThoughtModuleId { get; set; }

        public virtual ThoughtModule ThoughtModule { get; set; }
        public virtual ICollection<Thought> Thought { get; set; }
        public virtual ICollection<ThoughtCategoryAdditionalInfo> ThoughtCategoryAdditionalInfo { get; set; }
    }
}
