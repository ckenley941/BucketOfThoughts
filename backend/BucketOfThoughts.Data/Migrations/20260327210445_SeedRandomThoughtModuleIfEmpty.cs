using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BucketOfThoughts.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedRandomThoughtModuleIfEmpty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ThoughtBuckets_ParentId",
                table: "ThoughtBuckets",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtBuckets_ThoughtBuckets_ParentId",
                table: "ThoughtBuckets",
                column: "ParentId",
                principalTable: "ThoughtBuckets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            // If ThoughtModules has no rows, insert default module (PostgreSQL)
            migrationBuilder.Sql(
                """
                INSERT INTO "ThoughtModules" ("CreatedDateTime", "Description")
                SELECT NOW() AT TIME ZONE 'UTC', 'Random'
                WHERE NOT EXISTS (SELECT 1 FROM "ThoughtModules" LIMIT 1);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtBuckets_ThoughtBuckets_ParentId",
                table: "ThoughtBuckets");

            migrationBuilder.DropIndex(
                name: "IX_ThoughtBuckets_ParentId",
                table: "ThoughtBuckets");
        }
    }
}
