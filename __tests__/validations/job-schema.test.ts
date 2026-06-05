import {
  stepGeneralInfoSchema,
  stepPropertyTraitsSchema,
  stepLogisticsSchema,
  fullJobSchema,
} from "@/lib/validations/job-schema";

describe("Step 1: General Info", () => {
  it("accepts valid input", () => {
    const result = stepGeneralInfoSchema.safeParse({
      city: "Skopje",
      neighborhood: "Centar",
      description: "My kitchen sink is leaking badly and needs fixing",
      trade_type: "plumbing",
      images: ["https://example.com/photo.jpg"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty city", () => {
    const result = stepGeneralInfoSchema.safeParse({
      city: "",
      neighborhood: "Centar",
      description: "Leaky faucet issue in the bathroom",
      trade_type: "plumbing",
      images: ["https://example.com/photo.jpg"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty neighborhood", () => {
    const result = stepGeneralInfoSchema.safeParse({
      city: "Skopje",
      neighborhood: "",
      description: "Leaky faucet issue in the bathroom",
      trade_type: "plumbing",
      images: ["https://example.com/photo.jpg"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = stepGeneralInfoSchema.safeParse({
      city: "Skopje",
      neighborhood: "Centar",
      description: "Short",
      trade_type: "plumbing",
      images: ["https://example.com/photo.jpg"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty images (optional)", () => {
    const result = stepGeneralInfoSchema.safeParse({
      city: "Skopje",
      neighborhood: "Centar",
      description: "Leaky faucet issue in the bathroom",
      trade_type: "plumbing",
      images: [],
    });
    expect(result.success).toBe(true);
  });
});

describe("Step 2: Property Traits", () => {
  it("accepts house with valid fields", () => {
    const result = stepPropertyTraitsSchema.safeParse({
      property_type: "house",
      is_occupied: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts apartment with valid fields", () => {
    const result = stepPropertyTraitsSchema.safeParse({
      property_type: "apartment",
      floor: 3,
      has_elevator: true,
      is_occupied: false,
    });
    expect(result.success).toBe(true);
  });

  it("accepts apartment with null floor", () => {
    const result = stepPropertyTraitsSchema.safeParse({
      property_type: "apartment",
      floor: null,
      has_elevator: false,
      is_occupied: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid property_type", () => {
    const result = stepPropertyTraitsSchema.safeParse({
      property_type: "castle",
      is_occupied: true,
    });
    expect(result.success).toBe(false);
  });

  it("accepts missing has_elevator (optional for houses)", () => {
    const result = stepPropertyTraitsSchema.safeParse({
      property_type: "house",
      is_occupied: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("Step 3: Logistics & Budget", () => {
  it("accepts valid input", () => {
    const result = stepLogisticsSchema.safeParse({
      material_status: "negotiable",
      urgency: "emergency",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 3,
      budget_min: 1000,
      budget_max: 5000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects budget_min > budget_max", () => {
    const result = stepLogisticsSchema.safeParse({
      material_status: "buyer_provides",
      urgency: "flexible",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 7,
      budget_min: 5000,
      budget_max: 1000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid active_days", () => {
    const result = stepLogisticsSchema.safeParse({
      material_status: "handyman_provides",
      urgency: "few_days",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 99,
      budget_min: 1000,
      budget_max: 2000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid material_status", () => {
    const result = stepLogisticsSchema.safeParse({
      material_status: "invalid",
      urgency: "flexible",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 1,
      budget_min: 500,
      budget_max: 1500,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero budget_min", () => {
    const result = stepLogisticsSchema.safeParse({
      material_status: "negotiable",
      urgency: "emergency",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 3,
      budget_min: 0,
      budget_max: 5000,
    });
    expect(result.success).toBe(false);
  });
});

describe("Full Job Schema", () => {
  it("accepts complete valid input", () => {
    const result = fullJobSchema.safeParse({
      city: "Ohrid",
      neighborhood: "Varosh",
      description: "Need to install new electrical outlets in the living room",
      trade_type: "electrical",
      images: ["https://example.com/electrical.jpg"],
      property_type: "apartment",
      floor: 2,
      has_elevator: true,
      is_occupied: true,
      material_status: "buyer_provides",
      urgency: "flexible",
      completion_time: "1-2_days",
      currency: "MKD",
      active_days: 7,
      budget_min: 5000,
      budget_max: 15000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when required fields are missing", () => {
    const result = fullJobSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
