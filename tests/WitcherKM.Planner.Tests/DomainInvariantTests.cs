using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using Xunit;

namespace WitcherKM.Planner.Tests;

public class DomainInvariantTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" \t ")]
    public void Rejected_edits_preserve_existing_values(string? invalid)
    {
        var project = new Project("Project", "Description");
        project.SetDocumentation("Docs");
        Assert.Throws<DomainException>(() => project.Update(invalid!, "Changed"));
        Assert.Equal("Project", project.Name);
        Assert.Equal("Description", project.Description);
        Assert.Equal("Docs", project.Documentation);

        var feature = new Feature("Feature", "Description", 12);
        Assert.Throws<DomainException>(() => feature.Update(invalid!, "Changed"));
        Assert.Equal("Feature", feature.Name);
        Assert.Equal("Description", feature.Description);
        Assert.Equal(12, feature.ProjectId);

        var idea = new Idea("Essence");
        Assert.Throws<DomainException>(() => idea.Update(invalid!));
        Assert.Equal("Essence", idea.Essence);
        Assert.Equal(IdeaStatus.NotRealized, idea.IdeaStatus);
    }

    [Fact]
    public void Canceled_idea_remains_editable_and_deletable()
    {
        var idea = new Idea("Original");
        idea.SetCanceled();
        idea.Update("Edited");
        idea.EnsureCanDelete();
        Assert.Equal("Edited", idea.Essence);
        Assert.Equal(IdeaStatus.Canceled, idea.IdeaStatus);
        idea.SetNotRealized();
        Assert.Equal(IdeaStatus.NotRealized, idea.IdeaStatus);
    }

    [Fact]
    public void Terminal_deletion_checks_are_enforced_by_entities_themselves()
    {
        var feature = new Feature("Feature", null, 1);
        feature.SetFeatureInProgress(); feature.SetFeatureCompleted();
        var task = new TaskItem("Task", null, 1);
        task.SetInProgress(); task.SetDone();
        var idea = new Idea("Idea"); idea.SetRealized();
        Assert.Throws<DomainException>(feature.EnsureCanDelete);
        Assert.Throws<DomainException>(task.EnsureCanDelete);
        Assert.Throws<DomainException>(idea.EnsureCanDelete);
    }

    [Fact]
    public void Repeated_project_closure_is_rejected_without_changing_features()
    {
        var project = new Project("Project", null);
        var feature = new Feature("Feature", null, project.Id);
        project.AddFeature(feature);
        feature.SetFeatureInProgress(); feature.SetFeatureCompleted();
        project.SetProjectClosed();
        Assert.Throws<DomainException>(project.SetProjectClosed);
        Assert.Equal(ProjectStatus.Closed, project.ProjectStatus);
        Assert.Same(feature, Assert.Single(project.Features));
    }
}
