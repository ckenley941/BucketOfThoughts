using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class MovieCastMember
    {
        public int MovieCastMemberId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int MovieId { get; set; }
        public int CelebrityId { get; set; }
        public int MovieRoleId { get; set; }

        public virtual Celebrity Celebrity { get; set; }
        public virtual Movie Movie { get; set; }
        public virtual MovieRole MovieRole { get; set; }
    }
}
