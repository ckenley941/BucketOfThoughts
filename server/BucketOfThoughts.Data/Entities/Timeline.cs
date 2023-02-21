using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Timeline
    {
        public Timeline()
        {
            ThoughtTimeline = new HashSet<ThoughtTimeline>();
        }

        public int TimelineId { get; set; }
        public Guid TimelineGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }

        public virtual ICollection<ThoughtTimeline> ThoughtTimeline { get; set; }
    }
}
