using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class MusicVenue
    {
        public MusicVenue()
        {
            Show = new HashSet<Show>();
        }

        public int MusicVenueId { get; set; }
        public Guid MusicVenueGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Description { get; set; }
        public bool IsFestival { get; set; }

        public virtual ICollection<Show> Show { get; set; }
    }
}
