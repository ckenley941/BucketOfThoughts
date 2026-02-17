using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BucketOfThoughts.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexToLoginProfileAuth0Id : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_LoginProfile_Auth0Id",
                table: "LoginProfile",
                column: "Auth0Id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_LoginProfile_Auth0Id",
                table: "LoginProfile");
        }
    }
}
