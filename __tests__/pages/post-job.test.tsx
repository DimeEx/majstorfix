import { render, screen } from "@testing-library/react";
import PostJobPage from "@/app/post-job/page";

describe("Post Job Page", () => {
  it("renders page title", () => {
    render(<PostJobPage />);
    expect(screen.getByText("Објави нова работа")).toBeInTheDocument();
  });
});
