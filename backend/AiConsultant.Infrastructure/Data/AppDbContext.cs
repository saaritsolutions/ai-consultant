using AiConsultant.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AiConsultant.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<Consultation> Consultations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(b => b.Id);
            entity.HasIndex(b => b.Slug).IsUnique();
            entity.Property(b => b.Title).IsRequired().HasMaxLength(300);
            entity.Property(b => b.Slug).IsRequired().HasMaxLength(350);
            entity.Property(b => b.Category).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<Video>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.Title).IsRequired().HasMaxLength(300);
            entity.Property(v => v.YouTubeUrl).IsRequired();
        });

        modelBuilder.Entity<Consultation>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(200);
            entity.Property(c => c.Email).IsRequired().HasMaxLength(256);
            entity.Property(c => c.Type).HasConversion<string>();
            entity.Property(c => c.Status).HasConversion<string>();
        });
    }
}
