import { render, screen } from "@testing-library/react";
import { ContactButtons } from "@/components/dashboard/contact-buttons";

describe("ContactButtons", () => {
  it("renders call and Viber buttons", () => {
    render(<ContactButtons phone="+38970123456" jobId="job-123" />);
    expect(screen.getByText("Повикај")).toBeInTheDocument();
    expect(screen.getByText("Viber")).toBeInTheDocument();
  });

  it("call button links to tel: URI", () => {
    render(<ContactButtons phone="+38970123456" jobId="job-123" />);
    const callLink = screen.getByText("Повикај").closest("a");
    expect(callLink).toHaveAttribute("href", "tel:+38970123456");
  });

  it("Viber button has deep link", () => {
    render(<ContactButtons phone="+38970123456" jobId="job-123" />);
    const viberLink = screen.getByText("Viber").closest("a");
    expect(viberLink?.getAttribute("href")).toContain("viber://");
    expect(viberLink?.getAttribute("href")).toContain("job-123");
  });
});
