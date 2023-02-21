using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtWebsiteLink
    {
        public int ThoughtWebsiteLinkId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int ThoughtId { get; set; }
        public int WebsiteLinkId { get; set; }

        public virtual Thought Thought { get; set; }
        public virtual WebsiteLink WebsiteLink { get; set; }
    }
}
