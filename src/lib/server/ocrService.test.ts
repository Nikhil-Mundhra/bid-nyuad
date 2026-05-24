import { describe, expect, it } from "vitest";
import { extractNetId } from "./ocrService";

describe("ocr service adapter", () => {
  it("extracts a NetID from OCR text", async () => {
    await expect(extractNetId("Name: Student\nNetID: nm1234\nNYUAD")).resolves.toMatchObject({
      netId: "nm1234"
    });
  });
});
