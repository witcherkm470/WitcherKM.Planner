using Planner.Application.Common.Models.Projects;
using Planner.Domain.Entities;

namespace Planner.Application.Common.Models;

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
}