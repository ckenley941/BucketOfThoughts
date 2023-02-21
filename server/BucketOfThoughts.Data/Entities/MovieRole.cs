using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class MovieRole
    {
        public MovieRole()
        {
            MovieCastMember = new HashSet<MovieCastMember>();
        }

        public int MovieRoleId { get; set; }
        public Guid MovieRoleGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MovieCastMember> MovieCastMember { get; set; }
    }
}
