using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class FunFact
    {
        public FunFact()
        {
            StateFunFact = new HashSet<StateFunFact>();
        }

        public int FunFactId { get; set; }
        public Guid FunFactGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string Description { get; set; }

        public virtual ICollection<StateFunFact> StateFunFact { get; set; }
    }
}
