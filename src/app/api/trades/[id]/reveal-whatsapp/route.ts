import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUserIdHeader } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

async function resolveUserId(request: Request) {
  const currentUser = await getCurrentUser();
  return currentUser?.id ?? requireUserIdHeader(request);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = await resolveUserId(request);
  const trade = await prisma.trade.findUnique({
    where: { id: params.id },
    include: { buyer: true }
  });

  if (!trade) {
    return NextResponse.json({ error: "Trade not found." }, { status: 404 });
  }

  if (trade.buyerId !== userId) {
    return NextResponse.json({ error: "Only the buyer can reveal their WhatsApp number." }, { status: 403 });
  }

  if (!trade.buyer.whatsappNumber) {
    return NextResponse.json({ error: "Add a WhatsApp number before revealing it." }, { status: 400 });
  }

  const updatedTrade = await prisma.trade.update({
    where: { id: trade.id },
    data: {
      whatsappRevealedAt: new Date(),
      messages: {
        create: {
          senderId: userId,
          type: "WHATSAPP_REVEAL",
          body: `Buyer shared WhatsApp: ${trade.buyer.whatsappNumber}`
        }
      }
    }
  });

  return NextResponse.json({ trade: updatedTrade });
}
