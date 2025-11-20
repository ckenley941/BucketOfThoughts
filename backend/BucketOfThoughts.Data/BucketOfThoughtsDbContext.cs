using BucketOfThoughts.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BucketOfThoughts.Data;

public class BucketOfThoughtsDbContext : BaseDbContext<BucketOfThoughtsDbContext>
{
    public virtual DbSet<LoginProfile> LoginProfiles { get; set; }
    public virtual DbSet<RelatedThought> RelatedThoughts { get; set; }
    public virtual DbSet<Thought> Thoughts { get; set; }
    public virtual DbSet<ThoughtBucket> ThoughtBuckets { get; set; }
    public virtual DbSet<ThoughtDetail> ThoughtDetails { get; set; }
    public virtual DbSet<ThoughtModule> ThoughtModules { get; set; }
    //public virtual DbSet<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; }
    public virtual DbSet<WebsiteLink> WebsiteLinks { get; set; }

    public BucketOfThoughtsDbContext(DbContextOptions<BucketOfThoughtsDbContext> options)
      : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //{
        //    modelBuilder.Entity<RelatedThought>(entity =>
        //    {
        //        //entity.HasKey(e => e.Id);

        //        entity.ToTable("RelatedThought");

        //        //entity.Property(e => e.CreatedDateTime)
        //        //    .HasDefaultValueSql("(getutcdate())");

        //        //entity.HasOne(d => d.ThoughtId1Navigation).WithMany(p => p.RelatedThoughtThoughtId1Navigations)
        //        //    .HasForeignKey(d => d.ThoughtId1)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_RelatedThought_Thought1");

        //        //entity.HasOne(d => d.ThoughtId2Navigation).WithMany(p => p.RelatedThoughtThoughtId2Navigations)
        //        //    .HasForeignKey(d => d.ThoughtId2)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_RelatedThought_Thought2");
        //    });

        //    modelBuilder.Entity<Thought>(entity =>
        //    {
        //        //entity.HasKey(e => e.Id);

        //        entity.ToTable("Thought");

        //        //entity.Property(e => e.CreatedDateTime)
        //        //    .HasDefaultValueSql("(getutcdate())");

        //        //entity.Property(e => e.ThoughtGuid)
        //        //    .HasDefaultValueSql("(newid())");

        //        //entity.Property(e => e.TextType)
        //        //   .HasDefaultValueSql("'PlainText'")
        //        //   .HasMaxLength(25);

        //        //entity.HasOne(d => d.ThoughtBucket).WithMany(p => p.Thoughts)
        //        //    .HasForeignKey(d => d.ThoughtBucketId)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_Thought_ThoughtBucket");
        //    });

        //    modelBuilder.Entity<ThoughtBucket>(entity =>
        //    {
        //        //entity.HasKey(e => e.Id);

        //        entity.ToTable("ThoughtBucket");

        //        //entity.Property(e => e.CreatedDateTime)
        //        //    .HasDefaultValueSql("(getutcdate())");

        //        //entity.Property(e => e.ShowOnDashboard)
        //        //   .HasDefaultValue(true);


        //        //entity.HasOne(d => d.ThoughtModule).WithMany(p => p.ThoughtBuckets)
        //        //    .HasForeignKey(d => d.ThoughtModuleId)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_ThoughtBucket_ThoughtModule");
        //    });

        //    modelBuilder.Entity<ThoughtDetail>(entity =>
        //    {
        //        //entity.HasKey(e => e.Id);

        //        entity.ToTable("ThoughtDetail");

        //        //entity.Property(e => e.CreatedDateTime)
        //        //    .HasDefaultValueSql("(getutcdate())");

        //        //entity.HasOne(d => d.Thought).WithMany(p => p.ThoughtDetails)
        //        //    .HasForeignKey(d => d.ThoughtId)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_ThoughtDetail_Thought");
        //    });

        //    modelBuilder.Entity<ThoughtModule>(entity =>
        //    {
        //       // entity.HasKey(e => e.Id);

        //        entity.ToTable("ThoughtModule");

        //        //entity.Property(e => e.CreatedDateTime)
        //        //    .HasDefaultValueSql("(getutcdate())");
        //    });

        modelBuilder.Entity<ThoughtWebsiteLink>(entity =>
        {
            entity.HasKey(e => new { e.ThoughtId, e.WebsiteLinkId });


            //entity.HasOne(d => d.Thought).WithMany(p => p.ThoughtWebsiteLinks)
            //    .HasForeignKey(d => d.ThoughtId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_ThoughtWebsiteLink_Thought");

            //entity.HasOne(d => d.WebsiteLink).WithMany(p => p.ThoughtWebsiteLinks)
            //    .HasForeignKey(d => d.WebsiteLinkId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_ThoughtWebsiteLink_WebsiteLink");
        });

        //    modelBuilder.Entity<WebsiteLink>(entity =>
        //    {
        //        entity.ToTable("WebsiteLink");

        //        //entity.HasOne(d => d.Thought).WithMany(p => p.ThoughtWebsiteLinks)
        //        //    .HasForeignKey(d => d.ThoughtId)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_ThoughtWebsiteLink_Thought");

        //        //entity.HasOne(d => d.WebsiteLink).WithMany(p => p.ThoughtWebsiteLinks)
        //        //    .HasForeignKey(d => d.WebsiteLinkId)
        //        //    .OnDelete(DeleteBehavior.ClientSetNull)
        //        //    .HasConstraintName("FK_ThoughtWebsiteLink_WebsiteLink");
        //    });

    }
}
