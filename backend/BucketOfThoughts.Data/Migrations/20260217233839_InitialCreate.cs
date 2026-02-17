using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BucketOfThoughts.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoginProfile",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Auth0Id = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThoughtModules",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThoughtModules", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WebsiteLinks",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    WebsiteUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsiteLinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThoughtBuckets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LoginProfileId = table.Column<long>(type: "bigint", nullable: false),
                    ThoughtModuleId = table.Column<long>(type: "bigint", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ParentId = table.Column<long>(type: "bigint", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    ShowOnDashboard = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThoughtBuckets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThoughtBuckets_LoginProfile_LoginProfileId",
                        column: x => x.LoginProfileId,
                        principalTable: "LoginProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThoughtBuckets_ThoughtModules_ThoughtModuleId",
                        column: x => x.ThoughtModuleId,
                        principalTable: "ThoughtModules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Thoughts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LoginProfileId = table.Column<long>(type: "bigint", nullable: false),
                    ThoughtGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoughtBucketId = table.Column<long>(type: "bigint", nullable: false),
                    TextType = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    ThoughtDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ShowOnDashboard = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Thoughts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Thoughts_LoginProfile_LoginProfileId",
                        column: x => x.LoginProfileId,
                        principalTable: "LoginProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Thoughts_ThoughtBuckets_ThoughtBucketId",
                        column: x => x.ThoughtBucketId,
                        principalTable: "ThoughtBuckets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RelatedThoughts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ParentThoughtId = table.Column<long>(type: "bigint", nullable: false),
                    RelatedThoughtId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelatedThoughts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RelatedThoughts_Thoughts_ParentThoughtId",
                        column: x => x.ParentThoughtId,
                        principalTable: "Thoughts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RelatedThoughts_Thoughts_RelatedThoughtId",
                        column: x => x.RelatedThoughtId,
                        principalTable: "Thoughts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ThoughtDetails",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDateTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: false),
                    ThoughtId = table.Column<long>(type: "bigint", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThoughtDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThoughtDetails_Thoughts_ThoughtId",
                        column: x => x.ThoughtId,
                        principalTable: "Thoughts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ThoughtWebsiteLinks",
                columns: table => new
                {
                    ThoughtId = table.Column<long>(type: "bigint", nullable: false),
                    WebsiteLinkId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThoughtWebsiteLinks", x => new { x.ThoughtId, x.WebsiteLinkId });
                    table.ForeignKey(
                        name: "FK_ThoughtWebsiteLinks_Thoughts_ThoughtId",
                        column: x => x.ThoughtId,
                        principalTable: "Thoughts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThoughtWebsiteLinks_WebsiteLinks_WebsiteLinkId",
                        column: x => x.WebsiteLinkId,
                        principalTable: "WebsiteLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RelatedThoughts_ParentThoughtId",
                table: "RelatedThoughts",
                column: "ParentThoughtId");

            migrationBuilder.CreateIndex(
                name: "IX_RelatedThoughts_RelatedThoughtId",
                table: "RelatedThoughts",
                column: "RelatedThoughtId");

            migrationBuilder.CreateIndex(
                name: "IX_ThoughtBuckets_LoginProfileId",
                table: "ThoughtBuckets",
                column: "LoginProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_ThoughtBuckets_ThoughtModuleId",
                table: "ThoughtBuckets",
                column: "ThoughtModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ThoughtDetails_ThoughtId",
                table: "ThoughtDetails",
                column: "ThoughtId");

            migrationBuilder.CreateIndex(
                name: "IX_Thoughts_LoginProfileId",
                table: "Thoughts",
                column: "LoginProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Thoughts_ThoughtBucketId",
                table: "Thoughts",
                column: "ThoughtBucketId");

            migrationBuilder.CreateIndex(
                name: "IX_ThoughtWebsiteLinks_WebsiteLinkId",
                table: "ThoughtWebsiteLinks",
                column: "WebsiteLinkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RelatedThoughts");

            migrationBuilder.DropTable(
                name: "ThoughtDetails");

            migrationBuilder.DropTable(
                name: "ThoughtWebsiteLinks");

            migrationBuilder.DropTable(
                name: "Thoughts");

            migrationBuilder.DropTable(
                name: "WebsiteLinks");

            migrationBuilder.DropTable(
                name: "ThoughtBuckets");

            migrationBuilder.DropTable(
                name: "LoginProfile");

            migrationBuilder.DropTable(
                name: "ThoughtModules");
        }
    }
}
