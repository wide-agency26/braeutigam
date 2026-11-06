-- The Next.js server connects as postgres and bypasses RLS.
-- These policies only constrain the Supabase Data API.

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "Admin" FROM anon, authenticated;
REVOKE ALL ON TABLE "Application" FROM anon, authenticated;
REVOKE ALL ON TABLE "Job" FROM anon, authenticated;
REVOKE ALL ON TABLE "_prisma_migrations" FROM anon, authenticated;

GRANT SELECT ON TABLE "Job" TO anon, authenticated;

CREATE POLICY "Published jobs are public"
ON "Job"
FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED');

-- Prisma creates tables as postgres. Stop the public API roles
-- from receiving access to those future tables automatically.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.enable_rls_on_new_table()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT object_identity
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table', 'partitioned table')
      AND schema_name = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', obj.object_identity);
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS enable_rls_on_new_public_table;
CREATE EVENT TRIGGER enable_rls_on_new_public_table
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.enable_rls_on_new_table();

REVOKE ALL ON FUNCTION public.enable_rls_on_new_table() FROM PUBLIC, anon, authenticated;
