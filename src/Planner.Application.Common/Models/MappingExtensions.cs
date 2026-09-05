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
            UnclosedFeaturesCount = project.Features.Count,
        };
    }
}