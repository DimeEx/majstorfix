-- Migration: Revoke PUBLIC execution on rls_auto_enable
-- PUBLIC grants still allow anon/authenticated to execute this function even after role-specific revokes.

-- ============================================
-- UP
-- ============================================

DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
  END IF;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- DO $$ BEGIN
--   IF EXISTS (
--     SELECT 1
--     FROM pg_proc p
--     JOIN pg_namespace n ON n.oid = p.pronamespace
--     WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
--   ) THEN
--     GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO PUBLIC;
--   END IF;
-- END $$;
