using Microsoft.EntityFrameworkCore;
using Planner.Application.Common.Models.Feature;
using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;
using Planner.Domain.Enums;
using WitcherKM.Common.Orm.Repositories;

namespace Planner.Infrastructure.Repositories;

public class FeatureRepository : EntityRepository<Feature, PlannerDbContext>, IFeatureRepository
{
    public FeatureRepository(PlannerDbContext dbContext) : base(dbContext)
    {
    }


    public async Task<bool> AnyExistsByProjectIdAsync(long projectId, CancellationToken cancellationToken)
    {
        return await DbSet.AnyAsync(feature => feature.ProjectId == projectId, cancellationToken);
    }

    public async Task<int> GetOpenedFeaturesCountByProjectIdAsync(long projectId, CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(feature => feature.ProjectId == projectId && feature.FeatureStatus == FeatureStatus.Opened)
            .CountAsync(cancellationToken);
    }

    public async Task<IEnumerable<FeatureModel>> GetAllFeaturesWithProjectNameAsync(CancellationToken cancellationToken)
    {
        return await DbSet.AsNoTracking().Select(f => new FeatureModel
        {
            Id = f.Id,
            Name = f.Name,
            Description = f.Description,
            FeatureStatus = f.FeatureStatus,
            ProjectName = f.Project.Name
        }).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectFeaturesModel>> GetAllByProjectIdAsync(long projectId, CancellationToken cancellationToken)
    {
        return await DbSet.Where(feature => feature.ProjectId == projectId).Select(projectFeature => new ProjectFeaturesModel
        {
            Id =  projectFeature.Id,
            Name =  projectFeature.Name,
            Description = projectFeature.Description,
            FeatureStatus = projectFeature.FeatureStatus
        }).ToListAsync(cancellationToken);
    }
}