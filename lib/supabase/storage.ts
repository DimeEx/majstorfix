import { createClient } from "./client";

const BUCKET = "job-images";

export async function uploadJobImages(
  files: File[],
  jobId?: string
): Promise<string[]> {
  if (files.length === 0) return [];

  const supabase = createClient();
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${jobId ?? "temp"}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error.message);
      continue;
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    urls.push(publicUrl.publicUrl);
  }

  return urls;
}
