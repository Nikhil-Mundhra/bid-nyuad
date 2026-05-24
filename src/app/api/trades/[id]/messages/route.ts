import { NextResponse } from "next/server";
import { z } from "zod";
import { canAccessTradeChat } from "@/lib/domain/trades";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUserIdHeader } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  body: z.string().trim().min(1).max(1500)
});

async function resolveUserId(request: Request) {
  const currentUser = await getCurrentUser();
  return currentUser?.id ?? requireUserIdHeader(request);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = await resolveUserId(request);
  const trade = await prisma.trade.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true }
      }
    }
  });

  if (!trade) {
    return NextResponse.json({ error: "Trade not found." }, { status: 404 });
  }

  if (!canAccessTradeChat(userId, trade)) {
    return NextResponse.json({ error: "You cannot access this trade." }, { status: 403 });
  }

  return NextResponse.json({
    messages: trade.messages.map((message) => ({
      id: message.id,
      body: message.body,
      type: message.type,
      createdAt: message.createdAt,
      senderAlias: message.senderId === trade.buyerId ? "Buyer" : "Seller",
      isMine: message.senderId === userId
    }))
  });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = await resolveUserId(request);
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const trade = await prisma.trade.findUnique({
    where: { id: params.id }
  });

  if (!trade) {
    return NextResponse.json({ error: "Trade not found." }, { status: 404 });
  }

  if (!canAccessTradeChat(userId, trade)) {
    return NextResponse.json({ error: "You cannot access this trade." }, { status: 403 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      tradeId: trade.id,
      senderId: userId,
      body: parsed.data.body
    }
  });

  const otherUserId = userId === trade.buyerId ? trade.sellerId : trade.buyerId;

  await prisma.notification.create({
    data: {
      userId: otherUserId,
      type: "TRADE_MESSAGE",
      payload: {
        tradeId: trade.id,
        messageId: message.id
      }
    }
  });

  return NextResponse.json({ message }, { status: 201 });
}
