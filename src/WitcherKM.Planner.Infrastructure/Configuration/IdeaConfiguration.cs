using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WitcherKM.Planner.Domain.Entities;

namespace WitcherKM.Planner.Infrastructure.Configuration;

public class IdeaConfiguration : IEntityTypeConfiguration<Idea>
{
    public void Configure(EntityTypeBuilder<Idea> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Essence)
            .IsRequired();

        builder.Property(x => x.IdeaStatus)
            .IsRequired();
    }
}