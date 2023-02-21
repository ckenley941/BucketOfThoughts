using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class MovieGenre
    {
        public MovieGenre()
        {
            MovieToGenre = new HashSet<MovieToGenre>();
        }

        public int MovieGenreId { get; set; }
        public Guid MovieGenreGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }

        public virtual ICollection<MovieToGenre> MovieToGenre { get; set; }
    }
}
