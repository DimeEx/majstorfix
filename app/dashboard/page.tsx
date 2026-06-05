import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadTracker } from "@/components/dashboard/lead-tracker";
import type { Job, Bid } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const { data: jobsRaw } = await supabase
    .from("jobs")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const jobs = jobsRaw as Job[] | null;
  const jobIds = (jobs ?? []).map((j) => j.id);

  let initialBidCounts: Record<string, number> = {};
  if (jobIds.length > 0) {
    const { data: bidsRaw } = await (supabase
      .from("bids") as any)
      .select("job_id")
      .in("job_id", jobIds);

    const bids = bidsRaw as Pick<Bid, "job_id">[] | null;
    initialBidCounts = (bids ?? []).reduce<Record<string, number>>((acc, bid) => {
      acc[bid.job_id] = (acc[bid.job_id] ?? 0) + 1;
      return acc;
    }, {});
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Моите работи</h1>
      <LeadTracker jobs={jobs ?? []} initialBidCounts={initialBidCounts} />
    </div>
  );
}
