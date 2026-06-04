import { render, screen } from "@testing-library/react";
import { JobBadges } from "@/components/jobs/job-badges";

describe("JobBadges", () => {
  it("renders house badge", () => {
    render(<JobBadges propertyType="house" floor={null} hasElevator={false} urgency="flexible" />);
    expect(screen.getByText("Куќа")).toBeInTheDocument();
  });

  it("renders apartment badge with floor info", () => {
    render(<JobBadges propertyType="apartment" floor={3} hasElevator={true} urgency="emergency" />);
    expect(screen.getByText("Стан - 3. кат")).toBeInTheDocument();
  });

  it("shows no elevator warning", () => {
    render(<JobBadges propertyType="apartment" floor={5} hasElevator={false} urgency="few_days" />);
    expect(screen.getByText("Стан - 5. кат (без лифт)")).toBeInTheDocument();
  });

  it("renders urgency badges with correct text", () => {
    const { rerender } = render(<JobBadges propertyType="house" floor={null} hasElevator={false} urgency="emergency" />);
    expect(screen.getByText("Итно")).toBeInTheDocument();

    rerender(<JobBadges propertyType="house" floor={null} hasElevator={false} urgency="few_days" />);
    expect(screen.getByText("2-3 дена")).toBeInTheDocument();

    rerender(<JobBadges propertyType="house" floor={null} hasElevator={false} urgency="flexible" />);
    expect(screen.getByText("Флексибилно")).toBeInTheDocument();
  });
});
