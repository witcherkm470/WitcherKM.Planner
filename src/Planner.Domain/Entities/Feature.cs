using Planner.Domain.Enums;
using WitcherKM.Common.Domain.Entities.Abstractions;
using WitcherKM.Common.Core.Exceptions;

namespace Planner.Domain.Entities;

public class Feature : IEntity
{
    public long Id { get; private set;}
    
    public long ProjectId { get; private set; }
    
    public Project Project { get; private set; } = null!;

    public string Name
    {
        get;
        private set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new DomainException("Project name cannot be empty");

            field = value;
        }
    }

    public string? Description { get; private set; }

    public FeatureStatus FeatureStatus { get; private set; }
    
    private Feature()
    {
        
    }

    public Feature(string name, string? description, long projectId)
    {
        SetFeatureName(name);
        SetDescription(description);
        ProjectId = projectId;
        FeatureStatus =  FeatureStatus.Opened;
    }
    
    public void SetFeatureName(string featureName)
    {
        Name = featureName;
    }

    public void SetDescription(string? description)
    {
        Description = description;
    }

    public void SetFeatureInProgress()
    {
        if(FeatureStatus != FeatureStatus.Opened)
            throw new DomainException("Feature is not opened");
        
        FeatureStatus = FeatureStatus.InProgress;
    }

    public void SetFeatureCompleted()
    {
        if(FeatureStatus != FeatureStatus.InProgress)
            throw new DomainException("Feature is not in progress");
        
        FeatureStatus = FeatureStatus.Completed;
    }
    
    public void SetFeatureOpened()
    {
        if(FeatureStatus == FeatureStatus.Opened)
            throw new DomainException("Feature is already opened");
        
        FeatureStatus = FeatureStatus.Opened;
    }
}