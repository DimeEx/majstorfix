import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactButtonsProps {
  phone: string;
  jobId: string;
}

export function ContactButtons({ phone, jobId }: ContactButtonsProps) {
  const viberDeepLink = `viber://forward?text=${encodeURIComponent(
    `Здраво, ја контактирам во врска со работата (ID: ${jobId}) од MajstorFix.`
  )}`;

  return (
    <div className="flex gap-2">
      <a href={`tel:${phone}`}>
        <Button variant="outline" size="sm" type="button">
          <Phone className="h-4 w-4" />
          Повикај
        </Button>
      </a>
      <a href={viberDeepLink} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" type="button">
          <MessageCircle className="h-4 w-4" />
          Viber
        </Button>
      </a>
    </div>
  );
}
