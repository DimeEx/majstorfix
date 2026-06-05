import { ratingSchema } from "@/lib/validations/rating-schema";

describe("Rating Schema", () => {
  const validInput = {
    bid_id: "123e4567-e89b-12d3-a456-426614174000",
    job_id: "223e4567-e89b-12d3-a456-426614174001",
    handyman_phone: "+38970123456",
    rating: 4,
    comment: "Одлична работа!",
  };

  it("accepts valid rating with all fields", () => {
    const result = ratingSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts rating without comment", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      comment: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimum rating of 1", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      rating: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts maximum rating of 5", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      rating: 5,
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      rating: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      rating: 6,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      rating: 3.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone format", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      handyman_phone: "070123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid bid_id", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      bid_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects comment exceeding 500 characters", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      comment: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts comment at exactly 500 characters", () => {
    const result = ratingSchema.safeParse({
      ...validInput,
      comment: "x".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});
