using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BucketOfThoughts.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeleteConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtBuckets_LoginProfile_LoginProfileId",
                table: "ThoughtBuckets");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtBuckets_ThoughtModules_ThoughtModuleId",
                table: "ThoughtBuckets");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtDetails_Thoughts_ThoughtId",
                table: "ThoughtDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_Thoughts_LoginProfile_LoginProfileId",
                table: "Thoughts");

            migrationBuilder.DropForeignKey(
                name: "FK_Thoughts_ThoughtBuckets_ThoughtBucketId",
                table: "Thoughts");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtWebsiteLinks_Thoughts_ThoughtId",
                table: "ThoughtWebsiteLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtWebsiteLinks_WebsiteLinks_WebsiteLinkId",
                table: "ThoughtWebsiteLinks");

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtBuckets_LoginProfile_LoginProfileId",
                table: "ThoughtBuckets",
                column: "LoginProfileId",
                principalTable: "LoginProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtBuckets_ThoughtModules_ThoughtModuleId",
                table: "ThoughtBuckets",
                column: "ThoughtModuleId",
                principalTable: "ThoughtModules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtDetails_Thoughts_ThoughtId",
                table: "ThoughtDetails",
                column: "ThoughtId",
                principalTable: "Thoughts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Thoughts_LoginProfile_LoginProfileId",
                table: "Thoughts",
                column: "LoginProfileId",
                principalTable: "LoginProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Thoughts_ThoughtBuckets_ThoughtBucketId",
                table: "Thoughts",
                column: "ThoughtBucketId",
                principalTable: "ThoughtBuckets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtWebsiteLinks_Thoughts_ThoughtId",
                table: "ThoughtWebsiteLinks",
                column: "ThoughtId",
                principalTable: "Thoughts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtWebsiteLinks_WebsiteLinks_WebsiteLinkId",
                table: "ThoughtWebsiteLinks",
                column: "WebsiteLinkId",
                principalTable: "WebsiteLinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtBuckets_LoginProfile_LoginProfileId",
                table: "ThoughtBuckets");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtBuckets_ThoughtModules_ThoughtModuleId",
                table: "ThoughtBuckets");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtDetails_Thoughts_ThoughtId",
                table: "ThoughtDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_Thoughts_LoginProfile_LoginProfileId",
                table: "Thoughts");

            migrationBuilder.DropForeignKey(
                name: "FK_Thoughts_ThoughtBuckets_ThoughtBucketId",
                table: "Thoughts");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtWebsiteLinks_Thoughts_ThoughtId",
                table: "ThoughtWebsiteLinks");

            migrationBuilder.DropForeignKey(
                name: "FK_ThoughtWebsiteLinks_WebsiteLinks_WebsiteLinkId",
                table: "ThoughtWebsiteLinks");

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtBuckets_LoginProfile_LoginProfileId",
                table: "ThoughtBuckets",
                column: "LoginProfileId",
                principalTable: "LoginProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtBuckets_ThoughtModules_ThoughtModuleId",
                table: "ThoughtBuckets",
                column: "ThoughtModuleId",
                principalTable: "ThoughtModules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtDetails_Thoughts_ThoughtId",
                table: "ThoughtDetails",
                column: "ThoughtId",
                principalTable: "Thoughts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Thoughts_LoginProfile_LoginProfileId",
                table: "Thoughts",
                column: "LoginProfileId",
                principalTable: "LoginProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Thoughts_ThoughtBuckets_ThoughtBucketId",
                table: "Thoughts",
                column: "ThoughtBucketId",
                principalTable: "ThoughtBuckets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtWebsiteLinks_Thoughts_ThoughtId",
                table: "ThoughtWebsiteLinks",
                column: "ThoughtId",
                principalTable: "Thoughts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThoughtWebsiteLinks_WebsiteLinks_WebsiteLinkId",
                table: "ThoughtWebsiteLinks",
                column: "WebsiteLinkId",
                principalTable: "WebsiteLinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
