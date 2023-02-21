using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class MovieToGenre
    {
        public int MovieToGenreId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int MovieId { get; set; }
        public int MovieGenreId { get; set; }

        public virtual Movie Movie { get; set; }
        public virtual MovieGenre MovieGenre { get; set; }
    }
}
