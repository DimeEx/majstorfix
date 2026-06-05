"use client";

import { useEffect, useState, useRef } from "react";
import { getBidCounts } from "@/lib/actions/get-bid-counts";

const POLL_INTERVAL_MS = 30_000;

export function useActiveBids(jobIds: string[]) {
  const [bidCounts, setBidCounts] = useState<Record<string, number>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const jobIdsKey = JSON.stringify(jobIds);

  useEffect(() => {
    if (jobIds.length === 0) return;

    const poll = async () => {
      const counts = await getBidCounts(jobIds);
      setBidCounts(counts);
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobIdsKey]);

  const updateInitialCounts = (counts: Record<string, number>) => {
    setBidCounts(counts);
  };

  return { bidCounts, updateInitialCounts };
}
