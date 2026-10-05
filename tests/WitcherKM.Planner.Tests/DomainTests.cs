using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using TaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;
using Xunit;

namespace WitcherKM.Planner.Tests;

public class DomainTests
{
    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Required_text_is_validated_by_domain(string? text)
    {
        Assert.Throws<DomainException>(() => new Project(text!, null));
        Assert.Throws<DomainException>(() => new Feature(text!, null, 1));
        Assert.Throws<DomainException>(() => new Idea(text!));
        Assert.Throws<DomainException>(() => new TaskItem(text!, null, 1));
    }

    [Fact]
    public void Feature_supports_only_documented_transitions_and_completed_is_terminal()
    {
        var feature = new Feature("Feature", null, 1);
        Assert.Equal(FeatureStatus.Opened, feature.FeatureStatus);
        Assert.Throws<DomainException>(feature.SetFeatureCompleted);
        feature.SetFeatureInProgress();
        feature.SetFeatureOpened();
        feature.SetFeatureInProgress();
        feature.SetFeatureCompleted();
        Assert.Throws<DomainException>(() => feature.Update("Changed", null));
        Assert.Throws<DomainException>(feature.SetFeatureInProgress);
        Assert.Throws<DomainException>(feature.SetFeatureOpened);
        Assert.Equal(FeatureStatus.Completed, feature.FeatureStatus);
    }

    [Fact]
    public void Task_done_is_terminal_and_invalid_edit_preserves_state()
    {
        var task = new TaskItem("Task", "Description", 1);
        Assert.Equal(TaskStatus.Open, task.TaskStatus);
        Assert.Throws<DomainException>(task.SetDone);
        Assert.Throws<DomainException>(() => task.Update(" ", "Changed"));
        Assert.Equal("Description", task.Description);
        task.SetInProgress(); task.SetOpen(); task.SetInProgress(); task.SetDone();
        Assert.Throws<DomainException>(() => task.Update("Changed", null));
        Assert.Throws<DomainException>(task.SetOpen);
        Assert.Throws<DomainException>(task.SetInProgress);
        Assert.Equal(TaskStatus.Done, task.TaskStatus);
    }

    [Fact]
    public void Idea_realized_is_terminal_and_canceled_can_be_restored()
    {
        var idea = new Idea("Idea");
        Assert.Equal(IdeaStatus.NotRealized, idea.IdeaStatus);
        idea.SetCanceled();
        Assert.Throws<DomainException>(idea.SetRealized);
        idea.SetNotRealized(); idea.SetRealized();
        Assert.Throws<DomainException>(() => idea.Update("Changed"));
        Assert.Throws<DomainException>(idea.SetCanceled);
        Assert.Throws<DomainException>(idea.SetNotRealized);
    }

    [Fact]
    public void Project_closure_requires_features_all_completed_and_blocks_addition()
    {
        var project = new Project("Project", null);
        Assert.Equal(ProjectStatus.Opened, project.ProjectStatus);
        Assert.Throws<DomainException>(project.SetProjectClosed);
        var feature = new Feature("Feature", null, project.Id);
        project.AddFeature(feature);
        Assert.Throws<DomainException>(project.SetProjectClosed);
        feature.SetFeatureInProgress(); feature.SetFeatureCompleted(); project.SetProjectClosed();
        Assert.Throws<DomainException>(() => project.AddFeature(new Feature("Other", null, project.Id)));
    }
}
