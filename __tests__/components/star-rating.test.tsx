import { render, screen, fireEvent } from "@testing-library/react";
import { StarRating } from "@/components/ui/star-rating";

describe("StarRating", () => {
  it("renders 5 star buttons in read-only mode", () => {
    render(<StarRating value={3} readOnly />);
    const stars = screen.getAllByRole("button");
    expect(stars).toHaveLength(5);
  });

  it("renders correct aria-label in read-only mode", () => {
    render(<StarRating value={4} readOnly />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Оценка: 4 од 5",
    );
  });

  it("renders in interactive mode by default", () => {
    render(<StarRating value={0} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("calls onChange when a star is clicked", () => {
    const handleChange = vi.fn();
    render(<StarRating value={0} onChange={handleChange} />);
    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[2]);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange when read-only", () => {
    const handleChange = vi.fn();
    render(<StarRating value={3} readOnly onChange={handleChange} />);
    const stars = screen.getAllByRole("button");
    fireEvent.click(stars[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("displays rating text when value > 0 in interactive mode", () => {
    render(<StarRating value={4} />);
    expect(screen.getByText("4 од 5")).toBeInTheDocument();
  });

  it("does not display rating text when value is 0", () => {
    render(<StarRating value={0} />);
    expect(screen.queryByText("0 од 5")).not.toBeInTheDocument();
  });
});
