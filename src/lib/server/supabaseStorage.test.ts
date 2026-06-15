import { afterEach, describe, expect, it, vi } from "vitest";
import { isSupabaseStorageConfigured, uploadIdCardToSupabase } from "./supabaseStorage";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("isSupabaseStorageConfigured", () => {
  it("returns false when configuration is missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(isSupabaseStorageConfigured()).toBe(false);
  });

  it("returns true when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set", () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "some-service-key");
    expect(isSupabaseStorageConfigured()).toBe(true);
  });

  it("returns true when NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://public.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "some-service-key");
    expect(isSupabaseStorageConfigured()).toBe(true);
  });
});

describe("uploadIdCardToSupabase", () => {
  const createMockFile = (name: string, type: string) => {
    return new File(["test data"], name, { type });
  };

  it("returns null if Supabase is not configured", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");

    const file = createMockFile("test.png", "image/png");
    const result = await uploadIdCardToSupabase(file);
    expect(result).toBeNull();
  });

  it("uploads a file and returns the result", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");
    vi.stubEnv("SUPABASE_ID_UPLOAD_BUCKET", "custom-bucket");

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const file = createMockFile("test.png", "image/png");
    const result = await uploadIdCardToSupabase(file);

    expect(result).not.toBeNull();
    expect(result?.bucket).toBe("custom-bucket");
    expect(result?.path).toMatch(/^id-cards\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]+\.png$/);
    expect(result?.ref).toMatch(/^supabase:\/\/custom-bucket\/id-cards\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]+\.png$/);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/^https:\/\/example\.supabase\.co\/storage\/v1\/object\/custom-bucket\/id-cards\/\d{4}-\d{2}-\d{2}\/[0-9a-f-]+\.png$/);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer service-key");
    expect(options.headers.apikey).toBe("service-key");
    expect(options.headers["Content-Type"]).toBe("image/png");
    expect(options.headers["x-upsert"]).toBe("false");
  });

  it("infers extension from MIME type if filename has no extension", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co/"); // with trailing slash
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const file = createMockFile("blob-without-extension", "image/webp");
    const result = await uploadIdCardToSupabase(file);

    expect(result?.path).toMatch(/\.webp$/);
  });

  it("defaults to jpg if MIME type is unknown and no extension", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const file = createMockFile("blob-without-extension", "application/octet-stream");
    const result = await uploadIdCardToSupabase(file);

    expect(result?.path).toMatch(/\.jpg$/);
  });

  it("throws an error if the upload fails", async () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      text: vi.fn().mockResolvedValue("Forbidden")
    });
    vi.stubGlobal("fetch", fetchMock);

    const file = createMockFile("test.png", "image/png");

    await expect(uploadIdCardToSupabase(file)).rejects.toThrow("Supabase Storage upload failed (403). Forbidden");
  });
});
