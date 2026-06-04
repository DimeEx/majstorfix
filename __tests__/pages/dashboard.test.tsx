import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

describe("Dashboard Page", () => {
  it("renders page title", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Моите работи")).toBeInTheDocument();
  });
});
