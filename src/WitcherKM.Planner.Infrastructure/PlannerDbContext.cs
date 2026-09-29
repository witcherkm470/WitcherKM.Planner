using Microsoft.EntityFrameworkCore;
using WitcherKM.Planner.Domain.Entities;

namespace WitcherKM.Planner.Infrastructure;

public class PlannerDbContext(DbContextOptions<PlannerDbContext> options) : DbContext(options)
{
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Feature> Features => Set<Feature>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PlannerDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }
}