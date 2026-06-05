import type { Job, Bid, Database } from "@/lib/supabase/types";

describe("Supabase Types", () => {
  it("Job type has all required fields", () => {
    const job: Job = {
      id: "uuid-1",
      description: "Leaky faucet",
      city: "Skopje",
      neighborhood: "Centar",
      property_type: "apartment",
      floor: 3,
      has_elevator: false,
      is_occupied: true,
      material_status: "negotiable",
      urgency: "few_days",
      urgency_custom: null,
      completion_time: "1-2_hours",
      completion_time_custom: null,
      active_days: 3,
      currency: "MKD",
      budget_min: 1000,
      budget_max: 5000,
      trade_type: "plumbing",
      image_urls: ["https://example.com/photo.jpg"],
      owner_id: null,
      created_at: "2026-01-01T00:00:00Z",
    };
    expect(job.id).toBe("uuid-1");
    expect(job.city).toBe("Skopje");
    expect(job.property_type).toBe("apartment");
    expect(job.floor).toBe(3);
    expect(job.has_elevator).toBe(false);
  });

  it("Job without optional fields (floor null, house type)", () => {
    const job: Job = {
      id: "uuid-2",
      description: "Garden work",
      city: "Bitola",
      neighborhood: "Bair",
      property_type: "house",
      floor: null,
      has_elevator: false,
      is_occupied: false,
      material_status: "buyer_provides",
      urgency: "flexible",
      urgency_custom: null,
      completion_time: "3+_days",
      completion_time_custom: null,
      active_days: 7,
      currency: "EUR",
      budget_min: 2000,
      budget_max: 10000,
      trade_type: "other",
      image_urls: [],
      owner_id: null,
      created_at: "2026-02-01T00:00:00Z",
    };
    expect(job.property_type).toBe("house");
    expect(job.floor).toBeNull();
    expect(job.has_elevator).toBe(false);
  });

  it("Bid type has all required fields", () => {
    const bid: Bid = {
      id: "uuid-bid-1",
      job_id: "uuid-job-1",
      handyman_phone: "+38970123456",
      price_labor_only: 3000,
      price_with_materials: 5000,
      availability_date: "2026-06-10",
      notes: "I can do it in the morning",
      created_at: "2026-01-01T00:00:00Z",
    };
    expect(bid.handyman_phone).toBe("+38970123456");
    expect(bid.price_labor_only).toBe(3000);
    expect(bid.price_with_materials).toBe(5000);
  });

  it("Bid allows null price_with_materials", () => {
    const bid: Bid = {
      id: "uuid-bid-2",
      job_id: "uuid-job-2",
      handyman_phone: "+38970123457",
      price_labor_only: 2500,
      price_with_materials: null,
      availability_date: "2026-06-12",
      notes: null,
      created_at: "2026-01-02T00:00:00Z",
    };
    expect(bid.price_with_materials).toBeNull();
    expect(bid.notes).toBeNull();
  });

  it("Database type reflects table structure", () => {
    const db: Database = {
      public: {
        Tables: {
          jobs: {
            Row: {} as Job,
            Insert: {} as Omit<Job, "id" | "created_at">,
            Update: {} as Partial<Omit<Job, "id" | "created_at">>,
            Relationships: [],
          },
          bids: {
            Row: {} as Bid,
            Insert: {} as Omit<Bid, "id" | "created_at">,
            Update: {} as Partial<Omit<Bid, "id" | "created_at">>,
            Relationships: [],
          },
        },
        Views: {},
        Functions: {},
      },
    };
    expect(db.public.Tables.jobs).toBeDefined();
    expect(db.public.Tables.bids).toBeDefined();
  });
});
