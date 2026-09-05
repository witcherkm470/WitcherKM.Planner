using Microsoft.Extensions.DependencyInjection;

namespace Planner.Application.DI;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services, string? licenseKey)
    {
        if(string.IsNullOrWhiteSpace(licenseKey))
            throw new InvalidOperationException("No MediatR license key specified.");
        
        services.AddMediatR(configuration =>
        {
            configuration.LicenseKey = licenseKey;

            configuration.RegisterServicesFromAssembly(
                typeof(ServiceCollectionExtensions).Assembly);
        });

        return services;
    }
}