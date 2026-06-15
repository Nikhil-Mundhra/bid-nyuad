import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateBidRate } from "@/lib/domain/bids";
import { shouldNotifyHighestBid } from "@/lib/domain/notifications";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { getHighestActiveBid } from "@/lib/server/marketService";
import { notifyHighestBid } from "@/lib/server/notificationService";

export const dynamic = "force-dynamic";

const schema = z.object({
  marketId: z.string().min(1),
  baseAmount: z.coerce.number().positive(),
  quoteAmount: z.coerce.number().positive(),
  expiresAt: z.coerce.date().optional()
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const buyerId = currentUser?.id;

  if (!buyerId) {
    return NextResponse.json({ error: "Login or register before placing a live bid." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const rate = calculateBidRate(parsed.data.baseAmount, parsed.data.quoteAmount);
  const previousHighest = await getHighestActiveBid(parsed.data.marketId);

  const bid = await prisma.bid.create({
    data: {
      marketId: parsed.data.marketId,
      buyerId,
      baseAmount: parsed.data.baseAmount,
      quoteAmount: parsed.data.quoteAmount,
      rate,
      expiresAt: parsed.data.expiresAt
    }
  });

  const isHighest = shouldNotifyHighestBid(
    {
      id: bid.id,
      rate: Number(bid.rate),
      status: bid.status
    },
    previousHighest
      ? {
          id: previousHighest.id,
          rate: Number(previousHighest.rate),
          status: previousHighest.status
        }
      : null
  );

  const notifiedUserIds = isHighest
    ? await notifyHighestBid({
        marketId: bid.marketId,
        bidId: bid.id,
        buyerId,
        baseAmount: Number(bid.baseAmount),
        quoteAmount: Number(bid.quoteAmount),
        rate: Number(bid.rate)
      })
    : [];

  return NextResponse.json({ bid, isHighest, notifiedUserIds }, { status: 201 });
}
