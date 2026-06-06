import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Building2,
  DollarSign,
  Hammer,
  Calendar,
  Pencil,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BidForm } from "@/components/bid/bid-form";
import { OwnerBidPanel } from "@/components/bid/owner-bid-panel";
import { JobBadges } from "@/components/jobs/job-badges";
import { ImageGallery } from "@/components/jobs/image-gallery";
import { DeleteJobButton } from "@/components/jobs/delete-job-button";
import type { Job, Bid, Rating, VerifiedHandyman } from "@/lib/supabase/types";

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

  const { data: userData } = await supabase.auth.getUser();
  const isOwner = userData.user !== null && job.owner_id === userData.user.id;

  let bids: Bid[] = [];
  let ratings: Rating[] = [];

  if (isOwner) {
    const { data: bidsRaw } = await supabase
      .from("bids")
      .select("*")
      .eq("job_id", id)
      .order("created_at", { ascending: false });

    bids = (bidsRaw as Bid[]) ?? [];

    if (bids.length > 0) {
      const bidIds = bids.map((b) => b.id);
      const { data: ratingsRaw } = await (supabase.from("ratings") as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select("*")
        .in("bid_id", bidIds);

      ratings = (ratingsRaw as Rating[]) ?? [];
    }
  }

  let verifiedPhones: string[] = [];
  if (isOwner || !isOwner) {
    const { data: verifiedRaw } = await supabase
      .from("verified_handymen")
      .select("phone");

    verifiedPhones = ((verifiedRaw as VerifiedHandyman[]) ?? []).map(
      (v) => v.phone,
    );
  }

  const urgencyLabel =
    job.urgency === "emergency"
      ? "Итно"
      : job.urgency === "few_days"
        ? "За 2-3 дена"
        : job.urgency === "flexible"
          ? "Флексибилно"
          : (job.urgency_custom ?? job.urgency);

  const completionLabel =
    job.completion_time === "1-2_hours"
      ? "1-2 часа"
      : job.completion_time === "3-4_hours"
        ? "3-4 часа"
        : job.completion_time === "5-8_hours"
          ? "5-8 часа"
          : job.completion_time === "1-2_days"
            ? "1-2 дена"
            : job.completion_time === "3+_days"
              ? "3+ дена"
              : (job.completion_time_custom ?? job.completion_time);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>
                  {job.city}
                  {job.neighborhood ? `, ${job.neighborhood}` : ""}
                </span>
              </div>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted inline-flex h-7 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors"
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Уреди
                  </Link>
                  <DeleteJobButton
                    jobId={job.id}
                    redirectTo="/dashboard"
                    variant="outline"
                    size="sm"
                  />
                </div>
              )}
            </div>

            <p className="text-foreground text-base leading-relaxed">
              {job.description}
            </p>

            {job.image_urls.length > 0 && (
              <ImageGallery images={job.image_urls} />
            )}

            <div className="flex flex-wrap gap-2">
              <JobBadges
                propertyType={job.property_type}
                floor={job.floor}
                hasElevator={job.has_elevator}
                urgency={job.urgency}
                tradeType={job.trade_type}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>
                  {job.budget_min.toLocaleString()} -{" "}
                  {job.budget_max.toLocaleString()} {job.currency}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{urgencyLabel}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{completionLabel}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Hammer className="h-4 w-4 shrink-0" />
                <span>
                  {job.material_status === "buyer_provides"
                    ? "Купувачот обезбедува материјали"
                    : job.material_status === "handyman_provides"
                      ? "Мајсторот обезбедува материјали"
                      : "Се договара"}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>{job.is_occupied ? "Населено" : "Празно"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border/50 border-t pt-6">
        {isOwner ? (
          <OwnerBidPanel
            jobId={job.id}
            bids={bids}
            existingRatings={ratings}
            verifiedPhones={verifiedPhones}
          />
        ) : (
          <BidForm jobId={job.id} />
        )}
      </div>
    </div>
  );
}
