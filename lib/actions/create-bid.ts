"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { bidSchema } from "@/lib/validations/bid-schema";

interface CreateBidInput {
  jobId: string;
  handyman_phone: string;
  price_labor_only: number;
  price_with_materials?: number | null;
  availability_date: string;
  notes?: string | null;
}

export async function createBid(input: CreateBidInput) {
  const supabase = await createClient();

  const parsed = bidSchema.safeParse({
    handyman_phone: input.handyman_phone,
    price_labor_only: input.price_labor_only,
    price_with_materials: input.price_with_materials,
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
    availability_date: parsed.data.availability_date,
    notes: parsed.data.notes ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/jobs/${input.jobId}`);
  return { success: true };
}
