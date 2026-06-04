"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const cities = ["Скопје", "Битола", "Охрид", "Тетово", "Прилеп", "Куманово", "Струмица", "Велес"];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Select value={searchParams.get("city") ?? ""} onValueChange={(v) => setFilter("city", v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Град" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Сите градови</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
