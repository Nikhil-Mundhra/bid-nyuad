import { prisma } from "@/lib/prisma";

export async function getHighestActiveBid(marketId: string) {
  return prisma.bid.findFirst({
    where: { marketId, status: "ACTIVE" },
    orderBy: [{ rate: "desc" }, { createdAt: "desc" }],
    include: { buyer: true }
  });
}

export async function getMarketSummaries() {
  const markets = await prisma.market.findMany({
    where: { active: true },
    include: {
      baseCurrency: true,
      quoteCurrency: true,
      bids: {
        orderBy: { createdAt: "desc" },
        take: 12,
        include: { buyer: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });

  return markets.map((market) => ({
    ...market,
    highestBid: market.bids
      .filter((bid) => bid.status === "ACTIVE")
      .sort((left, right) => Number(right.rate) - Number(left.rate))[0]
  }));
}

export async function getMarketDetail(marketIdOrSlug: string) {
  return prisma.market.findFirst({
    where: {
      OR: [{ id: marketIdOrSlug }, { slug: marketIdOrSlug }]
    },
    include: {
      baseCurrency: true,
      quoteCurrency: true,
      bids: {
        orderBy: { createdAt: "desc" },
        take: 30,
        include: { buyer: true }
      }
    }
  });
}
