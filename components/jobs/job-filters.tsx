"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MACEDONIAN_CITIES } from "@/lib/constants";

const cities = [...MACEDONIAN_CITIES].sort((a, b) => a.localeCompare(b));

const tradeTypes = [
  { value: "plumbing", label: "Водовод" },
  { value: "electrical", label: "Струја" },
  { value: "painting", label: "Молер / Фарбање" },
  { value: "drywall", label: "Гипсар" },
  { value: "tiling", label: "Плочки" },
  { value: "flooring", label: "Паркет / Подови" },
  { value: "carpentry", label: "Столарија" },
  { value: "hvac", label: "Греење / Клима" },
  { value: "construction", label: "Градежништво" },
  { value: "other", label: "Друго" },
];

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

  const selectedTrade = searchParams.get("trade");
  const selectedTradeLabel = selectedTrade
    ? (tradeTypes.find((t) => t.value === selectedTrade)?.label ?? null)
    : null;

  return (
    <div className="flex gap-2">
      <Select
        value={searchParams.get("city") ?? ""}
        onValueChange={(v) => setFilter("city", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Град" />
        </SelectTrigger>
        <SelectContent side="bottom" className="max-h-[380px]">
          <SelectItem value="">Сите градови</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={selectedTrade ?? ""}
        onValueChange={(v) => setFilter("trade", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Категорија">
            {selectedTradeLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Сите категории</SelectItem>
          {tradeTypes.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
