import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "bid_nyuad_session";
const SESSION_DAYS = 30;

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createRandomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export async function createSession(userId: string) {
  const token = createRandomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt
    }
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  });
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true }
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
}

export function hasSessionCookie() {
  return Boolean(cookies().get(SESSION_COOKIE)?.value);
}

export function requireUserIdHeader(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    throw new Error("Missing x-user-id header for this MVP API call.");
  }

  return userId;
}
