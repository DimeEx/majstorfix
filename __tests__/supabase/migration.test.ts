import { readFileSync } from "fs";
import { join } from "path";

describe("Database Migration", () => {
  const migrationPath = join(
    __dirname,
    "..",
    "..",
    "supabase",
    "migrations",
    "00001_initial_schema.sql",
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

  it("creates all enum types", () => {
    expect(sql).toContain("CREATE TYPE property_enum AS ENUM");
    expect(sql).toContain("CREATE TYPE material_enum AS ENUM");
    expect(sql).toContain("CREATE TYPE urgency_enum AS ENUM");
    expect(sql).toContain("CREATE TYPE completion_time_enum AS ENUM");
    expect(sql).toContain("CREATE TYPE currency_enum AS ENUM");
  });

  it("creates jobs table with required columns", () => {
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS jobs");
    expect(sql).toContain("id UUID PRIMARY KEY");
    expect(sql).toContain("description TEXT NOT NULL");
    expect(sql).toContain("property_type property_enum");
    expect(sql).toContain("material_status material_enum");
    expect(sql).toContain("urgency urgency_enum");
    expect(sql).toContain("image_urls TEXT[]");
    expect(sql).toContain("owner_id UUID REFERENCES auth.users");
  });

  it("creates bids table with required columns", () => {
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS bids");
    expect(sql).toContain("job_id UUID REFERENCES jobs(id) ON DELETE CASCADE");
    expect(sql).toContain("handyman_phone TEXT NOT NULL");
    expect(sql).toContain("price_labor_only INT NOT NULL");
    expect(sql).toContain("price_with_materials INT");
  });

  it("creates indexes", () => {
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_jobs_city");
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_jobs_urgency");
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_jobs_created_at");
    expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_bids_job_id");
  });

  it("enables Row Level Security", () => {
    expect(sql).toContain("ALTER TABLE jobs ENABLE ROW LEVEL SECURITY");
    expect(sql).toContain("ALTER TABLE bids ENABLE ROW LEVEL SECURITY");
  });

  it("creates RLS policies", () => {
    expect(sql).toContain(`CREATE POLICY "Anyone can view jobs"`);
    expect(sql).toContain(
      `CREATE POLICY "Authenticated users can create jobs"`,
    );
    expect(sql).toContain(`CREATE POLICY "Anyone can view bids"`);
    expect(sql).toContain(
      `CREATE POLICY "Authenticated users can create bids"`,
    );
  });
});
