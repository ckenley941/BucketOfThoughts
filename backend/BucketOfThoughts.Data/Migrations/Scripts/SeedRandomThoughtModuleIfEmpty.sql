-- PostgreSQL: ensure at least one ThoughtModule exists; if the table is empty, insert 'Random'.
-- Safe to run multiple times (insert runs only when ThoughtModules has no rows).

INSERT INTO "ThoughtModules" ("CreatedDateTime", "Description")
SELECT NOW() AT TIME ZONE 'UTC', 'Random'
WHERE NOT EXISTS (SELECT 1 FROM "ThoughtModules" LIMIT 1);
