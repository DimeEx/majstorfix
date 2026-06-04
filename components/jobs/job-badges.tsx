import { Badge } from "@/components/ui/badge";

interface JobBadgesProps {
  propertyType: "house" | "apartment";
  floor: number | null;
  hasElevator: boolean;
  urgency: string;
}

export function JobBadges({ propertyType, floor, hasElevator, urgency }: JobBadgesProps) {
  const urgencyColor = {
    emergency: "destructive" as const,
    few_days: "secondary" as const,
    flexible: "outline" as const,
  };

  return (
    <div className="flex flex-wrap gap-1.5">
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
