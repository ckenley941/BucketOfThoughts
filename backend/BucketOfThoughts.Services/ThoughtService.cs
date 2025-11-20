using AutoMapper;
using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Models;
using Microsoft.Extensions.Caching.Distributed;

namespace BucketOfThoughts.Services
{
    public interface IThoughtService : ICrudService<Thought, ThoughtModel>
    { 
    }

    public class ThoughtService(BucketOfThoughtsDbContext dbContext, IMapper mapper, IDistributedCache cache) : BaseCRUDService<Thought, ThoughtModel>(dbContext, mapper, cache), IThoughtService
    {
    }
}
