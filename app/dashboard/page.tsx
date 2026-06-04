import { LeadTracker } from "@/components/dashboard/lead-tracker";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Моите работи</h1>
      <LeadTracker />
    </div>
  );
}
