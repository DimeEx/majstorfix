"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/supabase/types";

export async function deleteJob(jobId: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return { error: "Мора да бидете најавени за да избришете работа." };
  }

  const { data: jobRaw } = await supabase
    .from("jobs")
    .select("owner_id, image_urls")
    .eq("id", jobId)
    .single();

  const job = jobRaw as Pick<Job, "owner_id" | "image_urls"> | null;

  if (!job) {
    return { error: "Работата не е пронајдена." };
  }

  if (job.owner_id !== userData.user.id) {
    return { error: "Можете да избришете само ваша работа." };
  }

  const imageUrls: string[] = job.image_urls ?? [];
  const BUCKET = "job-images";
  const STORAGE_URL_PATTERN = /\/storage\/v1\/object\/public\/job-images\/(.+)/;

  for (const url of imageUrls) {
    const match = url.match(STORAGE_URL_PATTERN);
    if (match) {
      const filePath = match[1];
      await supabase.storage.from(BUCKET).remove([filePath]);
    }
  }

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/jobs");
  return { success: true };
}
