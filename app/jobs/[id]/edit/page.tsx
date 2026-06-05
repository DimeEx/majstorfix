import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EditJobForm } from "@/components/jobs/edit-job-form";
import type { Job } from "@/lib/supabase/types";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    redirect("/auth/login");
  }

  const { data: jobRaw } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  const job = jobRaw as Job | null;

  if (!job) {
    notFound();
  }

  if (job.owner_id !== userData.user.id) {
    redirect(`/jobs/${id}`);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/jobs/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад кон огласот
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Уреди работа</h1>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm shadow-border/50 p-6 sm:p-8">
        <EditJobForm job={job} />
      </div>
    </div>
  );
}
