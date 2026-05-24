import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { buildNyuEmail } from "@/lib/domain/otp";

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtpHash(otp: string, otpHash: string) {
  return bcrypt.compare(otp, otpHash);
}

export async function sendNetIdOtp(netId: string, code: string) {
  const to = buildNyuEmail(netId);

  if (!process.env.SMTP_HOST) {
    console.info(`[Bid-NYUAD dev OTP] ${to}: ${code}`);
    return { to, delivered: false, provider: "console" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
  });

  await transporter.sendMail({
    to,
    from: process.env.SMTP_FROM ?? "Bid-NYUAD <no-reply@bid-nyuad.local>",
    subject: "Your Bid-NYUAD verification code",
    text: `Your Bid-NYUAD verification code is ${code}. It expires in 10 minutes.`
  });

  return { to, delivered: true, provider: "smtp" };
}
