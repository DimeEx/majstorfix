import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Skeleton className="mb-6 h-4 w-16" />
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="border-border/50 bg-card rounded-xl border">
        <div className="space-y-4 p-6">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-52" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  );
}
