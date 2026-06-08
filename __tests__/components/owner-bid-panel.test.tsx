import { render, screen } from "@testing-library/react";
import { OwnerBidPanel } from "@/components/bid/owner-bid-panel";
import type { Bid } from "@/lib/supabase/types";

const mockBids: Bid[] = [
  {
    id: "bid-1",
    job_id: "job-1",
    bidder_id: "user-1",
    handyman_phone: "+38970123456",
    price_labor_only: 3000,
    price_with_materials: 5000,
    price_labor_only_eur: 50,
    price_with_materials_eur: 80,
    availability_date: "2026-06-15",
    notes: "Можам да дојдам",
    created_at: "2026-06-05T10:00:00Z",
  },
  {
    id: "bid-2",
    job_id: "job-1",
    bidder_id: "user-2",
    handyman_phone: "+38970765432",
    price_labor_only: 2500,
    price_with_materials: null,
    price_labor_only_eur: null,
    price_with_materials_eur: null,
    availability_date: "2026-06-16",
    notes: null,
    created_at: "2026-06-05T11:00:00Z",
  },
];

vi.mock("@/lib/actions/create-rating", () => ({
  createRating: vi.fn(),
}));

describe("OwnerBidPanel", () => {
  it("renders empty state when no bids", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={[]}
        existingRatings={[]}
        verifiedPhones={[]}
      />,
    );

    expect(
      screen.getByText("Сè уште нема понуди за оваа работа."),
    ).toBeInTheDocument();
  });

  it("renders bid count in title", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={mockBids}
        existingRatings={[]}
        verifiedPhones={[]}
      />,
    );

    expect(screen.getByText("Пристигнати понуди (2)")).toBeInTheDocument();
  });

  it("shows verified badge for verified handyman", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={mockBids}
        existingRatings={[]}
        verifiedPhones={["+38970123456"]}
      />,
    );

    const badges = screen.getAllByText("Верификуван");
    expect(badges).toHaveLength(1);
  });

  it("does not show verified badge for unverified handyman", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={mockBids}
        existingRatings={[]}
        verifiedPhones={[]}
      />,
    );

    expect(screen.queryByText("Верификуван")).not.toBeInTheDocument();
  });

  it("shows verified badge only for the correct bid", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={mockBids}
        existingRatings={[]}
        verifiedPhones={["+38970123456"]}
      />,
    );

    const badges = screen.getAllByText("Верификуван");
    expect(badges).toHaveLength(1);
  });

  it("shows multiple verified badges when multiple handymen are verified", () => {
    render(
      <OwnerBidPanel
        jobId="job-1"
        bids={mockBids}
        existingRatings={[]}
        verifiedPhones={["+38970123456", "+38970765432"]}
      />,
    );

    const badges = screen.getAllByText("Верификуван");
    expect(badges).toHaveLength(2);
  });
});
