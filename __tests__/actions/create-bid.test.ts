import { createBid } from "@/lib/actions/create-bid";

const mockGetUser = vi.fn();
const mockInsert = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

const validInput = {
  jobId: "123e4567-e89b-12d3-a456-426614174000",
  handyman_phone: "+38970123456",
  price_labor_only: 3000,
  price_with_materials: 5000,
  price_labor_only_eur: 50,
  price_with_materials_eur: 80,
  availability_date: "2026-06-15",
  notes: "Можам да дојдам претпладне",
};

describe("createBid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const result = await createBid(validInput);

    expect(result).toEqual({
      error: "Мора да бидете најавени за да испратите понуда.",
    });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns error when getUser fails", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error("Auth error"),
    });

    const result = await createBid(validInput);

    expect(result).toEqual({
      error: "Мора да бидете најавени за да испратите понуда.",
    });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns error for invalid phone number", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });

    const result = await createBid({
      ...validInput,
      handyman_phone: "070123456",
    });

    expect(result).toEqual({ error: "Проверете ги внесените податоци." });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns error for missing availability date", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });

    const result = await createBid({
      ...validInput,
      availability_date: "",
    });

    expect(result).toEqual({ error: "Проверете ги внесените податоци." });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns success when authenticated with valid data and insert succeeds", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const result = await createBid(validInput);

    expect(result).toEqual({ success: true });
    expect(mockInsert).toHaveBeenCalledWith({
      job_id: validInput.jobId,
      bidder_id: "test-user",
      handyman_phone: validInput.handyman_phone,
      price_labor_only: validInput.price_labor_only,
      price_with_materials: validInput.price_with_materials,
      price_labor_only_eur: validInput.price_labor_only_eur,
      price_with_materials_eur: validInput.price_with_materials_eur,
      availability_date: validInput.availability_date,
      notes: validInput.notes,
    });
  });

  it("returns error message when insert fails", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockInsert.mockResolvedValue({
      error: new Error("new row violates row-level security policy"),
    });

    const result = await createBid(validInput);

    expect(result).toEqual({
      error: "new row violates row-level security policy",
    });
  });

  it("returns success with optional fields set to null when not provided", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const result = await createBid({
      jobId: validInput.jobId,
      handyman_phone: validInput.handyman_phone,
      price_labor_only: validInput.price_labor_only,
      availability_date: validInput.availability_date,
    });

    expect(result).toEqual({ success: true });
    expect(mockInsert).toHaveBeenCalledWith({
      job_id: validInput.jobId,
      bidder_id: "test-user",
      handyman_phone: validInput.handyman_phone,
      price_labor_only: validInput.price_labor_only,
      price_with_materials: null,
      price_labor_only_eur: null,
      price_with_materials_eur: null,
      availability_date: validInput.availability_date,
      notes: null,
    });
  });
});
