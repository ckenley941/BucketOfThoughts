using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Mountain
    {
        public Mountain()
        {
            StateMountain = new HashSet<StateMountain>();
        }

        public int MountainId { get; set; }
        public Guid MountainGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string MountainPeak { get; set; }
        public string MountainRange { get; set; }
        public string Location { get; set; }
        public int Height { get; set; }

        public virtual ICollection<StateMountain> StateMountain { get; set; }
    }
}
