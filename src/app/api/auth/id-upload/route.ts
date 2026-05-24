import { NextResponse } from "next/server";
import { extractNetId } from "@/lib/server/ocrService";
import { uploadIdCardToSupabase } from "@/lib/server/supabaseStorage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let imageOrText: File | string = "";
    let uploadedIdRef: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("idCard");

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Upload an ID card image as idCard." }, { status: 400 });
      }

      const upload = await uploadIdCardToSupabase(file);
      uploadedIdRef = upload?.ref;
      imageOrText = file;
    } else {
      const body = await request.json();
      imageOrText = String(body.rawText ?? "");
    }

    const extraction = await extractNetId(imageOrText);

    return NextResponse.json({
      netId: extraction.netId,
      confidence: extraction.confidence,
      rawText: extraction.rawText,
      uploadedIdRef
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not extract NetID." },
      { status: 422 }
    );
  }
}
