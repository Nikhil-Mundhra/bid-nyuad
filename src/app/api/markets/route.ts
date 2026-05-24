import { NextResponse } from "next/server";
import { getMarketSummaries } from "@/lib/server/marketService";

export const dynamic = "force-dynamic";

export async function GET() {
  const markets = await getMarketSummaries();
  return NextResponse.json({ markets });
}
