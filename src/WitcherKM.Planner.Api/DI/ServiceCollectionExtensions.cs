using Microsoft.EntityFrameworkCore;
using WitcherKM.Planner.Infrastructure;

namespace WitcherKM.Planner.Api.DI;

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
      var publishedSettingsPath = Path.Combine(builder.Environment.ContentRootPath, "appsettings.json");
      var sourceSettingsPath = Path.GetFullPath(
         Path.Combine(
            builder.Environment.ContentRootPath,
            "..",
            "..",
            "shared",
            "appsettings.json"));

      builder.Configuration.AddJsonFile(
         File.Exists(publishedSettingsPath) ? publishedSettingsPath : sourceSettingsPath,
         optional: false,
         reloadOnChange: true);

      // Shared defaults are followed by developer and deployment secrets.
      if (builder.Environment.IsDevelopment())
         builder.Configuration.AddUserSecrets<Program>(optional: true);
      builder.Configuration.AddEnvironmentVariables();
      builder.Configuration.AddKeyPerFile("/run/secrets", optional: true);
   }
}
