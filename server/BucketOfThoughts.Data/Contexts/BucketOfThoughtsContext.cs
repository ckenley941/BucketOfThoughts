using System;
using BucketOfThoughts.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BucketOfThoughts.Data.Contexts
{
    public partial class BucketOfThoughtsContext : DbContext
    {
        public BucketOfThoughtsContext()
        {
        }

        public BucketOfThoughtsContext(DbContextOptions<BucketOfThoughtsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Band> Band { get; set; }
        public virtual DbSet<Celebrity> Celebrity { get; set; }
        public virtual DbSet<DataType> DataType { get; set; }
        public virtual DbSet<FileStorage> FileStorage { get; set; }
        public virtual DbSet<FunFact> FunFact { get; set; }
        public virtual DbSet<Mountain> Mountain { get; set; }
        public virtual DbSet<Movie> Movie { get; set; }
        public virtual DbSet<MovieCastMember> MovieCastMember { get; set; }
        public virtual DbSet<MovieGenre> MovieGenre { get; set; }
        public virtual DbSet<MovieRole> MovieRole { get; set; }
        public virtual DbSet<MovieToGenre> MovieToGenre { get; set; }
        public virtual DbSet<MusicVenue> MusicVenue { get; set; }
        public virtual DbSet<Show> Show { get; set; }
        public virtual DbSet<State> State { get; set; }
        public virtual DbSet<StateFunFact> StateFunFact { get; set; }
        public virtual DbSet<StateMountain> StateMountain { get; set; }
        public virtual DbSet<Thought> Thought { get; set; }
        public virtual DbSet<ThoughtAdditionalInfo> ThoughtAdditionalInfo { get; set; }
        public virtual DbSet<ThoughtCategory> ThoughtCategory { get; set; }
        public virtual DbSet<ThoughtCategoryAdditionalInfo> ThoughtCategoryAdditionalInfo { get; set; }
        public virtual DbSet<ThoughtDetail> ThoughtDetail { get; set; }
        public virtual DbSet<ThoughtFile> ThoughtFile { get; set; }
        public virtual DbSet<ThoughtModule> ThoughtModule { get; set; }
        public virtual DbSet<ThoughtTimeline> ThoughtTimeline { get; set; }
        public virtual DbSet<ThoughtWebsiteLink> ThoughtWebsiteLink { get; set; }
        public virtual DbSet<Timeline> Timeline { get; set; }
        public virtual DbSet<WebsiteLink> WebsiteLink { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=.\\SQLExpress;Database=BucketOfThoughts;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<Band>(entity =>
            {
                entity.Property(e => e.BandGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Origin).HasMaxLength(256);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<Celebrity>(entity =>
            {
                entity.Property(e => e.Birthday).HasColumnType("date");

                entity.Property(e => e.CelebrityGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Hometown).HasMaxLength(256);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<DataType>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();
            });

            modelBuilder.Entity<FileStorage>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.FileName).IsRequired();

                entity.Property(e => e.FilePath).IsRequired();

                entity.Property(e => e.FileStorageGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<FunFact>(entity =>
            {
                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.FunFactGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.RecordDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<Mountain>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasMaxLength(520);

                entity.Property(e => e.MountainGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.MountainPeak)
                    .IsRequired()
                    .HasMaxLength(520);

                entity.Property(e => e.MountainRange)
                    .IsRequired()
                    .HasMaxLength(520);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<Movie>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.LastSeenDate).HasColumnType("date");

                entity.Property(e => e.MovieGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<MovieCastMember>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.Celebrity)
                    .WithMany(p => p.MovieCastMember)
                    .HasForeignKey(d => d.CelebrityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MovieCastMember_Celebrity");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.MovieCastMember)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MovieCastMember_Movie");

                entity.HasOne(d => d.MovieRole)
                    .WithMany(p => p.MovieCastMember)
                    .HasForeignKey(d => d.MovieRoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MovieCastMember_MovieRole");
            });

            modelBuilder.Entity<MovieGenre>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.MovieGenreGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<MovieRole>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.MovieRoleGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");
            });

            modelBuilder.Entity<MovieToGenre>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.MovieGenre)
                    .WithMany(p => p.MovieToGenre)
                    .HasForeignKey(d => d.MovieGenreId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MovieToGenre_MovieGenre");

                entity.HasOne(d => d.Movie)
                    .WithMany(p => p.MovieToGenre)
                    .HasForeignKey(d => d.MovieId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MovieToGenre_Movie");
            });

            modelBuilder.Entity<MusicVenue>(entity =>
            {
                entity.Property(e => e.City).HasMaxLength(256);

                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.MusicVenueGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.State).HasMaxLength(120);
            });

            modelBuilder.Entity<Show>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DayOfWeek).HasMaxLength(20);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ShowDate).HasColumnType("date");

                entity.Property(e => e.ShowGuid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Band)
                    .WithMany(p => p.Show)
                    .HasForeignKey(d => d.BandId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Show_Band");

                entity.HasOne(d => d.MusicVenue)
                    .WithMany(p => p.Show)
                    .HasForeignKey(d => d.MusicVenueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Show_MusicVenue");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.Property(e => e.Abbreviation).HasMaxLength(10);

                entity.Property(e => e.Bird).HasMaxLength(120);

                entity.Property(e => e.Capital).HasMaxLength(260);

                entity.Property(e => e.CreatedDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DateOfStatehood).HasColumnType("date");

                entity.Property(e => e.Flower).HasMaxLength(120);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(120);

                entity.Property(e => e.Nickname).HasMaxLength(120);

                entity.Property(e => e.RecordDateTime)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.StateGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Tree).HasMaxLength(120);
            });

            modelBuilder.Entity<StateFunFact>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.FunFact)
                    .WithMany(p => p.StateFunFact)
                    .HasForeignKey(d => d.FunFactId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StateFunFact_FunFact");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.StateFunFact)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StateFunFact_State");
            });

            modelBuilder.Entity<StateMountain>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.Mountain)
                    .WithMany(p => p.StateMountain)
                    .HasForeignKey(d => d.MountainId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StateMountain_Mountain");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.StateMountain)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StateMountain_State");
            });

            modelBuilder.Entity<Thought>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ThoughtGuid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.ThoughtCategory)
                    .WithMany(p => p.Thought)
                    .HasForeignKey(d => d.ThoughtCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Thought_ThoughtCategory");
            });

            modelBuilder.Entity<ThoughtAdditionalInfo>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.ThoughtCategoryAdditionalInfo)
                    .WithMany(p => p.ThoughtAdditionalInfo)
                    .HasForeignKey(d => d.ThoughtCategoryAdditionalInfoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtAdditionalInfo_ThoughtCategoryAdditionalInfo");

                entity.HasOne(d => d.ThoughtDetail)
                    .WithMany(p => p.ThoughtAdditionalInfo)
                    .HasForeignKey(d => d.ThoughtDetailId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtAdditionalInfo_ThoughtDetailId");
            });

            modelBuilder.Entity<ThoughtCategory>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ThoughtCategoryGuid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.ThoughtModule)
                    .WithMany(p => p.ThoughtCategory)
                    .HasForeignKey(d => d.ThoughtModuleId)
                    .HasConstraintName("FK_ThoughtCategory_ThoughtModule");
            });

            modelBuilder.Entity<ThoughtCategoryAdditionalInfo>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ThoughtCategoryAdditionalInfoGuid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.DataType)
                    .WithMany(p => p.ThoughtCategoryAdditionalInfo)
                    .HasForeignKey(d => d.DataTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtCategoryAdditionalInfo_DataType");

                entity.HasOne(d => d.ThoughtCategory)
                    .WithMany(p => p.ThoughtCategoryAdditionalInfo)
                    .HasForeignKey(d => d.ThoughtCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtCategoryAdditionalInfo_ThoughtCategory");
            });

            modelBuilder.Entity<ThoughtDetail>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ThoughtDetailGuid).HasDefaultValueSql("(newid())");

                entity.HasOne(d => d.Thought)
                    .WithMany(p => p.ThoughtDetail)
                    .HasForeignKey(d => d.ThoughtId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtDetail_ThoughtId");
            });

            modelBuilder.Entity<ThoughtFile>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.FileStorage)
                    .WithMany(p => p.ThoughtFile)
                    .HasForeignKey(d => d.FileStorageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtFile_FileStorage");

                entity.HasOne(d => d.ThoughtDetail)
                    .WithMany(p => p.ThoughtFile)
                    .HasForeignKey(d => d.ThoughtDetailId)
                    .HasConstraintName("FK_ThoughtFile_ThoughtDetail");

                entity.HasOne(d => d.Thought)
                    .WithMany(p => p.ThoughtFile)
                    .HasForeignKey(d => d.ThoughtId)
                    .HasConstraintName("FK_ThoughtFile_Thought");
            });

            modelBuilder.Entity<ThoughtModule>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.ModuleKey)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.ThoughtModuleGuid).HasDefaultValueSql("(newid())");
            });

            modelBuilder.Entity<ThoughtTimeline>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.Thought)
                    .WithMany(p => p.ThoughtTimeline)
                    .HasForeignKey(d => d.ThoughtId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtTimeline_Thought");

                entity.HasOne(d => d.Timeline)
                    .WithMany(p => p.ThoughtTimeline)
                    .HasForeignKey(d => d.TimelineId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtTimeline_Timeline");
            });

            modelBuilder.Entity<ThoughtWebsiteLink>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.HasOne(d => d.Thought)
                    .WithMany(p => p.ThoughtWebsiteLink)
                    .HasForeignKey(d => d.ThoughtId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtWebsiteLink_Thought");

                entity.HasOne(d => d.WebsiteLink)
                    .WithMany(p => p.ThoughtWebsiteLink)
                    .HasForeignKey(d => d.WebsiteLinkId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ThoughtWebsiteLink_WebsiteLink");
            });

            modelBuilder.Entity<Timeline>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.DateEnd).HasColumnType("datetime");

                entity.Property(e => e.DateStart).HasColumnType("datetime");

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.TimelineGuid).HasDefaultValueSql("(newid())");
            });

            modelBuilder.Entity<WebsiteLink>(entity =>
            {
                entity.Property(e => e.CreatedDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.RecordDateTime).HasDefaultValueSql("(getutcdate())");

                entity.Property(e => e.WebsiteLinkGuid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.WebsiteUrl).IsRequired();
            });
        }
    }
}
