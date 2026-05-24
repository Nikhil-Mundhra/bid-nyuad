import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { buildNyuEmail } from "@/lib/domain/otp";

type EmailDeliveryConfig = {
  provider: "mailjet" | "smtp";
  from: string;
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  };
};

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtpHash(otp: string, otpHash: string) {
  return bcrypt.compare(otp, otpHash);
}

function parsePort(rawPort: string | undefined, fallback: number) {
  const port = Number(rawPort ?? fallback);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Email SMTP port must be a positive integer.");
  }

  return port;
}

export function getEmailDeliveryConfig(): EmailDeliveryConfig | null {
  const hasMailjetConfig = [
    process.env.MAILJET_SMTP_SERVER,
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY,
    process.env.MAILJET_SENDER_ADDRESS
  ].some(Boolean);

  if (hasMailjetConfig) {
    const host = process.env.MAILJET_SMTP_SERVER;
    const user = process.env.MAILJET_API_KEY;
    const pass = process.env.MAILJET_SECRET_KEY;
    const from = process.env.MAILJET_SENDER_ADDRESS;

    if (!host || !user || !pass || !from) {
      throw new Error(
        "Mailjet email delivery requires MAILJET_SMTP_SERVER, MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_SENDER_ADDRESS."
      );
    }

    const port = parsePort(process.env.MAILJET_SMTP_PORT || process.env.MAILJET_SMTP_PORT2, 587);

    return {
      provider: "mailjet",
      from,
      transport: {
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      }
    };
  }

  if (!process.env.SMTP_HOST) {
    return null;
  }

  const port = parsePort(process.env.SMTP_PORT, 587);

  return {
    provider: "smtp",
    from: process.env.SMTP_FROM ?? "Bid-NYUAD <no-reply@bid-nyuad.local>",
    transport: {
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          : undefined
    }
  };
}

export async function sendNetIdOtp(netId: string, code: string) {
  const to = buildNyuEmail(netId);
  const deliveryConfig = getEmailDeliveryConfig();

  if (!deliveryConfig) {
    console.info(`[Bid-NYUAD dev OTP] ${to}: ${code}`);
    return { to, delivered: false, provider: "console" };
  }

  const transporter = nodemailer.createTransport(deliveryConfig.transport);

  await transporter.sendMail({
    to,
    from: deliveryConfig.from,
    subject: "Your Bid-NYUAD verification code",
    text: `Your Bid-NYUAD verification code is ${code}. It expires in 10 minutes.`
  });

  return { to, delivered: true, provider: deliveryConfig.provider };
}
