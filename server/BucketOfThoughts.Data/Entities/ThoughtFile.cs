using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class ThoughtFile
    {
        public int ThoughtFileId { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int FileStorageId { get; set; }
        public int? ThoughtId { get; set; }
        public int? ThoughtDetailId { get; set; }

        public virtual FileStorage FileStorage { get; set; }
        public virtual Thought Thought { get; set; }
        public virtual ThoughtDetail ThoughtDetail { get; set; }
    }
}
