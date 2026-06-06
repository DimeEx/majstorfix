import { deleteJob } from "@/lib/actions/delete-job";

const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockDelete = vi.fn();
const mockRemove = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: () => ({
      select: mockSelect,
      delete: mockDelete,
    }),
    storage: {
      from: () => ({
        remove: mockRemove,
      }),
    },
  }),
}));

const validJobId = "123e4567-e89b-12d3-a456-426614174000";
const imageUrl =
  "https://tmjooyvpjlinqafchcil.supabase.co/storage/v1/object/public/job-images/test-uuid/image.jpg";

describe("deleteJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({
      error: "Мора да бидете најавени за да избришете работа.",
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns error when job is not found", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () =>
          Promise.resolve({ data: null, error: { message: "Not found" } }),
      }),
    });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({ error: "Работата не е пронајдена." });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns error when user is not the owner", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-2" } },
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () =>
          Promise.resolve({ data: { owner_id: "user-1", image_urls: [] } }),
      }),
    });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({ error: "Можете да избришете само ваша работа." });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("deletes job and storage images successfully", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () =>
          Promise.resolve({
            data: { owner_id: "user-1", image_urls: [imageUrl] },
          }),
      }),
    });
    mockDelete.mockReturnValue({
      eq: () => Promise.resolve({ error: null }),
    });
    mockRemove.mockResolvedValue({ error: null });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({ success: true });
    expect(mockRemove).toHaveBeenCalledWith(["test-uuid/image.jpg"]);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("deletes job successfully even when there are no images", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () =>
          Promise.resolve({ data: { owner_id: "user-1", image_urls: [] } }),
      }),
    });
    mockDelete.mockReturnValue({
      eq: () => Promise.resolve({ error: null }),
    });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({ success: true });
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it("returns error when delete fails", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () =>
          Promise.resolve({ data: { owner_id: "user-1", image_urls: [] } }),
      }),
    });
    mockDelete.mockReturnValue({
      eq: () => Promise.resolve({ error: new Error("Delete failed") }),
    });

    const result = await deleteJob(validJobId);

    expect(result).toEqual({ error: "Delete failed" });
  });
});
