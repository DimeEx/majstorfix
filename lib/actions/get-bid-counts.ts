"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_JOB_IDS = 100;

export async function getBidCounts(jobIds: string[]): Promise<Record<string, number>> {
  if (jobIds.length === 0) return {};

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {};
  }

  const safeIds = jobIds.slice(0, MAX_JOB_IDS);

  const { data: ownedJobs } = await supabase
    .from("jobs")
    .select("id")
    .in("id", safeIds)
    .eq("owner_id", userData.user.id);

  if (!ownedJobs || ownedJobs.length === 0) return {};

  const ownedIds = ownedJobs.map((j) => j.id);

  const { data: bids } = await supabase
    .from("bids")
    .select("job_id")
    .in("job_id", ownedIds);

  if (!bids) return {};

  return bids.reduce<Record<string, number>>((acc, bid) => {
    acc[bid.job_id] = (acc[bid.job_id] ?? 0) + 1;
    return acc;
  }, {});
}
