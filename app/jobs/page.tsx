import { Suspense } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-heading text-2xl tracking-tight">Активни работи</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground ml-11">
          Прегледај ги моментално достапните работи во твојот град
        </p>
      </div>
      <JobFilters />
      <Suspense
        fallback={
          <div className="mt-6 flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Вчитување...</p>
          </div>
        }
      >
        <JobList city={params.city} />
      </Suspense>
    </div>
  );
}

async function JobList({ city }: { city?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (city) {
    query = query.eq("city", city);
  }

  const { data: jobsRaw } = await query;
  const jobs = jobsRaw as Job[] | null;

  if (!jobs || jobs.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/50 py-16 px-4">
        <Briefcase className="h-8 w-8 text-muted-foreground/50 mb-3" />
        <p className="text-center text-muted-foreground">
          Моментално нема активни работи.
        </p>
        <p className="text-center text-sm text-muted-foreground/70 mt-1">
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
