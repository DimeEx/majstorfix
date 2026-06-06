import { Skeleton } from "@/components/ui/skeleton";

export default function PostJobLoading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-56" />
      <div className="relative mb-10">
        <div className="flex justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="hidden h-3 w-28 sm:block" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-border/50 bg-card space-y-4 rounded-2xl border p-6 sm:p-8">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
