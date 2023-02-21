using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class Movie
    {
        public Movie()
        {
            MovieCastMember = new HashSet<MovieCastMember>();
            MovieToGenre = new HashSet<MovieToGenre>();
        }

        public int MovieId { get; set; }
        public Guid MovieGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Name { get; set; }
        public int? Year { get; set; }
        public string Description { get; set; }
        public DateTime? LastSeenDate { get; set; }
        public bool IsFavorite { get; set; }
        public bool OnWatchlist { get; set; }

        public virtual ICollection<MovieCastMember> MovieCastMember { get; set; }
        public virtual ICollection<MovieToGenre> MovieToGenre { get; set; }
    }
}
