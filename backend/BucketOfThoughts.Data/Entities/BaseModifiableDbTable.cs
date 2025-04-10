using System.ComponentModel.DataAnnotations.Schema;

namespace BucketOfThoughts.Data.Entities
{
    public interface IModifiableDbTable : IDbTable
    {
        public DateTimeOffset? ModifiedDateTime { get; set; }
    }
    public abstract class BaseModifiableDbTable : BaseDbTable, IModifiableDbTable
    {
        [Column(Order = 3)]
        public DateTimeOffset? ModifiedDateTime { get; set; } = DateTimeOffset.Now;
    }
}
