import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { buildNyuEmail } from "@/lib/domain/otp";

type EmailDeliveryConfig =
  | {
      provider: "mailjet";
      from: string;
      apiKey: string;
      secretKey: string;
    }
  | {
      provider: "smtp";
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
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY,
    process.env.MAILJET_SENDER_ADDRESS
  ].some(Boolean);

  if (hasMailjetConfig) {
    const apiKey = process.env.MAILJET_API_KEY;
    const secretKey = process.env.MAILJET_SECRET_KEY;
    const from = process.env.MAILJET_SENDER_ADDRESS;

    if (!apiKey || !secretKey || !from) {
      throw new Error(
        "Mailjet email delivery requires MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_SENDER_ADDRESS."
      );
    }

    return {
      provider: "mailjet",
      from,
      apiKey,
      secretKey
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

async function sendWithMailjet(config: Extract<EmailDeliveryConfig, { provider: "mailjet" }>, to: string, code: string) {
  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.secretKey}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: config.from,
            Name: "Bid-NYUAD"
          },
          To: [{ Email: to }],
          Subject: "Your Bid-NYUAD verification code",
          TextPart: `Your Bid-NYUAD verification code is ${code}. It expires in 10 minutes.`
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Mailjet OTP email failed (${response.status}). ${details}`.trim());
  }
}

export async function sendNetIdOtp(netId: string, code: string) {
  const to = buildNyuEmail(netId);
  const deliveryConfig = getEmailDeliveryConfig();

  if (!deliveryConfig) {
    console.info(`[Bid-NYUAD dev OTP] ${to}: ${code}`);
    return { to, delivered: false, provider: "console" };
  }

  if (deliveryConfig.provider === "mailjet") {
    await sendWithMailjet(deliveryConfig, to, code);

    return { to, delivered: true, provider: deliveryConfig.provider };
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
