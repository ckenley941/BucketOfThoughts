using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class StateFunFact
    {
        public int StateFunFactId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int StateId { get; set; }
        public int FunFactId { get; set; }

        public virtual FunFact FunFact { get; set; }
        public virtual State State { get; set; }
    }
}
