import { ImageAnnotatorClient } from "@google-cloud/vision";

export type OcrExtraction = {
  netId: string;
  confidence: number;
  rawText: string;
};

const NET_ID_PATTERN = /\b[a-z]{2,4}\d{1,6}\b/i;

type GoogleCredentials = {
  client_email?: string;
  private_key?: string;
  project_id?: string;
};

function getVisionClient() {
  const inlineCredentials = process.env.GOOGLE_CREDENTIALS_JSON;

  if (inlineCredentials) {
    let credentials: GoogleCredentials;

    try {
      credentials = JSON.parse(inlineCredentials) as GoogleCredentials;
    } catch {
      throw new Error("GOOGLE_CREDENTIALS_JSON must contain valid service-account JSON.");
    }

    if (!credentials.client_email || !credentials.private_key) {
      throw new Error("GOOGLE_CREDENTIALS_JSON must contain service-account client_email and private_key.");
    }

    return new ImageAnnotatorClient({
      credentials,
      projectId: credentials.project_id
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new ImageAnnotatorClient();
  }

  return null;
}

function averagePageConfidence(pages: Array<{ confidence?: number | null }> | null | undefined) {
  const confidences = pages?.map((page) => page.confidence).filter((value): value is number => value != null) ?? [];

  if (!confidences.length) {
    return 0;
  }

  return confidences.reduce((total, confidence) => total + confidence, 0) / confidences.length;
}

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

  if (typeof image === "string") {
    throw new Error("No NetID was found in the provided OCR source text.");
  }

  const client = getVisionClient();

  if (!client) {
    throw new Error(
      "OCR provider is not configured. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CREDENTIALS_JSON, or set MOCK_OCR_NET_ID for local development."
    );
  }

  const [response] = await client.documentTextDetection(Buffer.from(await image.arrayBuffer()));
  const rawText = response.fullTextAnnotation?.text ?? response.textAnnotations?.[0]?.description ?? "";
  const match = rawText.match(NET_ID_PATTERN);

  if (!match) {
    throw new Error("OCR completed, but no NetID was found in the uploaded image.");
  }

  return {
    netId: match[0].toLowerCase(),
    confidence: averagePageConfidence(response.fullTextAnnotation?.pages),
    rawText
  };
}
