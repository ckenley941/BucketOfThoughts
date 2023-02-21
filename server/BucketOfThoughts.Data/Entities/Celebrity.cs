using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Celebrity
    {
        public Celebrity()
        {
            MovieCastMember = new HashSet<MovieCastMember>();
        }

        public int CelebrityId { get; set; }
        public Guid CelebrityGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }
        public DateTime? Birthday { get; set; }
        public string Hometown { get; set; }

        public virtual ICollection<MovieCastMember> MovieCastMember { get; set; }
    }
}
