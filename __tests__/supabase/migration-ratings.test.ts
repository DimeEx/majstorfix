import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration 00004 - Ratings", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00004_ratings.sql",
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

  it("creates ratings table with required columns", () => {
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS ratings");
    expect(sql).toContain("id UUID PRIMARY KEY");
    expect(sql).toContain(
      "bid_id UUID UNIQUE REFERENCES bids(id) ON DELETE CASCADE",
    );
    expect(sql).toContain("job_id UUID REFERENCES jobs(id) ON DELETE CASCADE");
    expect(sql).toContain("reviewer_id UUID REFERENCES auth.users(id)");
    expect(sql).toContain("handyman_phone TEXT NOT NULL");
    expect(sql).toContain("rating INT NOT NULL CHECK");
    expect(sql).toContain("comment TEXT DEFAULT NULL");
  });

  it("creates indexes", () => {
    expect(sql).toContain(
      "CREATE INDEX IF NOT EXISTS idx_ratings_handyman_phone",
    );
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_ratings_job_id");
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_ratings_bid_id");
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_ratings_reviewer_id");
  });

  it("enables Row Level Security", () => {
    expect(sql).toContain("ALTER TABLE ratings ENABLE ROW LEVEL SECURITY");
  });

  it("creates RLS policies", () => {
    expect(sql).toContain(`CREATE POLICY "Anyone can view ratings"`);
    expect(sql).toContain(
      `CREATE POLICY "Job owners can rate bids on their jobs"`,
    );
    expect(sql).toContain(
      `CREATE POLICY "Reviewers can update their own ratings"`,
    );
    expect(sql).toContain(
      `CREATE POLICY "Reviewers can delete their own ratings"`,
    );
  });
});
