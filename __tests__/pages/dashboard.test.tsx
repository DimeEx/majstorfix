import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: "test-user" } }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  }),
}));

describe("Dashboard Page", () => {
  it("renders page title", async () => {
    const Page = await DashboardPage();
    render(Page);
    expect(screen.getByText("Моите работи")).toBeInTheDocument();
  });
});
