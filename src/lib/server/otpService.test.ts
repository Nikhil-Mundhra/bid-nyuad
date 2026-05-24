import { afterEach, describe, expect, it, vi } from "vitest";
import { getEmailDeliveryConfig } from "./otpService";

afterEach(() => {
  vi.unstubAllEnvs();
});

function clearMailjetConfig() {
  vi.stubEnv("MAILJET_SMTP_SERVER", "");
  vi.stubEnv("MAILJET_SMTP_PORT", "");
  vi.stubEnv("MAILJET_SMTP_PORT2", "");
  vi.stubEnv("MAILJET_API_KEY", "");
  vi.stubEnv("MAILJET_SECRET_KEY", "");
  vi.stubEnv("MAILJET_SENDER_ADDRESS", "");
}

describe("OTP email delivery configuration", () => {
  it("prefers Mailjet credentials when Mailjet is configured", () => {
    vi.stubEnv("MAILJET_SMTP_SERVER", "in-v3.mailjet.com");
    vi.stubEnv("MAILJET_SMTP_PORT", "587");
    vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
    vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
    vi.stubEnv("MAILJET_SENDER_ADDRESS", "verified@example.com");
    vi.stubEnv("SMTP_HOST", "fallback.example.com");

    expect(getEmailDeliveryConfig()).toEqual({
      provider: "mailjet",
      from: "verified@example.com",
      transport: {
        host: "in-v3.mailjet.com",
        port: 587,
        secure: false,
        auth: {
          user: "mailjet-api-key",
          pass: "mailjet-secret-key"
        }
      }
    });
  });

  it("uses SSL for Mailjet port 465", () => {
    vi.stubEnv("MAILJET_SMTP_SERVER", "in-v3.mailjet.com");
    vi.stubEnv("MAILJET_SMTP_PORT", "465");
    vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
    vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
    vi.stubEnv("MAILJET_SENDER_ADDRESS", "verified@example.com");

    expect(getEmailDeliveryConfig()?.transport.secure).toBe(true);
  });

  it("falls back to generic SMTP when Mailjet is not configured", () => {
    clearMailjetConfig();
    vi.stubEnv("SMTP_HOST", "smtp.example.com");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_FROM", "Bid-NYUAD <sender@example.com>");

    expect(getEmailDeliveryConfig()).toMatchObject({
      provider: "smtp",
      from: "Bid-NYUAD <sender@example.com>",
      transport: {
        host: "smtp.example.com",
        port: 587,
        secure: false
      }
    });
  });

  it("rejects incomplete Mailjet configuration", () => {
    clearMailjetConfig();
    vi.stubEnv("MAILJET_SMTP_SERVER", "in-v3.mailjet.com");

    expect(() => getEmailDeliveryConfig()).toThrow("Mailjet email delivery requires");
  });
});
