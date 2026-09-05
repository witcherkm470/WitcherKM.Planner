using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Planner.Infrastructure.Repositories;
using WitcherKM.Common.Orm.DI;

namespace Planner.Infrastructure.DI;

public static class ServiceCollectionExtensions
{
    public const string ConnectionStringName = "DefaultConnection";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = GetConnectionString(configuration);
        
        services.SetupDatabase(connectionString);
        services.AddRepositories();

        return services;
    }
    
    private static IServiceCollection SetupDatabase(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PlannerDbContext>(options => options.UseSqlite(connectionString));
        services.AddUnitOfWork<PlannerDbContext>();

        return services;
    }
    
    private static string GetConnectionString(IConfiguration configuration)
    {
        ArgumentNullException.ThrowIfNull(configuration);

        var connectionString = configuration.GetConnectionString(ConnectionStringName);

        return string.IsNullOrWhiteSpace(connectionString)
            ? throw new InvalidOperationException($"Connection string '{ConnectionStringName}' is not configured.")
            : connectionString;
    }

    private static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IFeatureRepository, FeatureRepository>();

        return services;
    }
}