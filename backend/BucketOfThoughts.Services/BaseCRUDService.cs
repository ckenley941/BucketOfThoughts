using AutoMapper;
using BucketOfThoughts.Data;
using BucketOfThoughts.Data.Entities;
using BucketOfThoughts.Services.Extensions;
using BucketOfThoughts.Services.Models;
using BucketOfThoughts.Services.Objects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace BucketOfThoughts.Services
{
    public interface ICrudService<TEntity, TModel> where TEntity : BaseDbTable where TModel : BaseModel
    {
        Task<TModel> GetByIdAsync(int id, string? includeProperties = null);
        public Task<TModel> GetRandomAsync(GetQueryParams<TEntity>? queryParams = null);
        public Task<IEnumerable<TModel>> GetAsync(GetQueryParams<TEntity>? queryParams = null);
        public Task<IEnumerable<TModel>> GetFromCacheAsync(string cacheKey, GetQueryParams<TEntity>? queryParams = null);
        public Task<TModel> InsertAsync(TModel newItem, bool performSave = true, string cacheKey = "");
        public Task<TModel> UpdateAsync(TModel updateItem, bool performSave = true, string cacheKey = "");
        public Task DeleteAsync(int id, bool performSave = true);
        public Task DeleteAsync(TEntity deleteItem, bool performSave = true);
    }

    public abstract class BaseCRUDService<TEntity, TModel>(BucketOfThoughtsDbContext dbContext, IMapper mapper, IDistributedCache cache) : ICrudService<TEntity, TModel> where TEntity : BaseDbTable where TModel : BaseModel
    {
        protected readonly IMapper _mapper = mapper;
        protected readonly BucketOfThoughtsDbContext _dbContext = dbContext;
        protected DbSet<TEntity> _dbSet = dbContext.Set<TEntity>();
        protected readonly IDistributedCache _cache = cache;

        public async virtual Task<TModel> GetByIdAsync(int id, string? includeProperties = null)
        {
            if (!string.IsNullOrEmpty(includeProperties))
            {
                IQueryable<TEntity> query = _dbSet;
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
                var data = await query.SingleOrDefaultAsync(q => q.Id == id) ?? throw new NotFoundException();
                return _mapper.Map<TModel>(data);
            }
            else
            {
                var data = await _dbSet.FindAsync(id) ?? throw new NotFoundException();
                return _mapper.Map<TModel>(data);
            }

        }

        public virtual async Task<TModel> GetRandomAsync(GetQueryParams<TEntity>? queryParams = null)
        {
            var data = await GetAsync(queryParams);
            if (!data.Any())
            {
                throw new NotFoundException();
            }
            var rand = new Random();

            var randData = data.ToList()[rand.Next(data.Count())];
            return _mapper.Map<TModel>(randData);
        }


        public virtual async Task<IEnumerable<TModel>> GetAsync(GetQueryParams<TEntity>? queryParams = null)
        {
            queryParams ??= new GetQueryParams<TEntity> { };
            IQueryable<TEntity> query = _dbSet;

            if (queryParams.Filter != null)
            {
                query = query.Where(queryParams.Filter);
            }

            if (!string.IsNullOrEmpty(queryParams.IncludeProperties))
            {
                foreach (var includeProperty in queryParams.IncludeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (queryParams.OrderBy != null)
            {
                var data = await queryParams.OrderBy(query).ToListAsync();
                return _mapper.Map<IEnumerable<TModel>>(data);
            }
            else
            {
                var data = await query.ToListAsync();
                return _mapper.Map<IEnumerable<TModel>>(data);
            }
        }

        public virtual async Task<IEnumerable<TModel>> GetFromCacheAsync(string cacheKey, GetQueryParams<TEntity>? queryParams = null)
        {
            var data = await _cache.GetRecordAsync<IEnumerable<TModel>>(cacheKey);
            if (data == null)
            {
                data = await GetAsync(queryParams);
                await _cache.SetRecordAsync(cacheKey, data);
            }

            return data;
        }

        public virtual async Task<TModel> InsertAsync(TModel newItem, bool performSave = true, string cacheKey = "")
        {
            var itemToAdd = _mapper.Map<TEntity>(newItem);
            await _dbSet.AddAsync(itemToAdd);
            if (performSave)
            {
                await SaveAsync();
                newItem.Id = itemToAdd.Id;
                if (!string.IsNullOrEmpty(cacheKey))
                {
                    await _cache.RemoveAsync(cacheKey);
                }
            }
            return newItem;
        }
        
        public virtual async Task<TModel> UpdateAsync(TModel updateItem, bool performSave = true, string cacheKey = "")
        {
            var dbItem = await _dbSet.SingleOrDefaultAsync(q => q.Id == updateItem.Id) ?? throw new NotFoundException();
            _mapper.Map(updateItem, dbItem);

            _dbSet.Attach(dbItem);
            _dbContext.Entry(updateItem).State = EntityState.Modified;
            if (performSave)
            {
                await SaveAsync();
                if (!string.IsNullOrEmpty(cacheKey))
                {
                    await _cache.RemoveAsync(cacheKey);
                }
            }
            return updateItem;
        }

        public virtual async Task DeleteAsync(int id, bool performSave = true)
        {
            var dbItem = await _dbSet.SingleOrDefaultAsync(q => q.Id == id) ?? throw new NotFoundException();
            await DeleteAsync(dbItem);
            if (performSave)
            {
                await SaveAsync();
            }
        }

        public virtual async Task DeleteAsync(TEntity deleteItem, bool performSave = true)
        {
            if (_dbContext.Entry(deleteItem).State == EntityState.Detached)
            {
                _dbSet.Attach(deleteItem);
            }
            _dbSet.Remove(deleteItem);
            if (performSave)
            {
                await SaveAsync();
            }
        }

        public async virtual Task SaveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
