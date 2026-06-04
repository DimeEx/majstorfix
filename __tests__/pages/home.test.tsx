import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Home Page", () => {
  it("renders the heading", () => {
    render(<Page />);
    expect(screen.getByText("Најди го вистинскиот мајстор за твојата поправка")).toBeInTheDocument();
  });

  it("renders both CTA buttons", () => {
    render(<Page />);
    expect(screen.getByText("Објави работа")).toBeInTheDocument();
    expect(screen.getByText("Прегледај работи")).toBeInTheDocument();
  });

  it("has correct links", () => {
    render(<Page />);
    const postJobLink = screen.getByText("Објави работа").closest("a");
    expect(postJobLink).toHaveAttribute("href", "/post-job");

    const jobsLink = screen.getByText("Прегледај работи").closest("a");
    expect(jobsLink).toHaveAttribute("href", "/jobs");
  });
});
