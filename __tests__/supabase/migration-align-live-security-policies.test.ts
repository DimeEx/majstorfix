import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration 00010 - Align Live Security Policies", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00010_align_live_security_policies.sql",
  );
  let sql: string;

  beforeAll(() => {
    sql = readFileSync(migrationPath, "utf-8");
  });

  it("migration file exists", () => {
    expect(sql).toBeTruthy();
  });

  it("removes permissive bids policies and restores owner-or-bidder reads", () => {
    expect(sql).toContain(
      'ALTER TABLE bids ADD COLUMN IF NOT EXISTS bidder_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()',
    );
    expect(sql).toContain(
      'CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id)',
    );
    expect(sql).toContain('DROP POLICY IF EXISTS "Anyone can view bids" ON bids');
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can create bids" ON bids',
    );
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Anyone can delete bids" ON bids',
    );
    expect(sql).toContain(
      'CREATE POLICY "Job owners and bidders can view bids" ON bids FOR SELECT',
    );
    expect(sql).toContain('CREATE POLICY "Authenticated users can create own bids" ON bids FOR INSERT');
  });

  it("removes regular-user writes for verified handymen", () => {
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can manage verified handymen" ON verified_handymen',
    );
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can update verified handymen" ON verified_handymen',
    );
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can delete verified handymen" ON verified_handymen',
    );
  });

  it("removes broad storage listing and revokes public function execution", () => {
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Anyone can view job images" ON storage.objects',
    );
    expect(sql).toContain(
      'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon',
    );
    expect(sql).toContain(
      'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated',
    );
  });
});
