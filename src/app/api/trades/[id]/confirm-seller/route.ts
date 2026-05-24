import { NextResponse } from "next/server";
import { z } from "zod";
import { assertSellerCanConfirm, getSellerConfirmationStatus } from "@/lib/domain/trades";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUserIdHeader } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  successful: z.boolean(),
  failureReason: z.string().max(500).optional()
});

async function resolveUserId(request: Request) {
  const currentUser = await getCurrentUser();
  return currentUser?.id ?? requireUserIdHeader(request);
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

  try {
    assertSellerCanConfirm(userId, trade);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seller confirmation failed." },
      { status: 403 }
    );
  }

  const status = getSellerConfirmationStatus(parsed.data.successful);
  const updatedTrade = await prisma.trade.update({
    where: { id: trade.id },
    data: {
      status,
      sellerConfirmedAt: new Date(),
      completedAt: parsed.data.successful ? new Date() : null,
      sellerFailureReason: parsed.data.successful ? null : parsed.data.failureReason,
      messages: {
        create: {
          senderId: userId,
          type: "SYSTEM",
          body: parsed.data.successful
            ? "Seller marked this trade as successfully completed."
            : "Seller marked this trade as failed."
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: trade.buyerId,
      type: parsed.data.successful ? "TRADE_COMPLETED" : "TRADE_FAILED",
      payload: {
        tradeId: trade.id,
        status
      }
    }
  });

  return NextResponse.json({ trade: updatedTrade });
}
