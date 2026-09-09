using Planner.Api.DI;
using Planner.Application.DI;
using Planner.Infrastructure.DI;
using WitcherKM.Common.Core.MiddleWare;

var builder = WebApplication.CreateBuilder(args);
builder.AddSharedConfiguration();

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration["MediatR:LicenseKey"]);
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.UseHttpsRedirection();
app.UseCustomExceptionMiddleware();
await app.ApplyDatabaseMigrationsAsync();

app.Run();