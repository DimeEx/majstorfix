import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Calendar, Briefcase, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const createdDate = new Date(user.created_at).toLocaleDateString("mk-MK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Мој профил</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Податоци за корисник</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="text-muted-foreground h-4 w-4 shrink-0" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
            <span>Регистриран на {createdDate}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full">
            <Briefcase className="h-4 w-4" />
            Моите објави
          </Button>
        </Link>
      </div>
    </div>
  );
}
