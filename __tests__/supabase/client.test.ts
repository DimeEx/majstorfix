describe("Supabase Client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("client module can be imported", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    const mod = await import("@/lib/supabase/client");
    expect(mod.createClient).toBeDefined();
    expect(typeof mod.createClient).toBe("function");
  });

  it("server module can be imported", async () => {
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.ANON_API_KEY = "test-anon-key";
    const mod = await import("@/lib/supabase/server");
    expect(mod.createClient).toBeDefined();
    expect(typeof mod.createClient).toBe("function");
  });
});
