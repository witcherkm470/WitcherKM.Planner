using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WitcherKM.Planner.Domain.Entities;
namespace WitcherKM.Planner.Infrastructure.Configuration;
public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{ public void Configure(EntityTypeBuilder<TaskItem> builder) { builder.HasKey(x => x.Id); builder.Property(x => x.Name).IsRequired(); builder.Property(x => x.Description); builder.Property(x => x.TaskStatus).IsRequired(); builder.HasOne(x => x.Feature).WithMany(x => x.Tasks).HasForeignKey(x => x.FeatureId).OnDelete(DeleteBehavior.Restrict); } }
