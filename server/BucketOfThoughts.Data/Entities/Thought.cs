using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Thought
    {
        public Thought()
        {
            ThoughtDetail = new HashSet<ThoughtDetail>();
            ThoughtFile = new HashSet<ThoughtFile>();
            ThoughtTimeline = new HashSet<ThoughtTimeline>();
            ThoughtWebsiteLink = new HashSet<ThoughtWebsiteLink>();
        }

        public int ThoughtId { get; set; }
        public Guid ThoughtGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Description { get; set; }
        public int ThoughtCategoryId { get; set; }
        public bool IsQuote { get; set; }
        public string ThoughtSource { get; set; }

        public virtual ThoughtCategory ThoughtCategory { get; set; }
        public virtual ICollection<ThoughtDetail> ThoughtDetail { get; set; }
        public virtual ICollection<ThoughtFile> ThoughtFile { get; set; }
        public virtual ICollection<ThoughtTimeline> ThoughtTimeline { get; set; }
        public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLink { get; set; }
    }
}
