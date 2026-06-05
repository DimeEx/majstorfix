"use server";

import { createClient } from "@/lib/supabase/server";

export async function getBidCounts(jobIds: string[]): Promise<Record<string, number>> {
  if (jobIds.length === 0) return {};

  const supabase = createClient();

  const { data: bids } = await supabase
    .from("bids")
    .select("job_id")
    .in("job_id", jobIds);

  if (!bids) return {};

  return bids.reduce<Record<string, number>>((acc, bid) => {
    acc[bid.job_id] = (acc[bid.job_id] ?? 0) + 1;
    return acc;
  }, {});
}
