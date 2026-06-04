import { z } from "zod";

export const propertyTypeEnum = z.enum(["house", "apartment"]);
export const materialStatusEnum = z.enum(["buyer_provides", "handyman_provides", "negotiable"]);
export const urgencyEnum = z.enum(["emergency", "few_days", "flexible"]);

export const stepGeneralInfoSchema = z.object({
  city: z.string().min(1, "Градот е задолжителен"),
  neighborhood: z.string().min(1, "Населбата е задолжителна"),
  description: z.string().min(10, "Опишете го проблемот подетално (мин. 10 карактери)"),
  images: z.array(z.string()).min(1, "Задолжително прикачете барем една слика"),
});

export const stepPropertyTraitsSchema = z.object({
  property_type: propertyTypeEnum,
  floor: z.coerce.number<number>().int().min(0).optional().nullable(),
  has_elevator: z.boolean().optional(),
  is_occupied: z.boolean(),
});

export const stepLogisticsSchema = z.object({
  material_status: materialStatusEnum,
  urgency: urgencyEnum,
  active_days: z.coerce.number<number>().int().refine(
    (val) => [1, 3, 7].includes(val),
    { message: "Изберете валиден период на истекување" }
  ),
  budget_min: z.coerce.number<number>().int().min(1, "Внесете минимален буџет"),
  budget_max: z.coerce.number<number>().int().min(1, "Внесете максимален буџет"),
}).refine(
  (data) => data.budget_max >= data.budget_min,
  {
    message: "Максималниот буџет мора да биде поголем или еднаков на минималниот",
    path: ["budget_max"],
  }
);

export const fullJobSchema = stepGeneralInfoSchema
  .merge(stepPropertyTraitsSchema)
  .merge(stepLogisticsSchema);

export type StepGeneralInfo = z.infer<typeof stepGeneralInfoSchema>;
export type StepPropertyTraits = z.infer<typeof stepPropertyTraitsSchema>;
export type StepLogistics = z.infer<typeof stepLogisticsSchema>;
export type FullJobInput = z.infer<typeof fullJobSchema>;
