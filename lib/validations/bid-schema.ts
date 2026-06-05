import { z } from "zod";

const phoneRegex = /^\+389[0-9]{8,9}$/;

export const bidSchema = z.object({
  handyman_phone: z.string()
    .regex(phoneRegex, "Телефонот мора да биде во формат +389xxxxxxxx"),
  price_labor_only: z.coerce.number<number>().int().min(1, "Внесете цена за работа (MKD)"),
  price_with_materials: z.coerce.number<number>().int().min(1).optional().nullable(),
  price_labor_only_eur: z.coerce.number<number>().min(0).optional().nullable(),
  price_with_materials_eur: z.coerce.number<number>().min(0).optional().nullable(),
  availability_date: z.string().min(1, "Изберете датум на достапност"),
  notes: z.string().optional(),
});

export type BidInput = z.infer<typeof bidSchema>;
