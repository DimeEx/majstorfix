import { z } from "zod";

export const ratingSchema = z.object({
  bid_id: z.string().uuid("Невалиден ID на понуда"),
  job_id: z.string().uuid("Невалиден ID на работа"),
  handyman_phone: z
    .string()
    .regex(
      /^\+389[0-9]{8,9}$/,
      "Телефонот мора да биде во формат +389xxxxxxxx",
    ),
  rating: z.coerce
    .number<number>()
    .int()
    .min(1, "Оценката мора да биде помеѓу 1 и 5")
    .max(5, "Оценката мора да биде помеѓу 1 и 5"),
  comment: z
    .string()
    .max(500, "Коментарот може да има најмногу 500 карактери")
    .optional(),
});

export type RatingInput = z.infer<typeof ratingSchema>;
