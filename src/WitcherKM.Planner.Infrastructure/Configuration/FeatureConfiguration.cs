using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WitcherKM.Planner.Domain.Entities;

namespace WitcherKM.Planner.Infrastructure.Configuration;

public class FeatureConfiguration: IEntityTypeConfiguration<Feature>
{
    public void Configure(EntityTypeBuilder<Feature> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired();

        builder.Property(x => x.Description);

        builder.Property(x => x.FeatureStatus)
            .IsRequired();
        
        builder
            .HasOne(feature => feature.Project)
            .WithMany(project => project.Features)
            .HasForeignKey(feature => feature.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}