import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Home Page", () => {
  it("renders the heading", () => {
    render(<Page />);
    expect(
      screen.getByText((content) =>
        content.includes("Најди го вистинскиот мајстор")
      )
    ).toBeInTheDocument();
  });

  it("renders both CTA buttons", () => {
    render(<Page />);
    const ctaButtons = screen.getAllByText("Објави работа");
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Прегледај работи")).toBeInTheDocument();
  });

  it("has correct links", () => {
    render(<Page />);
    const postJobLinks = screen.getAllByText("Објави работа");
    const postJobAnchor = postJobLinks.find(
      (el) => el.closest("a")?.getAttribute("href") === "/post-job"
    );
    expect(postJobAnchor?.closest("a")).toHaveAttribute("href", "/post-job");

    const browseLink = screen.getByText("Прегледај работи").closest("a");
    expect(browseLink).toHaveAttribute("href", "/jobs");
  });
});
