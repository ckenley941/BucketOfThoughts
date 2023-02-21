using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Show
    {
        public int ShowId { get; set; }
        public Guid ShowGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int BandId { get; set; }
        public int MusicVenueId { get; set; }
        public DateTime ShowDate { get; set; }
        public string DayOfWeek { get; set; }
        public string Notes { get; set; }
        public string Story { get; set; }

        public virtual Band Band { get; set; }
        public virtual MusicVenue MusicVenue { get; set; }
    }
}
