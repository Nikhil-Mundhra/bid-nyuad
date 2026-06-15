import { NextResponse } from "next/server";
import { assertBidCanBeAccepted } from "@/lib/domain/bids";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const sellerId = currentUser?.id;

  if (!sellerId) {
    return NextResponse.json({ error: "Login or register before accepting a bid." }, { status: 401 });
  }

  try {
    const trade = await prisma.$transaction(async (tx) => {
      const bid = await tx.bid.findUnique({
        where: { id: params.id }
      });

      if (!bid || bid.status !== "ACTIVE") {
        throw new Error("Bid is no longer active.");
      }

      assertBidCanBeAccepted(
        {
          id: bid.id,
          rate: Number(bid.rate),
          status: bid.status
        },
        sellerId,
        bid.buyerId
      );

      await tx.bid.update({
        where: { id: bid.id },
        data: { status: "ACCEPTED" }
      });

      const createdTrade = await tx.trade.create({
        data: {
          bidId: bid.id,
          buyerId: bid.buyerId,
          sellerId,
          messages: {
            create: {
              senderId: sellerId,
              type: "SYSTEM",
              body: "Trade accepted. You can coordinate details here anonymously."
            }
          }
        },
        include: {
          bid: true,
          buyer: true,
          seller: true
        }
      });

      await tx.notification.create({
        data: {
          userId: bid.buyerId,
          type: "BID_ACCEPTED",
          payload: {
            bidId: bid.id,
            tradeId: createdTrade.id,
            sellerId
          }
        }
      });

      return createdTrade;
    });

    return NextResponse.json({ trade }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not accept bid." },
      { status: 409 }
    );
  }
}
