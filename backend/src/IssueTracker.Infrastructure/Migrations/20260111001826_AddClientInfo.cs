using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IssueTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddClientInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Users",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Issues",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "Internal", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "ClientCo", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "MACS", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "MACS", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "MACS", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "MACS", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                columns: new[] { "CompanyName", "PasswordHash" },
                values: new object[] { "MACS", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CompanyName", "Email", "EmployeeId", "Name", "PasswordHash" },
                values: new object[] { 8, "Perfect Solutions", "ramesh@perfect.com", null, "Ramesh", "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS" });

            migrationBuilder.CreateIndex(
                name: "IX_Issues_CreatedByUserId",
                table: "Issues",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Issues_Users_CreatedByUserId",
                table: "Issues",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issues_Users_CreatedByUserId",
                table: "Issues");

            migrationBuilder.DropIndex(
                name: "IX_Issues_CreatedByUserId",
                table: "Issues");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 8);

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Issues");

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

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                column: "PasswordHash",
                value: "$2a$11$67CIDzGlgHJOpFfPU3aDP..TD5GZ0FqiBqmQlUMdVQ/Z9wQ7YE02G");
        }
    }
}
