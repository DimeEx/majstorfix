"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fullJobSchema, type FullJobInput } from "@/lib/validations/job-schema";

export async function createJob(formData: FullJobInput) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { error: "Мора да бидете најавени за да објавите работа." };
  }

  const parsed = fullJobSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: "Проверете ги внесените податоци." };
  }

  const { error } = await (supabase.from("jobs") as any).insert({
    description: parsed.data.description,
    city: parsed.data.city,
    neighborhood: parsed.data.neighborhood,
    trade_type: parsed.data.trade_type,
    property_type: parsed.data.property_type,
    floor: parsed.data.floor ?? null,
    has_elevator: parsed.data.has_elevator ?? false,
    is_occupied: parsed.data.is_occupied,
    material_status: parsed.data.material_status,
    urgency: parsed.data.urgency,
    urgency_custom: parsed.data.urgency_custom ?? null,
    completion_time: parsed.data.completion_time,
    completion_time_custom: parsed.data.completion_time_custom ?? null,
    active_days: parsed.data.active_days,
    currency: parsed.data.currency,
    budget_min: parsed.data.budget_min,
    budget_max: parsed.data.budget_max,
    image_urls: parsed.data.images ?? [],
    owner_id: userData.user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/jobs");
  return { success: true };
}
