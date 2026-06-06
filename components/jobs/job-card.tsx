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
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {job.description}
              </p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>
                  {job.city}
                  {job.neighborhood ? `, ${job.neighborhood}` : ""}
                </span>
              </div>
              <JobBadges
                propertyType={job.property_type}
                floor={job.floor}
                hasElevator={job.has_elevator}
                urgency={job.urgency}
                tradeType={job.trade_type}
              />
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold whitespace-nowrap">
                {job.budget_min.toLocaleString()} -{" "}
                {job.budget_max.toLocaleString()} {job.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
