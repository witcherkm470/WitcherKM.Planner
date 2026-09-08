using Planner.Domain.Enums;
using WitcherKM.Common.Domain.Entities.Abstractions;
using WitcherKM.Common.Domain.Exceptions;

namespace Planner.Domain.Entities;

public class Project : IEntity
{
    public long Id { get; private set; }

    public string Name
    {
        get;
        private set
        {
            if(string.IsNullOrWhiteSpace(value))
                throw new DomainException("Project name cannot be empty");
            
            field = value;
        }
    }
    
    public string? Description { get; private set; }

    public string? Documentation { get; private set; }
    
    private readonly List<Feature> _features = [];

    public IReadOnlyCollection<Feature> Features => _features;
    
    public ProjectStatus ProjectStatus { get; private set; }
    
    private Project()
    {
        
    }

    public Project(string name, string? description, string? documentation)
    {
        SetProjectName(name);
        SetDescription(description);
        SetDocumentation(documentation);
        SetProjectOpened();
    }

    private void SetProjectName(string name)
    {
        Name = name;
    }
    
    private void SetDescription(string? description)
    {
        Description = description;
    }
    
    private void SetDocumentation(string? documentation)
    {
        Documentation = documentation;
    }

    private void SetProjectOpened()
    {
        if(ProjectStatus == ProjectStatus.Opened)
            throw new DomainException("Project is opened");
        
        ProjectStatus = ProjectStatus.Opened;
    }

    public void SetProjectClosed()
    {
        if(ProjectStatus == ProjectStatus.Closed)
            throw new DomainException("Project is closed");
        
        if(Features.Count == 0)
            throw new DomainException("No features found");
        
        if(Features.Any(x=>x.FeatureStatus != FeatureStatus.Completed))
            throw new DomainException("Not all feature in project completed");
        
        ProjectStatus = ProjectStatus.Closed;
    }

    public void AddFeature(Feature feature)
    {
        if (ProjectStatus == ProjectStatus.Closed)
            throw new DomainException(
                "Cannot add feature to closed project");
        
        _features.Add(feature);
    }
}