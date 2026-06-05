import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/shared/navbar";

const mockRouter = { push: vi.fn(), refresh: vi.fn() };
const mockPathname = vi.fn().mockReturnValue("/");

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  }),
}));

describe("Navbar", () => {
  it("renders the logo and brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("MajstorFix")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Navbar />);
    expect(screen.getByText("Работи")).toBeInTheDocument();
    expect(screen.getByText("Објави работа")).toBeInTheDocument();
  });

  it("has correct hrefs", () => {
    render(<Navbar />);
    expect(screen.getByText("MajstorFix").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Работи").closest("a")).toHaveAttribute("href", "/jobs");
    expect(screen.getByText("Објави работа").closest("a")).toHaveAttribute("href", "/post-job");
  });

  it("shows login button when not authenticated", async () => {
    render(<Navbar />);
    expect(await screen.findByText("Најави се")).toBeInTheDocument();
  });
});
