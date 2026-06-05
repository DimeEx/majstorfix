"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bidSchema } from "@/lib/validations/bid-schema";

interface CreateBidInput {
  jobId: string;
  handyman_phone: string;
  price_labor_only: number;
  price_with_materials?: number | null;
  price_labor_only_eur?: number | null;
  price_with_materials_eur?: number | null;
  availability_date: string;
  notes?: string | null;
}

export async function createBid(input: CreateBidInput) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { error: "Мора да бидете најавени за да испратите понуда." };
  }

  const parsed = bidSchema.safeParse({
    handyman_phone: input.handyman_phone,
    price_labor_only: input.price_labor_only,
    price_with_materials: input.price_with_materials,
    price_labor_only_eur: input.price_labor_only_eur,
    price_with_materials_eur: input.price_with_materials_eur,
    availability_date: input.availability_date,
    notes: input.notes,
  });

  if (!parsed.success) {
    return { error: "Проверете ги внесените податоци." };
  }

  const { error } = await (supabase.from("bids") as any).insert({
    job_id: input.jobId,
    handyman_phone: parsed.data.handyman_phone,
    price_labor_only: parsed.data.price_labor_only,
    price_with_materials: parsed.data.price_with_materials ?? null,
    price_labor_only_eur: parsed.data.price_labor_only_eur ?? null,
    price_with_materials_eur: parsed.data.price_with_materials_eur ?? null,
    availability_date: parsed.data.availability_date,
    notes: parsed.data.notes ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/jobs/${input.jobId}`);
  return { success: true };
}
