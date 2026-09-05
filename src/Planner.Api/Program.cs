using Planner.Api.DI;
using Planner.Infrastructure.DI;

var builder = WebApplication.CreateBuilder(args);
builder.AddSharedConfiguration();

builder.Services.SetupDatabase(builder.Configuration);

var app = builder.Build();

await app.ApplyDatabaseMigrationsAsync();

app.Run();