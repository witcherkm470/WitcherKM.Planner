using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using WitcherKM.Planner.Infrastructure;

#nullable disable

namespace WitcherKM.Planner.Infrastructure.Migrations;

[DbContext(typeof(PlannerDbContext))]
[Migration("20260929120000_AddTaskItem")]
public partial class AddTaskItem : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Tasks",
            columns: table => new
            {
                Id = table.Column<long>(type: "INTEGER", nullable: false).Annotation("Sqlite:Autoincrement", true),
                FeatureId = table.Column<long>(type: "INTEGER", nullable: false),
                Name = table.Column<string>(type: "TEXT", nullable: false),
                Description = table.Column<string>(type: "TEXT", nullable: true),
                TaskStatus = table.Column<int>(type: "INTEGER", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Tasks", x => x.Id);
                table.ForeignKey("FK_Tasks_Features_FeatureId", x => x.FeatureId, "Features", "Id", onDelete: ReferentialAction.Restrict);
            });
        migrationBuilder.CreateIndex(name: "IX_Tasks_FeatureId", table: "Tasks", column: "FeatureId");
    }
    protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.DropTable(name: "Tasks");
}
