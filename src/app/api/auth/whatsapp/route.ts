import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  whatsappNumber: z.string().min(7).max(24)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const currentUser = await getCurrentUser();
  const userId = currentUser?.id ?? request.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Login before updating account settings." }, { status: 401 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { whatsappNumber: parsed.data.whatsappNumber }
  });

  return NextResponse.json({
    user: {
      id: user.id,
      netId: user.netId,
      whatsappNumber: user.whatsappNumber
    }
  });
}
