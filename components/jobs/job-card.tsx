import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { JobBadges } from "./job-badges";
import type { Job } from "@/lib/supabase/types";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {job.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{job.city}{job.neighborhood ? `, ${job.neighborhood}` : ""}</span>
              </div>
              <JobBadges
                propertyType={job.property_type}
                floor={job.floor}
                hasElevator={job.has_elevator}
                urgency={job.urgency}
              />
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold whitespace-nowrap">
                {job.budget_min.toLocaleString()} - {job.budget_max.toLocaleString()} {job.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
