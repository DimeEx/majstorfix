import { Suspense } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { tradeTypeEnum } from "@/lib/validations/job-schema";
import type { Job } from "@/lib/supabase/types";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; trade?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <Briefcase className="text-primary h-4 w-4" />
          </div>
          <h1 className="font-heading text-2xl tracking-tight">
            Активни работи
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-11 text-sm">
          Прегледај ги моментално достапните работи во твојот град
        </p>
      </div>
      <Suspense fallback={<JobFiltersSkeleton />}>
        <JobFilters />
      </Suspense>
      <Suspense
        fallback={
          <div className="mt-4 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-border/50 bg-card rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 w-full animate-pulse rounded" />
                    <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-32 animate-pulse rounded" />
                    <div className="mt-2 flex gap-1.5">
                      <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                      <div className="bg-muted h-5 w-20 animate-pulse rounded-full" />
                      <div className="bg-muted h-5 w-14 animate-pulse rounded-full" />
                    </div>
                  </div>
                  <div className="bg-muted h-5 w-28 shrink-0 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <JobList city={params.city} trade={params.trade} />
      </Suspense>
    </div>
  );
}

function JobFiltersSkeleton() {
  return (
    <div className="mb-6 flex gap-2">
      <div className="bg-muted h-9 w-32 animate-pulse rounded-lg" />
      <div className="bg-muted h-9 w-40 animate-pulse rounded-lg" />
    </div>
  );
}

async function JobList({ city, trade }: { city?: string; trade?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (city) {
    query = query.eq("city", city);
  }

  const parsedTrade = trade ? tradeTypeEnum.safeParse(trade) : null;
  if (parsedTrade?.success) {
    query = query.eq("trade_type", parsedTrade.data);
  }

  const { data: jobsRaw } = await query;
  const jobs = jobsRaw as Job[] | null;

  if (!jobs || jobs.length === 0) {
    return (
      <div className="border-border/50 bg-card/50 mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-16">
        <Briefcase className="text-muted-foreground/50 mb-3 h-8 w-8" />
        <p className="text-muted-foreground text-center">
          Моментално нема активни работи.
        </p>
        <p className="text-muted-foreground/70 mt-1 text-center text-sm">
          Објави нова работа за да добиеш понуди од мајстори.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
