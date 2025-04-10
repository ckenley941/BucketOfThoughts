using BucketOfThoughts.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BucketOfThoughts.Data
{
    public abstract class BaseDbContext<T> : DbContext where T : DbContext
    {
        public BaseDbContext()
        {
        }

        public BaseDbContext(DbContextOptions<T> options)
            : base(options)
        {
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            OnBeforeSaveChanges();
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }

        public override int SaveChanges()
        {
            OnBeforeSaveChanges();
            var result = base.SaveChanges();
            return result;
        }

        private void OnBeforeSaveChanges()
        {
            base.ChangeTracker.DetectChanges();

            var entries = base.ChangeTracker.Entries();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                {
                    continue;
                }
                SetAuditFields(entry);
            }
        }

        private void SetAuditFields(EntityEntry entry)
        {
            if (entry.Entity is not IDbTable && entry.Entity is not IModifiableDbTable)
            {
                return;
            }

            if (entry.Entity is IModifiableDbTable modifiableDbTable)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        modifiableDbTable.CreatedDateTime = DateTimeOffset.UtcNow;
                        modifiableDbTable.ModifiedDateTime = DateTimeOffset.UtcNow;
                        break;
                    case EntityState.Modified:
                    case EntityState.Deleted:
                        modifiableDbTable.ModifiedDateTime = DateTimeOffset.UtcNow;
                        break;
                }
            }
            else if (entry.Entity is IDbTable dbTable && entry.State == EntityState.Added)
            {
                dbTable.CreatedDateTime = DateTime.UtcNow;
            }
        }
    }
}
