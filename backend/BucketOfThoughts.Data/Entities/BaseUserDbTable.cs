using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities;

public interface IUserDbTable : IModifiableDbTable
{
    public long LoginProfileId { get; set; }
    public LoginProfile LoginProfile { get; set; }
}

public abstract class BaseUserDbTable : BaseModifiableDbTable, IUserDbTable
{
    [Column(Order = 4)]
    public long LoginProfileId { get; set; }
    public LoginProfile LoginProfile { get; set; } = null!;
}
