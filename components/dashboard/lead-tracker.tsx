import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactButtons } from "./contact-buttons";

export function LeadTracker() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Вашите објави</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Сè уште немате објавено работа.{" "}
            <a href="/post-job" className="underline underline-offset-4 hover:text-primary">
              Објавете ја вашата прва работа
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
