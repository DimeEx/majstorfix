import { Badge } from "@/components/ui/badge";
import type { TradeType } from "@/lib/supabase/types";

interface JobBadgesProps {
  propertyType: "house" | "apartment";
  floor: number | null;
  hasElevator: boolean;
  urgency: string;
  tradeType?: TradeType;
}

const tradeLabels: Record<TradeType, string> = {
  plumbing: "Водовод",
  electrical: "Струја",
  painting: "Молер / Фарбање",
  drywall: "Гипсар",
  tiling: "Плочки",
  flooring: "Паркет / Подови",
  carpentry: "Столарија",
  hvac: "Греење / Клима",
  construction: "Градежништво",
  other: "Друго",
};

export function JobBadges({ propertyType, floor, hasElevator, urgency, tradeType }: JobBadgesProps) {
  const urgencyColor = {
    emergency: "destructive" as const,
    few_days: "secondary" as const,
    flexible: "outline" as const,
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {tradeType && (
        <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
          {tradeLabels[tradeType]}
        </Badge>
      )}
      <Badge variant="outline">
        {propertyType === "house" ? "Куќа" : "Стан"}
        {floor !== null && ` - ${floor}. кат${!hasElevator ? " (без лифт)" : ""}`}
      </Badge>
      <Badge variant={urgencyColor[urgency as keyof typeof urgencyColor]}>
        {urgency === "emergency" ? "Итно" : urgency === "few_days" ? "2-3 дена" : "Флексибилно"}
      </Badge>
    </div>
  );
}
