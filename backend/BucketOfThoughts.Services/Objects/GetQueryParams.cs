using System.Linq.Expressions;

namespace BucketOfThoughts.Services.Objects;

public class GetQueryParams<TEntity> where TEntity : class
{
    public Expression<Func<TEntity, bool>>? Filter { get; set; }
    public string? IncludeProperties { get; set; }
    public Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? OrderBy { get; set; }
}
