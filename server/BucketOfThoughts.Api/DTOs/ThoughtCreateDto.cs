using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BucketOfThoughts.Api.DTOs
{
    public class ThoughtCreateDto
    {
        public string Description { get; set; }
        public int ThoughtCategoryId { get; set; }
        public bool IsQuote { get; set; }
        public TimelineDto Timeline { get; set; }
    }
}
