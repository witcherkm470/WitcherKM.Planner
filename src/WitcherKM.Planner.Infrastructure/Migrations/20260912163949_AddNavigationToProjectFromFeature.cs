using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WitcherKM.Planner.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationToProjectFromFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Features_Projects_ProjectId",
                table: "Features");

            migrationBuilder.AddForeignKey(
                name: "FK_Features_Projects_ProjectId",
                table: "Features",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Features_Projects_ProjectId",
                table: "Features");

            migrationBuilder.AddForeignKey(
                name: "FK_Features_Projects_ProjectId",
                table: "Features",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
