import { beforeEach, describe, expect, it, vi } from "vitest";
import { extractNetId } from "./ocrService";

const visionMocks = vi.hoisted(() => ({
  clientOptions: vi.fn(),
  documentTextDetection: vi.fn()
}));

vi.mock("@google-cloud/vision", () => ({
  ImageAnnotatorClient: class {
    documentTextDetection = visionMocks.documentTextDetection;

    constructor(options?: unknown) {
      visionMocks.clientOptions(options);
    }
  }
}));

describe("ocr service adapter", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    visionMocks.clientOptions.mockReset();
    visionMocks.documentTextDetection.mockReset();
  });

  it("extracts a NetID from OCR text", async () => {
    await expect(extractNetId("Name: Student\nNetID: nm1234\nNYUAD")).resolves.toMatchObject({
      netId: "nm1234"
    });
  });

  it("extracts a NetID from an uploaded image using inline Google Vision credentials", async () => {
    vi.stubEnv("MOCK_OCR_NET_ID", "");
    vi.stubEnv(
      "GOOGLE_CREDENTIALS_JSON",
      JSON.stringify({
        project_id: "bid-nyuad",
        client_email: "ocr-817@bid-nyuad.iam.gserviceaccount.com",
        private_key: "test-key"
      })
    );
    visionMocks.documentTextDetection.mockResolvedValue([
      {
        fullTextAnnotation: {
          text: "NYU Abu Dhabi\nNetID: abc123",
          pages: [{ confidence: 0.98 }]
        }
      }
    ]);

    await expect(extractNetId(new Blob(["image-bytes"]))).resolves.toEqual({
      netId: "abc123",
      confidence: 0.98,
      rawText: "NYU Abu Dhabi\nNetID: abc123"
    });
    expect(visionMocks.clientOptions).toHaveBeenCalledWith({
      credentials: {
        project_id: "bid-nyuad",
        client_email: "ocr-817@bid-nyuad.iam.gserviceaccount.com",
        private_key: "test-key"
      },
      projectId: "bid-nyuad"
    });
  });

  it("reports how to configure uploaded-image OCR when no provider is set", async () => {
    vi.stubEnv("GOOGLE_APPLICATION_CREDENTIALS", "");
    vi.stubEnv("GOOGLE_CREDENTIALS_JSON", "");
    vi.stubEnv("MOCK_OCR_NET_ID", "");

    await expect(extractNetId(new Blob(["image-bytes"]))).rejects.toThrow("GOOGLE_APPLICATION_CREDENTIALS");
  });
});
