using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtModule
    {
        public ThoughtModule()
        {
            ThoughtCategory = new HashSet<ThoughtCategory>();
        }

        public int ThoughtModuleId { get; set; }
        public Guid ThoughtModuleGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string ModuleKey { get; set; }
        public string Description { get; set; }
        public int? SortOrder { get; set; }

        public virtual ICollection<ThoughtCategory> ThoughtCategory { get; set; }
    }
}
