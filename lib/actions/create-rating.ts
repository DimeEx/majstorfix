"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ratingSchema } from "@/lib/validations/rating-schema";

interface CreateRatingInput {
  bid_id: string;
  job_id: string;
  handyman_phone: string;
  rating: number;
  comment?: string;
}

export async function createRating(input: CreateRatingInput) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Мора да бидете најавени за да оцените." };
  }

  const parsed = ratingSchema.safeParse({
    bid_id: input.bid_id,
    job_id: input.job_id,
    handyman_phone: input.handyman_phone,
    rating: input.rating,
    comment: input.comment ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Проверете ги внесените податоци." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("ratings") as any).insert({
    bid_id: parsed.data.bid_id,
    job_id: parsed.data.job_id,
    reviewer_id: userData.user.id,
    handyman_phone: parsed.data.handyman_phone,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Веќе сте ја оцениле оваа понуда." };
    }
    return { error: error.message };
  }

  revalidatePath(`/jobs/${input.job_id}`);
  revalidatePath("/dashboard");
  return { success: true };
}
