export type OcrExtraction = {
  netId: string;
  confidence: number;
  rawText: string;
};

const NET_ID_PATTERN = /\b[a-z]{2,4}\d{1,6}\b/i;

export async function extractNetId(image: File | Blob | string): Promise<OcrExtraction> {
  if (typeof image === "string") {
    const match = image.match(NET_ID_PATTERN);

    if (match) {
      return {
        netId: match[0].toLowerCase(),
        confidence: 0.9,
        rawText: image
      };
    }
  }

  const mockNetId = process.env.MOCK_OCR_NET_ID;

  if (mockNetId) {
    return {
      netId: mockNetId.toLowerCase(),
      confidence: 0.75,
      rawText: "MOCK_OCR_NET_ID"
    };
  }

  throw new Error("OCR provider is not configured. Set MOCK_OCR_NET_ID for local development.");
}
