import { notFound } from "next/navigation";
import { BidForm } from "@/components/bid/bid-form";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = null;

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Детали за работа</h1>
        <p className="mt-2 text-muted-foreground">ID: {id}</p>
      </div>
      <BidForm jobId={id} />
    </div>
  );
}
