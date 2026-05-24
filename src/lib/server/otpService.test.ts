import { afterEach, describe, expect, it, vi } from "vitest";
import { getEmailDeliveryConfig, sendNetIdOtp } from "./otpService";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function clearMailjetConfig() {
  vi.stubEnv("MAILJET_API_KEY", "");
  vi.stubEnv("MAILJET_SECRET_KEY", "");
  vi.stubEnv("MAILJET_SENDER_ADDRESS", "");
}

describe("OTP email delivery configuration", () => {
  it("prefers Mailjet credentials when Mailjet is configured", () => {
    vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
    vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
    vi.stubEnv("MAILJET_SENDER_ADDRESS", "verified@example.com");
    vi.stubEnv("SMTP_HOST", "fallback.example.com");

    expect(getEmailDeliveryConfig()).toEqual({
      provider: "mailjet",
      from: "verified@example.com",
      apiKey: "mailjet-api-key",
      secretKey: "mailjet-secret-key"
    });
  });

  it("sends Mailjet OTP messages through the Send API", async () => {
    vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");
    vi.stubEnv("MAILJET_SECRET_KEY", "mailjet-secret-key");
    vi.stubEnv("MAILJET_SENDER_ADDRESS", "verified@example.com");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendNetIdOtp("abc123", "123456")).resolves.toMatchObject({
      to: "abc123@nyu.edu",
      delivered: true,
      provider: "mailjet"
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.mailjet.com/v3.1/send");
    expect(options.headers.Authorization).toBe("Basic bWFpbGpldC1hcGkta2V5Om1haWxqZXQtc2VjcmV0LWtleQ==");
    expect(JSON.parse(options.body).Messages[0]).toMatchObject({
      From: { Email: "verified@example.com", Name: "Bid-NYUAD" },
      To: [{ Email: "abc123@nyu.edu" }],
      Subject: "Your Bid-NYUAD verification code"
    });
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
    vi.stubEnv("MAILJET_API_KEY", "mailjet-api-key");

    expect(() => getEmailDeliveryConfig()).toThrow("Mailjet email delivery requires");
  });
});
