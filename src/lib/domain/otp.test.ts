import { describe, expect, it } from "vitest";
import { buildNyuEmail, hasOtpAttemptsRemaining, isOtpExpired } from "./otp";

describe("otp domain", () => {
  it("targets the NYU email address for a NetID", () => {
    expect(buildNyuEmail(" AbC123 ")).toBe("abc123@nyu.edu");
  });

  it("detects expired OTP attempts", () => {
    expect(isOtpExpired(new Date("2026-05-24T10:00:00.000Z"), new Date("2026-05-24T10:00:01.000Z"))).toBe(true);
  });

  it("enforces retry limit", () => {
    expect(hasOtpAttemptsRemaining(4)).toBe(true);
    expect(hasOtpAttemptsRemaining(5)).toBe(false);
  });
});
