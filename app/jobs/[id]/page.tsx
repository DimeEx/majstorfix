import { notFound } from "next/navigation";
import { MapPin, Clock, Building2, DollarSign, Hammer, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BidForm } from "@/components/bid/bid-form";
import { JobBadges } from "@/components/jobs/job-badges";
import type { Job } from "@/lib/supabase/types";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: jobRaw } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  const job = jobRaw as Job | null;

  if (!job) {
    notFound();
  }

  const urgencyLabel =
    job.urgency === "emergency" ? "Итно" :
    job.urgency === "few_days" ? "За 2-3 дена" :
    job.urgency === "flexible" ? "Флексибилно" :
    job.urgency_custom ?? job.urgency;

  const completionLabel =
    job.completion_time === "1-2_hours" ? "1-2 часа" :
    job.completion_time === "3-4_hours" ? "3-4 часа" :
    job.completion_time === "5-8_hours" ? "5-8 часа" :
    job.completion_time === "1-2_days" ? "1-2 дена" :
    job.completion_time === "3+_days" ? "3+ дена" :
    job.completion_time_custom ?? job.completion_time;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.city}{job.neighborhood ? `, ${job.neighborhood}` : ""}</span>
            </div>

            <p className="text-base leading-relaxed text-foreground">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <JobBadges
                propertyType={job.property_type}
                floor={job.floor}
                hasElevator={job.has_elevator}
                urgency={job.urgency}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>{job.budget_min.toLocaleString()} - {job.budget_max.toLocaleString()} {job.currency}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{urgencyLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{completionLabel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hammer className="h-4 w-4 shrink-0" />
                <span>
                  {job.material_status === "buyer_provides" ? "Купувачот обезбедува материјали" :
                   job.material_status === "handyman_provides" ? "Мајсторот обезбедува материјали" :
                   "Се договара"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>{job.is_occupied ? "Населено" : "Празно"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-6">
        <BidForm jobId={job.id} />
      </div>
    </div>
  );
}
