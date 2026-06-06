import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration 00005 - Verified Handymen", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00005_verified_handymen.sql",
  );
  let sql: string;

  beforeAll(() => {
    sql = readFileSync(migrationPath, "utf-8");
  });

  it("migration file exists", () => {
    expect(sql).toBeTruthy();
  });

  it("contains UP section markers", () => {
    expect(sql).toContain("UP");
    expect(sql).toContain("DOWN");
  });

  it("creates verified_handymen table with phone as primary key", () => {
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS verified_handymen");
    expect(sql).toContain("phone TEXT PRIMARY KEY");
  });

  it("creates index", () => {
    expect(sql).toContain(
      "CREATE INDEX IF NOT EXISTS idx_verified_handymen_phone",
    );
  });

  it("enables Row Level Security", () => {
    expect(sql).toContain(
      "ALTER TABLE verified_handymen ENABLE ROW LEVEL SECURITY",
    );
  });

  it("creates RLS policies", () => {
    expect(sql).toContain(`CREATE POLICY "Anyone can view verified handymen"`);
    expect(sql).toContain(
      `CREATE POLICY "Authenticated users can manage verified handymen"`,
    );
    expect(sql).toContain(
      `CREATE POLICY "Authenticated users can update verified handymen"`,
    );
    expect(sql).toContain(
      `CREATE POLICY "Authenticated users can delete verified handymen"`,
    );
  });
});
