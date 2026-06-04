import { Suspense } from "react";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobCard } from "@/components/jobs/job-card";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; trade?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Активни работи</h1>
      <JobFilters />
      <Suspense fallback={<p className="text-muted-foreground">Вчитување...</p>}>
        <JobList city={params.city} />
      </Suspense>
    </div>
  );
}

async function JobList({ city }: { city?: string }) {
  const jobs: Array<{
    id: string;
    description: string;
    city: string;
    neighborhood: string;
    property_type: "house" | "apartment";
    floor: number | null;
    has_elevator: boolean;
    urgency: string;
    budget_min: number;
    budget_max: number;
    created_at: string;
  }> = [];

  if (jobs.length === 0) {
    return (
      <p className="mt-8 text-center text-muted-foreground">
        Моментално нема активни работи.
      </p>
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
