using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IssueTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddResolvedStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Statuses",
                columns: new[] { "StatusId", "Priority", "Severity", "StatusName" },
                values: new object[] { 4, 0, 0, "Resolved" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 8,
                column: "PasswordHash",
                value: "$2a$11$xDGG7Sc0UJviV62WQr78O.AFIX2rKgc1MpBCJ2a3VOP3QMu/VKtIK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Statuses",
                keyColumn: "StatusId",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 8,
                column: "PasswordHash",
                value: "$2a$11$CVJWrntWvcle3j8edkbb4OqBP.bnEvopHJ1g2lTXk6YdkBbu3OWvS");
        }
    }
}
