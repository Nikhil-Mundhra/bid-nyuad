export const OTP_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

export function buildNyuEmail(netId: string) {
  const normalized = normalizeNetId(netId);
  return `${normalized}@nyu.edu`;
}

export function normalizeNetId(netId: string) {
  return netId.trim().toLowerCase();
}

export function isOtpExpired(expiresAt: Date, now = new Date()) {
  return expiresAt.getTime() <= now.getTime();
}

export function hasOtpAttemptsRemaining(attemptCount: number) {
  return attemptCount < OTP_MAX_ATTEMPTS;
}

export function createOtpExpiry(now = new Date()) {
  return new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);
}
