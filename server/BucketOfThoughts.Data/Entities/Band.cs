using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Band
    {
        public Band()
        {
            Show = new HashSet<Show>();
        }

        public int BandId { get; set; }
        public Guid BandGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Origin { get; set; }
        public int? FormationYear { get; set; }

        public virtual ICollection<Show> Show { get; set; }
    }
}
