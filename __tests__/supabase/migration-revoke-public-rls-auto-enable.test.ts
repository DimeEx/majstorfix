import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration 00011 - Revoke PUBLIC rls_auto_enable Execute", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00011_revoke_public_rls_auto_enable_execute.sql",
  );
  let sql: string;

  beforeAll(() => {
    sql = readFileSync(migrationPath, "utf-8");
  });

  it("migration file exists", () => {
    expect(sql).toBeTruthy();
  });

  it("revokes execute from PUBLIC and app roles", () => {
    expect(sql).toContain(
      'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC',
    );
    expect(sql).toContain(
      'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon',
    );
    expect(sql).toContain(
      'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated',
    );
  });
});
