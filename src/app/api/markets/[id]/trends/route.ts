import { NextResponse } from "next/server";
import { getMarketDetail } from "@/lib/server/marketService";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const market = await getMarketDetail(params.id);

  if (!market) {
    return NextResponse.json({ error: "Market not found." }, { status: 404 });
  }

  return NextResponse.json({
    marketId: market.id,
    points: market.bids
      .slice()
      .reverse()
      .map((bid) => ({
        bidId: bid.id,
        createdAt: bid.createdAt,
        rate: Number(bid.rate),
        baseAmount: Number(bid.baseAmount),
        quoteAmount: Number(bid.quoteAmount),
        status: bid.status
      }))
  });
}
