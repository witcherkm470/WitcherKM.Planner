using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WitcherKM.Common.Core.Exceptions;
using WitcherKM.Common.Orm.Abstractions;
using WitcherKM.Planner.Application.Common.Exceptions;
using WitcherKM.Planner.Application.Features.Commands;
using WitcherKM.Planner.Application.Ideas.Commands;
using WitcherKM.Planner.Application.Ideas.Queries;
using WitcherKM.Planner.Application.Projects.Commands;
using WitcherKM.Planner.Application.Projects.Queries;
using WitcherKM.Planner.Application.Tasks;
using WitcherKM.Planner.Domain.Entities;
using WitcherKM.Planner.Domain.Enums;
using WitcherKM.Planner.Infrastructure;
using WitcherKM.Planner.Infrastructure.DI;
using TaskStatus = WitcherKM.Planner.Domain.Enums.TaskStatus;
using Xunit;

namespace WitcherKM.Planner.Tests;

public sealed class ApplicationIntegrationTests : IAsyncLifetime
{
    private readonly string _database = Path.Combine(Path.GetTempPath(), "planner-test-" + Guid.NewGuid() + ".db");
    private ServiceProvider _provider = null!;
    private long _projectId;
    private long _featureId;

    public async Task InitializeAsync()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        { ["ConnectionStrings:DefaultConnection"] = $"Data Source={_database};Pooling=False" }).Build();
        var services = new ServiceCollection();
        services.AddInfrastructure(config);
        _provider = services.BuildServiceProvider();
        using var scope = _provider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
        await db.Database.MigrateAsync();
        var project = new Project("Project", "Description");
        db.Projects.Add(project); await db.SaveChangesAsync();
        var feature = new Feature("Feature", "Description", project.Id);
        db.Features.Add(feature); await db.SaveChangesAsync();
        _projectId = project.Id; _featureId = feature.Id;
    }

    private async Task<T> Run<THandler, T>(Func<THandler, Task<T>> action)
    {
        using var scope = _provider.CreateScope();
        return await action(ActivatorUtilities.CreateInstance<THandler>(scope.ServiceProvider));
    }
    private async Task Run<THandler>(Func<THandler, Task> action)
    {
        using var scope = _provider.CreateScope();
        await action(ActivatorUtilities.CreateInstance<THandler>(scope.ServiceProvider));
    }

    [Fact]
    public async Task Task_writes_return_full_parent_chain_and_persist_between_requests()
    {
        var created = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.Add("Task", "Description", _featureId), default));
        Assert.Equal(_featureId, created.FeatureId);
        Assert.Equal("Feature", created.FeatureName);
        Assert.Equal(_projectId, created.ProjectId);
        Assert.Equal("Project", created.ProjectName);
        var changed = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.Update(created.Id, "Edited", "New"), default));
        Assert.Equal(_projectId, changed.ProjectId);
        Assert.Equal("Feature", changed.FeatureName);
        var started = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.ChangeStatus(created.Id, TaskStatus.InProgress), default));
        Assert.Equal("Project", started.ProjectName);
        var loaded = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.GetById(created.Id), default));
        Assert.Equal("Edited", loaded.Name);
        Assert.Equal(TaskStatus.InProgress, loaded.TaskStatus);
    }

    [Fact]
    public async Task Closed_project_rejects_feature_without_persisting_it()
    {
        using (var scope = _provider.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
            var project = await db.Projects.Include(x => x.Features).SingleAsync();
            var feature = project.Features.Single();
            feature.SetFeatureInProgress(); feature.SetFeatureCompleted(); project.SetProjectClosed();
            await db.SaveChangesAsync();
        }
        await Assert.ThrowsAsync<DomainException>(() => Run<AddFeature.Handler>(h => h.Handle(new AddFeature.Command("Forbidden", null, _projectId), default)));
        using var verify = _provider.CreateScope();
        Assert.Equal(1, await verify.ServiceProvider.GetRequiredService<PlannerDbContext>().Features.CountAsync());
    }

    [Fact]
    public async Task Missing_parents_are_rejected()
    {
        await Assert.ThrowsAsync<EntityNotFoundException>(() => Run<AddFeature.Handler>(h => h.Handle(new AddFeature.Command("Feature", null, -1), default)));
        await Assert.ThrowsAsync<EntityNotFoundException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Add("Task", null, -1), default)));
    }

    [Fact]
    public async Task Project_cannot_be_deleted_with_features_and_card_counts_only_opened()
    {
        await Assert.ThrowsAsync<DeleteProjectException>(() => Run<RemoveProject.Handler>(h => h.Handle(new RemoveProject.Command(_projectId), default)));
        var card = await Run<GetProjectById.Handler, WitcherKM.Planner.Application.Common.Models.Projects.ProjectExtendedModel>(h => h.Handle(new GetProjectById.Query(_projectId), default));
        Assert.Equal(1, card.OpenedFeatureCount);
        await Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(_featureId, FeatureStatus.InProgress), default));
        card = await Run<GetProjectById.Handler, WitcherKM.Planner.Application.Common.Models.Projects.ProjectExtendedModel>(h => h.Handle(new GetProjectById.Query(_projectId), default));
        Assert.Equal(0, card.OpenedFeatureCount);
    }

    [Fact]
    public async Task Terminal_entities_cannot_be_deleted_and_task_status_filter_is_applied()
    {
        long taskId; long ideaId;
        using (var scope = _provider.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
            var task = new TaskItem("Done", null, _featureId); task.SetInProgress(); task.SetDone();
            var idea = new Idea("Realized"); idea.SetRealized();
            var feature = await db.Features.SingleAsync(); feature.SetFeatureInProgress(); feature.SetFeatureCompleted();
            db.Tasks.Add(task); db.Ideas.Add(idea); await db.SaveChangesAsync(); taskId = task.Id; ideaId = idea.Id;
        }
        await Assert.ThrowsAsync<DomainException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Remove(taskId), default)));
        await Assert.ThrowsAsync<DomainException>(() => Run<RemoveFeature.Handler>(h => h.Handle(new RemoveFeature.Command(_featureId), default)));
        await Assert.ThrowsAsync<DomainException>(() => Run<RemoveIdea.Handler>(h => h.Handle(new RemoveIdea.Command(ideaId), default)));
        var open = await Run<TaskOperations.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>>(h => h.Handle(new TaskOperations.Get(_featureId, TaskStatus.Open), default));
        Assert.Empty(open);
        var done = await Run<TaskOperations.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>>(h => h.Handle(new TaskOperations.Get(_featureId, TaskStatus.Done), default));
        Assert.Single(done);
    }

    [Fact]
    public async Task Ideas_filter_includes_realized_by_default_and_canceled_separately()
    {
        using (var scope = _provider.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
            var realized = new Idea("Realized"); realized.SetRealized();
            var canceled = new Idea("Canceled"); canceled.SetCanceled();
            db.Ideas.AddRange(new Idea("Open"), realized, canceled); await db.SaveChangesAsync();
        }
        var normal = await Run<GetIdeas.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Ideas.IdeaModel>>(h => h.Handle(new GetIdeas.Query(false), default));
        Assert.Equal(2, normal.Count());
        Assert.DoesNotContain(normal, x => x.IdeaStatus == IdeaStatus.Canceled);
        var canceledOnly = await Run<GetIdeas.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Ideas.IdeaModel>>(h => h.Handle(new GetIdeas.Query(true), default));
        Assert.Equal(IdeaStatus.Canceled, Assert.Single(canceledOnly).IdeaStatus);
    }

    [Fact]
    public async Task Project_creation_editing_documentation_and_empty_deletion_round_trip()
    {
        var created = await Run<AddProject.Handler, WitcherKM.Planner.Application.Common.Models.Projects.ProjectModel>(h => h.Handle(new AddProject.Command("New", null), default));
        Assert.Equal(ProjectStatus.Opened, created.ProjectStatus);
        await Run<UpdateProject.Handler>(h => h.Handle(new UpdateProject.Command(created.Id, "Edited", "Description"), default));
        await Run<UpdateProjectCard.Handler>(h => h.Handle(new UpdateProjectCard.Command(created.Id, "Card", "Details", "Documentation"), default));
        var card = await Run<GetProjectById.Handler, WitcherKM.Planner.Application.Common.Models.Projects.ProjectExtendedModel>(h => h.Handle(new GetProjectById.Query(created.Id), default));
        Assert.Equal("Card", card.Name); Assert.Equal("Documentation", card.Documentation); Assert.Equal(0, card.OpenedFeatureCount);
        await Run<RemoveProject.Handler>(h => h.Handle(new RemoveProject.Command(created.Id), default));
        await Assert.ThrowsAsync<EntityNotFoundException>(() => Run<GetProjectById.Handler>(h => h.Handle(new GetProjectById.Query(created.Id), default)));
    }

    [Fact]
    public async Task Feature_round_trip_and_forbidden_changes_leave_completed_state_unchanged()
    {
        var created = await Run<AddFeature.Handler, WitcherKM.Planner.Application.Common.Models.Feature.FeatureModel>(h => h.Handle(new AddFeature.Command("New", null, _projectId), default));
        await Run<UpdateFeature.Handler>(h => h.Handle(new UpdateFeature.Command(created.Id, "Edited", "Details"), default));
        await Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(created.Id, FeatureStatus.InProgress), default));
        await Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(created.Id, FeatureStatus.Opened), default));
        await Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(created.Id, FeatureStatus.InProgress), default));
        await Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(created.Id, FeatureStatus.Completed), default));
        await Assert.ThrowsAsync<DomainException>(() => Run<ChangeFeatureStatus.Handler>(h => h.Handle(new ChangeFeatureStatus.Command(created.Id, FeatureStatus.Opened), default)));
        await Assert.ThrowsAsync<DomainException>(() => Run<UpdateFeature.Handler>(h => h.Handle(new UpdateFeature.Command(created.Id, "Forbidden", null), default)));
        using var scope = _provider.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
        var persisted = await db.Features.SingleAsync(x => x.Id == created.Id);
        Assert.Equal("Edited", persisted.Name); Assert.Equal(FeatureStatus.Completed, persisted.FeatureStatus);
    }

    [Fact]
    public async Task Invalid_task_writes_are_rolled_back_and_nonterminal_delete_succeeds()
    {
        var task = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.Add("Original", "Description", _featureId), default));
        await Assert.ThrowsAsync<DomainException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Update(task.Id, " ", "Bad"), default)));
        await Assert.ThrowsAsync<DomainException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.ChangeStatus(task.Id, (TaskStatus)99), default)));
        await Assert.ThrowsAsync<DomainException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.ChangeStatus(task.Id, TaskStatus.Done), default)));
        var loaded = await Run<TaskOperations.Handler, WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>(h => h.Handle(new TaskOperations.GetById(task.Id), default));
        Assert.Equal("Original", loaded.Name); Assert.Equal("Description", loaded.Description); Assert.Equal(TaskStatus.Open, loaded.TaskStatus);
        await Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Remove(task.Id), default));
        await Assert.ThrowsAsync<EntityNotFoundException>(() => Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.GetById(task.Id), default)));
    }

    [Fact]
    public async Task Task_feature_filter_never_leaks_other_features()
    {
        var other = await Run<AddFeature.Handler, WitcherKM.Planner.Application.Common.Models.Feature.FeatureModel>(h => h.Handle(new AddFeature.Command("Other", null, _projectId), default));
        await Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Add("First", null, _featureId), default));
        await Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Add("Second", null, other.Id), default));
        var filtered = await Run<TaskOperations.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Tasks.TaskModel>>(h => h.Handle(new TaskOperations.Get(_featureId, null), default));
        Assert.Equal("First", Assert.Single(filtered).Name);
    }

    [Fact]
    public async Task Idea_create_edit_cancel_restore_delete_and_invalid_status_round_trip()
    {
        var idea = await Run<AddIdea.Handler, WitcherKM.Planner.Application.Common.Models.Ideas.IdeaModel>(h => h.Handle(new AddIdea.Command("Original"), default));
        await Run<UpdateIdea.Handler>(h => h.Handle(new UpdateIdea.Command(idea.Id, "Edited"), default));
        await Run<ChangeIdeaStatus.Handler>(h => h.Handle(new ChangeIdeaStatus.Command(idea.Id, IdeaStatus.Canceled), default));
        await Assert.ThrowsAsync<DomainException>(() => Run<ChangeIdeaStatus.Handler>(h => h.Handle(new ChangeIdeaStatus.Command(idea.Id, IdeaStatus.Realized), default)));
        await Run<ChangeIdeaStatus.Handler>(h => h.Handle(new ChangeIdeaStatus.Command(idea.Id, IdeaStatus.NotRealized), default));
        await Assert.ThrowsAsync<DomainException>(() => Run<ChangeIdeaStatus.Handler>(h => h.Handle(new ChangeIdeaStatus.Command(idea.Id, (IdeaStatus)99), default)));
        var normal = await Run<GetIdeas.Handler, IEnumerable<WitcherKM.Planner.Application.Common.Models.Ideas.IdeaModel>>(h => h.Handle(new GetIdeas.Query(false), default));
        Assert.Equal("Edited", Assert.Single(normal).Essence);
        await Run<RemoveIdea.Handler>(h => h.Handle(new RemoveIdea.Command(idea.Id), default));
        await Assert.ThrowsAsync<EntityNotFoundException>(() => Run<UpdateIdea.Handler>(h => h.Handle(new UpdateIdea.Command(idea.Id, "Missing"), default)));
    }

    [Fact]
    public async Task Feature_with_tasks_keeps_existing_restrict_storage_policy()
    {
        await Run<TaskOperations.Handler>(h => h.Handle(new TaskOperations.Add("Child", null, _featureId), default));
        await Assert.ThrowsAsync<DbUpdateException>(() => Run<RemoveFeature.Handler>(h => h.Handle(new RemoveFeature.Command(_featureId), default)));
        using var scope = _provider.CreateScope(); var db = scope.ServiceProvider.GetRequiredService<PlannerDbContext>();
        Assert.Equal(1, await db.Features.CountAsync()); Assert.Equal(1, await db.Tasks.CountAsync());
    }

    public async Task DisposeAsync()
    {
        await _provider.DisposeAsync();
        File.Delete(_database);
    }
}
