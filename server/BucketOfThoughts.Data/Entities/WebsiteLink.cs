using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class WebsiteLink
    {
        public WebsiteLink()
        {
            ThoughtWebsiteLink = new HashSet<ThoughtWebsiteLink>();
        }

        public int WebsiteLinkId { get; set; }
        public Guid WebsiteLinkGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string WebsiteUrl { get; set; }
        public string WebsiteDesc { get; set; }
        public int? SortOrder { get; set; }

        public virtual ICollection<ThoughtWebsiteLink> ThoughtWebsiteLink { get; set; }
    }
}
