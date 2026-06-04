import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/shared/navbar";

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
});
