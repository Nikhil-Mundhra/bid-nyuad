import { randomUUID } from "node:crypto";

type UploadResult = {
  ref: string;
  path: string;
  bucket: string;
};

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function getIdUploadBucket() {
  return process.env.SUPABASE_ID_UPLOAD_BUCKET || "nyuad-id-uploads";
}

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();

  if (fromName && fromName.length <= 8) {
    return fromName.toLowerCase();
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export function isSupabaseStorageConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

export async function uploadIdCardToSupabase(file: File): Promise<UploadResult | null> {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  const bucket = getIdUploadBucket();
  const path = `id-cards/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extensionFor(file)}`;
  const uploadUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false"
    },
    body: Buffer.from(await file.arrayBuffer())
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Supabase Storage upload failed (${response.status}). ${details}`.trim());
  }

  return {
    ref: `supabase://${bucket}/${path}`,
    path,
    bucket
  };
}
