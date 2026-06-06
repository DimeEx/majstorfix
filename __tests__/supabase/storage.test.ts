import {
  getThumbnailUrl,
  getLightboxUrl,
  getOptimizedImageUrl,
} from "@/lib/supabase/storage";

const supabaseUrl =
  "https://tmjooyvpjlinqafchcil.supabase.co/storage/v1/object/public/job-images/test.jpg";
const externalUrl = "https://example.com/image.jpg";

describe("getOptimizedImageUrl", () => {
  it("returns original URL for non-Supabase URLs", () => {
    expect(getOptimizedImageUrl(externalUrl)).toBe(externalUrl);
  });

  it("adds width and height parameters", () => {
    const result = getOptimizedImageUrl(supabaseUrl, {
      width: 400,
      height: 300,
    });
    expect(result).toContain(
      "/storage/v1/render/image/public/job-images/test.jpg",
    );
    expect(result).toContain("width=400");
    expect(result).toContain("height=300");
  });

  it("adds quality parameter", () => {
    const result = getOptimizedImageUrl(supabaseUrl, { quality: 80 });
    expect(result).toContain("quality=80");
  });
});

describe("getThumbnailUrl", () => {
  it("returns optimized URL with thumbnail dimensions", () => {
    const result = getThumbnailUrl(supabaseUrl);
    expect(result).toContain("width=400");
    expect(result).toContain("height=300");
    expect(result).toContain("quality=80");
  });

  it("returns original URL for non-Supabase URLs", () => {
    expect(getThumbnailUrl(externalUrl)).toBe(externalUrl);
  });
});

describe("getLightboxUrl", () => {
  it("returns optimized URL with lightbox dimensions", () => {
    const result = getLightboxUrl(supabaseUrl);
    expect(result).toContain("width=1200");
    expect(result).toContain("quality=85");
  });

  it("returns original URL for non-Supabase URLs", () => {
    expect(getLightboxUrl(externalUrl)).toBe(externalUrl);
  });
});
