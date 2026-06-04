import { PostJobWizard } from "@/components/post-job/wizard-provider";

export default function PostJobPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Објави нова работа</h1>
      <PostJobWizard />
    </div>
  );
}
