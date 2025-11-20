using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

public interface IDbTable
{
    public int Id { get; set; }
    public DateTimeOffset CreatedDateTime { get; set; }
}

public abstract class BaseDbTable : IDbTable
{
    [Column(Order = 1)]
    [Key]
    public int Id { get; set; }
    [Column(Order = 2)]
    public DateTimeOffset CreatedDateTime { get; set; } = DateTimeOffset.Now;
}
