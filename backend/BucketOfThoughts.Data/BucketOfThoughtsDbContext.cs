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
    public virtual DbSet<ThoughtWebsiteLink> ThoughtWebsiteLinks { get; set; }
    public virtual DbSet<WebsiteLink> WebsiteLinks { get; set; }

    public BucketOfThoughtsDbContext(DbContextOptions<BucketOfThoughtsDbContext> options)
      : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Add unique index on Auth0Id to prevent duplicate logins
        modelBuilder.Entity<LoginProfile>(entity =>
        {
            entity.HasIndex(e => e.Auth0Id)
                .IsUnique();
        });

        modelBuilder.Entity<RelatedThought>(builder =>
        {
            builder
            .HasOne(rt => rt.ParentThought)
            .WithMany(t => t.RelatedThoughts)
            .HasForeignKey(rt => rt.ParentThoughtId)
            .OnDelete(DeleteBehavior.Restrict);

            builder
             .HasOne(rt => rt.RelatedThoughtEntity)
             .WithMany(t => t.ParentLinks)
             .HasForeignKey(rt => rt.RelatedThoughtId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Thought relationships to avoid cascade cycle
        modelBuilder.Entity<Thought>(entity =>
        {
            entity
                .HasOne(t => t.Bucket)
                .WithMany(b => b.Thoughts)
                .HasForeignKey(t => t.ThoughtBucketId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(t => t.LoginProfile)
                .WithMany(lp => lp.Thoughts)
                .HasForeignKey(t => t.LoginProfileId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ThoughtBucket relationships
        modelBuilder.Entity<ThoughtBucket>(entity =>
        {
            entity
                .HasOne(tb => tb.LoginProfile)
                .WithMany(lp => lp.ThoughtBuckets)
                .HasForeignKey(tb => tb.LoginProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(tb => tb.ThoughtModule)
                .WithMany(tm => tm.ThoughtBuckets)
                .HasForeignKey(tb => tb.ThoughtModuleId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ThoughtDetail relationship
        modelBuilder.Entity<ThoughtDetail>(entity =>
        {
            entity
                .HasOne(td => td.Thought)
                .WithMany(t => t.Details)
                .HasForeignKey(td => td.ThoughtId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ThoughtWebsiteLink relationships
        modelBuilder.Entity<ThoughtWebsiteLink>(entity =>
        {
            entity.HasKey(e => new { e.ThoughtId, e.WebsiteLinkId });

            entity
                .HasOne(twl => twl.Thought)
                .WithMany(t => t.WebsiteLinks)
                .HasForeignKey(twl => twl.ThoughtId)
                .OnDelete(DeleteBehavior.Restrict);

            entity
                .HasOne(twl => twl.WebsiteLink)
                .WithMany(wl => wl.ThoughtWebsiteLinks)
                .HasForeignKey(twl => twl.WebsiteLinkId)
                .OnDelete(DeleteBehavior.Restrict);
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
