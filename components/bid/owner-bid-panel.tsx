"use client";

import { useState, useMemo, useCallback } from "react";
import { Star, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { ContactButtons } from "@/components/dashboard/contact-buttons";
import { createRating } from "@/lib/actions/create-rating";
import type { Bid, Rating } from "@/lib/supabase/types";

interface OwnerBidPanelProps {
  jobId: string;
  bids: Bid[];
  existingRatings: Rating[];
  verifiedPhones: string[];
}

export function OwnerBidPanel({ jobId, bids, existingRatings, verifiedPhones }: OwnerBidPanelProps) {
  const ratingsMap = useMemo(() => {
    const map: Record<string, Rating> = {};
    for (const r of existingRatings) {
      map[r.bid_id] = r;
    }
    return map;
  }, [existingRatings]);
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleRate = useCallback(async (bid: Bid) => {
    const rating = ratingValues[bid.id];
    if (!rating) {
      toast.error("Изберете оценка од 1 до 5.");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [bid.id]: true }));
    try {
      const result = await createRating({
        bid_id: bid.id,
        job_id: jobId,
        handyman_phone: bid.handyman_phone,
        rating,
        comment: comments[bid.id] ?? undefined,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Оценката е зачувана!");
      setSubmitted((prev) => ({ ...prev, [bid.id]: true }));
    } catch {
      toast.error("Настана грешка. Обидете се повторно.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [bid.id]: false }));
    }
  }, [ratingValues, comments, jobId]);

  if (bids.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Понуди</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Сè уште нема понуди за оваа работа.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пристигнати понуди ({bids.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bids.map((bid) => {
          const existingRating = ratingsMap[bid.id];
          const isSubmitting = submitting[bid.id] ?? false;
          const isSubmitted = submitted[bid.id] || !!existingRating;

          const isVerified = verifiedPhones.includes(bid.handyman_phone);

          return (
            <div key={bid.id}>
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isVerified && (
                        <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                          <ShieldCheck className="h-3 w-3" />
                          Верификуван
                        </Badge>
                      )}
                      <span className="text-sm font-medium">Само работа:</span>
                      <span className="text-sm">{bid.price_labor_only.toLocaleString()} MKD</span>
                      {bid.price_labor_only_eur && (
                        <span className="text-xs text-muted-foreground">({bid.price_labor_only_eur} EUR)</span>
                      )}
                    </div>
                    {bid.price_with_materials && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Со материјали:</span>
                        <span className="text-sm">{bid.price_with_materials.toLocaleString()} MKD</span>
                        {bid.price_with_materials_eur && (
                          <span className="text-xs text-muted-foreground">({bid.price_with_materials_eur} EUR)</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Достапен од: {bid.availability_date}</span>
                    </div>
                    {bid.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        &ldquo;{bid.notes}&rdquo;
                      </p>
                    )}
                  </div>
                  <ContactButtons phone={bid.handyman_phone} jobId={jobId} />
                </div>

                {isSubmitted && existingRating ? (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <StarRating value={existingRating.rating} readOnly size={16} />
                    {existingRating.comment && (
                      <span className="text-xs text-muted-foreground">&ldquo;{existingRating.comment}&rdquo;</span>
                    )}
                    <span className="text-xs text-muted-foreground">Оценето</span>
                  </div>
                ) : isSubmitted ? (
                  <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Оценката е зачувана</span>
                  </div>
                ) : (
                  <div className="space-y-2 rounded-lg bg-muted/20 p-3">
                    <StarRating
                      value={ratingValues[bid.id] ?? 0}
                      onChange={(v) => setRatingValues((prev) => ({ ...prev, [bid.id]: v }))}
                    />
                    <Textarea
                      placeholder="Коментар (опционално)"
                      className="min-h-[60px] text-sm"
                      value={comments[bid.id] ?? ""}
                      onChange={(e) => setComments((prev) => ({ ...prev, [bid.id]: e.target.value }))}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleRate(bid)}
                      disabled={!ratingValues[bid.id] || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Зачувување...
                        </>
                      ) : (
                        <>
                          <Star className="mr-1 h-3 w-3" />
                          Оцени
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <Separator className="mt-4" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
