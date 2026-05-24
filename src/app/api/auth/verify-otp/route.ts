import { NextResponse } from "next/server";
import { z } from "zod";
import { buildNyuEmail, hasOtpAttemptsRemaining, isOtpExpired, normalizeNetId } from "@/lib/domain/otp";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/server/auth";
import { verifyOtpHash } from "@/lib/server/otpService";

export const dynamic = "force-dynamic";

const schema = z.object({
  attemptId: z.string().min(1),
  netId: z.string().min(2),
  otp: z.string().length(6)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const netId = normalizeNetId(parsed.data.netId);
  const attempt = await prisma.verificationAttempt.findUnique({
    where: { id: parsed.data.attemptId }
  });

  if (!attempt || attempt.extractedNetId !== netId) {
    return NextResponse.json({ error: "Verification attempt not found." }, { status: 404 });
  }

  if (isOtpExpired(attempt.expiresAt)) {
    return NextResponse.json({ error: "OTP has expired." }, { status: 410 });
  }

  if (!hasOtpAttemptsRemaining(attempt.attemptCount)) {
    return NextResponse.json({ error: "Too many OTP attempts." }, { status: 429 });
  }

  await prisma.verificationAttempt.update({
    where: { id: attempt.id },
    data: { attemptCount: { increment: 1 } }
  });

  const valid = await verifyOtpHash(parsed.data.otp, attempt.otpHash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
  }

  const user = await prisma.user.upsert({
    where: { netId },
    update: {
      email: buildNyuEmail(netId),
      verificationStatus: "VERIFIED"
    },
    create: {
      netId,
      email: buildNyuEmail(netId),
      verificationStatus: "VERIFIED"
    }
  });

  await prisma.verificationAttempt.update({
    where: { id: attempt.id },
    data: {
      status: "VERIFIED",
      userId: user.id
    }
  });

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      netId: user.netId,
      email: user.email,
      whatsappNumber: user.whatsappNumber
    }
  });
}
