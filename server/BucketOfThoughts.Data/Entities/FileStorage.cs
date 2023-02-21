using System;
using System.Collections.Generic;

namespace BucketOfThoughts.Data.Entities
{
    public partial class FileStorage
    {
        public FileStorage()
        {
            ThoughtFile = new HashSet<ThoughtFile>();
        }

        public int FileStorageId { get; set; }
        public Guid FileStorageGuid { get; set; }
        public DateTime RecordDateTime { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string Description { get; set; }

        public virtual ICollection<ThoughtFile> ThoughtFile { get; set; }
    }
}
