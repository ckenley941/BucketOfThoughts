using AutoMapper;
using BucketOfThoughts.Api.DTOs;
using BucketOfThoughts.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BucketOfThoughts.Api.Profiles
{
    public class ThoughtProfile : Profile
    {
        public ThoughtProfile()
        {
            CreateMap<Thought, ThoughtCreateDto>().ReverseMap();
            CreateMap<Timeline, TimelineDto>().ReverseMap();
        }
    }
}
