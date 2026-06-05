"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useActiveBids(jobIds: string[]) {
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (jobIds.length === 0) return;

    const supabase = createClient();

    const channel = supabase
      .channel("bids-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bids",
          filter: `job_id=in.(${jobIds.map((id) => `"${id}"`).join(",")})`,
        },
        (payload) => {
          const newBid = payload.new as { job_id: string };
          setBidCounts((prev) => ({
            ...prev,
            [newBid.job_id]: (prev[newBid.job_id] ?? 0) + 1,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobIds]);

  const updateInitialCounts = (counts: Record<string, number>) => {
    setBidCounts(counts);
  };

  return { bidCounts, updateInitialCounts };
}
