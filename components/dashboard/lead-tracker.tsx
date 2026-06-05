"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActiveBids } from "@/hooks/use-active-bids";
import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import type { Job } from "@/lib/supabase/types";

interface LeadTrackerProps {
  jobs: Job[];
  initialBidCounts: Record<string, number>;
}

export function LeadTracker({ jobs, initialBidCounts }: LeadTrackerProps) {
  const jobIds = jobs.map((j) => j.id);
  const { bidCounts, updateInitialCounts } = useActiveBids(jobIds);

  useEffect(() => {
    updateInitialCounts(initialBidCounts);
  }, [initialBidCounts, updateInitialCounts]);

  if (jobs.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Вашите објави</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Сè уште немате објавено работа.{" "}
              <Link href="/post-job" className="underline underline-offset-4 hover:text-primary">
                Објавете ја вашата прва работа
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const count = bidCounts[job.id] ?? 0;
        return (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">
                  <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                    {job.city}{job.neighborhood ? `, ${job.neighborhood}` : ""}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-2 shrink-0">
                  {count > 0 && (
                    <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                      {count} понуда{count !== 1 ? "и" : ""}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {job.budget_min.toLocaleString()} - {job.budget_max.toLocaleString()} {job.currency}
                  </Badge>
                  <DeleteJobButton jobId={job.id} variant="outline" size="icon-sm" className="text-muted-foreground hover:text-destructive" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
                {job.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
