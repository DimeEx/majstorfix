import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration 00009 - Secure Bids and Verified Handymen", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00009_secure_bids_and_verified_handymen.sql",
  );
  let sql: string;

  beforeAll(() => {
    sql = readFileSync(migrationPath, "utf-8");
  });

  it("migration file exists", () => {
    expect(sql).toBeTruthy();
  });

  it("adds bidder ownership to bids", () => {
    expect(sql).toContain(
      "ALTER TABLE bids ADD COLUMN IF NOT EXISTS bidder_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()",
    );
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_bids_bidder_id");
  });

  it("replaces public bid reads with owner-or-bidder reads", () => {
    expect(sql).toContain('DROP POLICY IF EXISTS "Anyone can view bids"');
    expect(sql).toContain(
      'CREATE POLICY "Job owners and bidders can view bids"',
    );
    expect(sql).toContain("auth.uid() = bidder_id");
    expect(sql).toContain("jobs.owner_id = auth.uid()");
  });

  it("replaces generic bid inserts with own-bid inserts", () => {
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can create bids"',
    );
    expect(sql).toContain(
      'CREATE POLICY "Authenticated users can create own bids"',
    );
    expect(sql).toContain("AND bidder_id = auth.uid()");
  });

  it("removes regular-user writes for verified handymen", () => {
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can manage verified handymen"',
    );
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can update verified handymen"',
    );
    expect(sql).toContain(
      'DROP POLICY IF EXISTS "Authenticated users can delete verified handymen"',
    );
    expect(sql).toContain("No INSERT/UPDATE/DELETE policies are created");
  });
});
