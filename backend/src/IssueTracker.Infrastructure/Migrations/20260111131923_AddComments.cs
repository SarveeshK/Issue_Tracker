using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IssueTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments");

            migrationBuilder.AlterColumn<int>(
                name: "TaskId",
                table: "Comments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "IssueId",
                table: "Comments",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 8,
                column: "PasswordHash",
                value: "$2a$11$KvPy9NrOot89vFBFYKFrRept.YRyGH7gNb0if0G7Ku1fHtYN4FZrK");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_IssueId",
                table: "Comments",
                column: "IssueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Issues_IssueId",
                table: "Comments",
                column: "IssueId",
                principalTable: "Issues",
                principalColumn: "IssueId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Issues_IssueId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_IssueId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "IssueId",
                table: "Comments");

            migrationBuilder.AlterColumn<int>(
                name: "TaskId",
                table: "Comments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 6,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 7,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 8,
                column: "PasswordHash",
                value: "$2a$11$QWO/8n8bGiCwgbRrea5vE.rKt9.ow1.DmDaxWlTvf7trsM8BpeJUm");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Tasks_TaskId",
                table: "Comments",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "TaskId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
