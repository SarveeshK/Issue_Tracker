using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IssueTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPrioritySystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PriorityId",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PriorityId",
                table: "Issues",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Priorities",
                columns: table => new
                {
                    PriorityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PriorityName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ColorCode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Priorities", x => x.PriorityId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "EmployeeId", "Email", "EmployeeName", "RoleId" },
                values: new object[,]
                {
                    { 2, "sarveesh@macs.com", "Sarveesh", 1 },
                    { 3, "nigesh@macs.com", "Nigesh", 2 },
                    { 4, "keerthii@macs.com", "Keerthii", 2 },
                    { 5, "hanumanth@macs.com", "Hanumanth", 2 },
                    { 6, "gowtham@macs.com", "Gowtham", 2 }
                });

            migrationBuilder.InsertData(
                table: "Priorities",
                columns: new[] { "PriorityId", "ColorCode", "PriorityName" },
                values: new object[,]
                {
                    { 1, "red", "High" },
                    { 2, "orange", "Medium" },
                    { 3, "blue", "Low" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "EmployeeId", "Name", "PasswordHash" },
                values: new object[,]
                {
                    { 3, "sarveesh@macs.com", 2, "Sarveesh", "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G" },
                    { 4, "nigesh@macs.com", 3, "Nigesh", "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G" },
                    { 5, "keerthii@macs.com", 4, "Keerthii", "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G" },
                    { 6, "hanumanth@macs.com", 5, "Hanumanth", "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G" },
                    { 7, "gowtham@macs.com", 6, "Gowtham", "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_PriorityId",
                table: "Tasks",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_Issues_PriorityId",
                table: "Issues",
                column: "PriorityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Issues_Priorities_PriorityId",
                table: "Issues",
                column: "PriorityId",
                principalTable: "Priorities",
                principalColumn: "PriorityId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Priorities_PriorityId",
                table: "Tasks",
                column: "PriorityId",
                principalTable: "Priorities",
                principalColumn: "PriorityId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issues_Priorities_PriorityId",
                table: "Issues");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Priorities_PriorityId",
                table: "Tasks");

            migrationBuilder.DropTable(
                name: "Priorities");

            migrationBuilder.DropIndex(
                name: "IX_Tasks_PriorityId",
                table: "Tasks");

            migrationBuilder.DropIndex(
                name: "IX_Issues_PriorityId",
                table: "Issues");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "EmployeeId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "EmployeeId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "EmployeeId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "EmployeeId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Employees",
                keyColumn: "EmployeeId",
                keyValue: 6);

            migrationBuilder.DropColumn(
                name: "PriorityId",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "PriorityId",
                table: "Issues");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "");
        }
    }
}
