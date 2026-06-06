import { Skeleton } from "@/components/ui/skeleton";

export default function EditJobLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Skeleton className="mb-6 h-4 w-16" />
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="border-border/50 bg-card space-y-4 rounded-2xl border p-6 sm:p-8">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
