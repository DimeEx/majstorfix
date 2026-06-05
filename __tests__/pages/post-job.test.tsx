import { render, screen } from "@testing-library/react";
import PostJobPage from "@/app/post-job/page";

const mockRouter = { push: vi.fn(), refresh: vi.fn() };

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  }),
}));

describe("Post Job Page", () => {
  it("renders page title", () => {
    render(<PostJobPage />);
    expect(screen.getByText("Објави нова работа")).toBeInTheDocument();
  });
});
