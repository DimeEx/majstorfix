import { createClient } from "./client";

const BUCKET = "job-images";
const STORAGE_URL_PATTERN = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)/;

function isSupabaseStorageUrl(url: string): RegExpMatchArray | null {
  return url.match(STORAGE_URL_PATTERN);
}

export function getOptimizedImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  const match = isSupabaseStorageUrl(url);
  if (!match) return url;

  const params = new URLSearchParams();

  if (options.width) params.set("width", String(options.width));
  if (options.height) params.set("height", String(options.height));
  if (options.quality) params.set("quality", String(options.quality));

  const baseUrl = url.replace(
    /\/storage\/v1\/object\/public\//,
    "/storage/v1/render/image/public/"
  );

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, { width: 400, height: 300, quality: 80 });
}

export function getLightboxUrl(url: string): string {
  return getOptimizedImageUrl(url, { width: 1200, quality: 85 });
}

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
      throw new Error(`Грешка при прикачување на слика: ${error.message}`);
    }

    const { data: publicUrl } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    urls.push(publicUrl.publicUrl);
  }

  return urls;
}
