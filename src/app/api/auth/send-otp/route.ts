import { NextResponse } from "next/server";
import { z } from "zod";
import { createOtpExpiry, normalizeNetId } from "@/lib/domain/otp";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, sendNetIdOtp } from "@/lib/server/otpService";

export const dynamic = "force-dynamic";

const schema = z.object({
  netId: z.string().min(2),
  uploadedIdRef: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const netId = normalizeNetId(parsed.data.netId);
  const code = generateOtp();
  const otpHash = await hashOtp(code);
  const delivery = await sendNetIdOtp(netId, code);

  const attempt = await prisma.verificationAttempt.create({
    data: {
      extractedNetId: netId,
      uploadedIdRef: parsed.data.uploadedIdRef,
      otpHash,
      expiresAt: createOtpExpiry()
    }
  });

  return NextResponse.json({
    attemptId: attempt.id,
    netId,
    to: delivery.to,
    delivered: delivery.delivered,
    provider: delivery.provider
  });
}
