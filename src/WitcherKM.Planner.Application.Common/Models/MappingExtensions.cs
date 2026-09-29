using WitcherKM.Planner.Application.Common.Models.Feature;
using WitcherKM.Planner.Application.Common.Models.Ideas;
using WitcherKM.Planner.Application.Common.Models.Projects;
using WitcherKM.Planner.Domain.Entities;

namespace WitcherKM.Planner.Application.Common.Models;

public static class MappingExtensions
{
    public static ProjectModel ToProjectModel(this Project project)
    {
        return new ProjectModel
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            ProjectStatus = project.ProjectStatus,
        };
    }
    
    public static ProjectExtendedModel ToProjectExtendedModel(this Project project, int openedFeaturesCount)
    {
        return new ProjectExtendedModel
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            ProjectStatus = project.ProjectStatus,
            Documentation =  project.Documentation,
            OpenedFeatureCount = openedFeaturesCount
        };
    }
    
    public static FeatureModel ToFeatureModel(this Domain.Entities.Feature feature, string projectName)
    {
        return new FeatureModel
        {
            Id = feature.Id,
            Name = feature.Name,
            Description = feature.Description,
            FeatureStatus = feature.FeatureStatus,
            ProjectName = projectName
        };
    }

    public static IdeaModel ToIdeaModel(this Idea idea)
    {
        return new IdeaModel
        {
            Id = idea.Id,
            Essence = idea.Essence,
            IdeaStatus = idea.IdeaStatus
        };
    }
}
