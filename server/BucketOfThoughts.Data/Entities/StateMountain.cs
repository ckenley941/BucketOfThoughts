using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class StateMountain
    {
        public int StateMountainId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int StateId { get; set; }
        public int MountainId { get; set; }

        public virtual Mountain Mountain { get; set; }
        public virtual State State { get; set; }
    }
}
