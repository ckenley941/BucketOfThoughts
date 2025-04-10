using Microsoft.EntityFrameworkCore.Migrations;

namespace BucketOfThoughts.Data
{
    public static class SeedData
    {
        public static void AddDefaultThoughtModule(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"IF NOT EXISTS (SELECT id FROM ThoughtModule WHERE Description = 'ThoughtModule')
                      BEGIN
                         INSERT INTO ThoughtModule (Description) VALUES ('RandomThought')
                         INSERT INTO ThoughtBucket (ModifiedDateTime, ThoughtModuleId, Description, SortOrder)
                         VALUES (GETUTCDATE(), SCOPE_IDENTITY(), 'Random Thought', 1)
                      END
                      GO");
        }
    }
}
