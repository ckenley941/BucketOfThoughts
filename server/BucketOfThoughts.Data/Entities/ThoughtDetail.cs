using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtDetail
    {
        public ThoughtDetail()
        {
            ThoughtAdditionalInfo = new HashSet<ThoughtAdditionalInfo>();
            ThoughtFile = new HashSet<ThoughtFile>();
        }

        public int ThoughtDetailId { get; set; }
        public Guid ThoughtDetailGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int ThoughtId { get; set; }
        public string Description { get; set; }
        public int? SortOrder { get; set; }

        public virtual Thought Thought { get; set; }
        public virtual ICollection<ThoughtAdditionalInfo> ThoughtAdditionalInfo { get; set; }
        public virtual ICollection<ThoughtFile> ThoughtFile { get; set; }
    }
}
