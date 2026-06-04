import { bidSchema } from "@/lib/validations/bid-schema";

describe("Bid Schema", () => {
  it("accepts valid bid with all fields", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38970123456",
      price_labor_only: 3000,
      price_with_materials: 5000,
      availability_date: "2026-06-10",
      notes: "I can come in the morning",
    });
    expect(result.success).toBe(true);
  });

  it("accepts bid without materials price", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38970123456",
      price_labor_only: 2500,
      price_with_materials: null,
      availability_date: "2026-06-12",
    });
    expect(result.success).toBe(true);
  });

  it("accepts bid without notes", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38970123456",
      price_labor_only: 1500,
      availability_date: "2026-06-08",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid phone format", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "070123456",
      price_labor_only: 2000,
      availability_date: "2026-06-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-Macedonian phone prefix", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38160123456",
      price_labor_only: 2000,
      availability_date: "2026-06-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero labor price", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38970123456",
      price_labor_only: 0,
      availability_date: "2026-06-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty availability date", () => {
    const result = bidSchema.safeParse({
      handyman_phone: "+38970123456",
      price_labor_only: 2000,
      availability_date: "",
    });
    expect(result.success).toBe(false);
  });
});
