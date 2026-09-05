using Microsoft.EntityFrameworkCore;
using Planner.Infrastructure;

namespace Planner.Api.DI;

public static class ServiceCollectionExtensions
{
   public static async Task ApplyDatabaseMigrationsAsync(this WebApplication app)
   {
      using var scope = app.Services.CreateScope();

      var dbContext = scope.ServiceProvider
         .GetRequiredService<PlannerDbContext>();

      await dbContext.Database.MigrateAsync();
   }

   public static void AddSharedConfiguration(this WebApplicationBuilder builder)
   {
      var sharedSettingsPath = Path.GetFullPath(
         Path.Combine(
            builder.Environment.ContentRootPath,
            "..",
            "..",
            "shared",
            "appsettings.json"));

      builder.Configuration.AddJsonFile(
         sharedSettingsPath,
         optional: false,
         reloadOnChange: true);
   }
}