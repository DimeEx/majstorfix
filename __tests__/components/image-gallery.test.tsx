import { render, screen, fireEvent } from "@testing-library/react";
import { ImageGallery } from "@/components/jobs/image-gallery";

const fullUrl =
  "https://tmjooyvpjlinqafchcil.supabase.co/storage/v1/object/public/job-images/test.jpg";
const thumbnailUrl =
  "https://tmjooyvpjlinqafchcil.supabase.co/storage/v1/render/image/public/job-images/test.jpg?width=400&height=300&quality=80";

const images = [
  fullUrl,
  "https://tmjooyvpjlinqafchcil.supabase.co/storage/v1/object/public/job-images/image2.jpg",
];

vi.mock("@/lib/supabase/storage", () => ({
  getThumbnailUrl: (url: string) =>
    url.includes("test.jpg")
      ? thumbnailUrl
      : `${url.replace("/object/public/", "/render/image/public/")}?width=400&height=300&quality=80`,
  getLightboxUrl: (url: string) =>
    `${url.replace("/object/public/", "/render/image/public/")}?width=1200&quality=85`,
}));

describe("ImageGallery", () => {
  it("renders nothing when images array is empty", () => {
    const { container } = render(<ImageGallery images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when images is null", () => {
    const { container } = render(
      <ImageGallery images={null as unknown as string[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when images is undefined", () => {
    const { container } = render(
      <ImageGallery images={undefined as unknown as string[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows image count for single image", () => {
    render(<ImageGallery images={[images[0]]} />);
    expect(screen.getByText("1 слика")).toBeInTheDocument();
  });

  it("shows image count for multiple images", () => {
    render(<ImageGallery images={images} />);
    expect(screen.getByText("2 слики")).toBeInTheDocument();
  });

  it("renders thumbnails with optimized URLs", () => {
    render(<ImageGallery images={images} />);
    const imgs = screen.getAllByRole("img");
    expect(decodeURIComponent(imgs[0].getAttribute("src") ?? "")).toContain(
      thumbnailUrl,
    );
  });

  it("sets responsive thumbnail sizing metadata", () => {
    render(<ImageGallery images={images} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs[0]).toHaveAttribute("sizes", "(min-width: 640px) 33vw, 50vw");
  });

  it("opens dialog when an image is clicked", () => {
    render(<ImageGallery images={images} />);
    const thumbnails = screen.getAllByRole("button");
    fireEvent.click(thumbnails[0]);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("shows correct counter after clicking second image", () => {
    render(<ImageGallery images={images} />);
    const thumbnails = screen.getAllByRole("button");
    fireEvent.click(thumbnails[1]);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("shows navigation arrows when multiple images", () => {
    render(<ImageGallery images={images} />);
    const thumbnails = screen.getAllByRole("button");
    fireEvent.click(thumbnails[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });
});
