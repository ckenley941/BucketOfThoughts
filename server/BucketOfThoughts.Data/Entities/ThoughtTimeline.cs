using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtTimeline
    {
        public int ThoughtTimelineId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int ThoughtId { get; set; }
        public int TimelineId { get; set; }

        public virtual Thought Thought { get; set; }
        public virtual Timeline Timeline { get; set; }
    }
}
