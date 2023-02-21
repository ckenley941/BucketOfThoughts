using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BucketOfThoughts.Api.DTOs
{
    public class TimelineDto
    {
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public bool Exists
        {
            get
            {
                if (DateStart.HasValue || DateEnd.HasValue)
                {
                    DateStart = (DateStart ?? DateEnd).Value.Date;
                    DateEnd = (DateEnd ?? DateStart).Value.Date;
                    return true;
                }
                return false;
            }
        }
    }
}
