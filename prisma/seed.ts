import { PrismaClient } from "@prisma/client";
import { calculateBidRate } from "../src/lib/domain/bids";

const prisma = new PrismaClient();

async function main() {
  const currencies = [
    { code: "MEAL_SWIPE", displayName: "Meal Swipe", hierarchyRank: 5 },
    { code: "FLEX_DIRHAM", displayName: "Flex Dirham", hierarchyRank: 4 },
    { code: "CAMPUS_DIRHAM", displayName: "Campus Dirham", hierarchyRank: 3 },
    { code: "FALCON_DIRHAM", displayName: "Falcon Dirham", hierarchyRank: 2 },
    { code: "REAL_DIRHAM", displayName: "Real Dirham", hierarchyRank: 1 }
  ] as const;

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {
        displayName: currency.displayName,
        hierarchyRank: currency.hierarchyRank
      },
      create: currency
    });
  }

  const createdCurrencies = await prisma.currency.findMany();
  const byCode = new Map(createdCurrencies.map((currency) => [currency.code, currency]));

  const marketPairs = [
    ["MEAL_SWIPE", "FLEX_DIRHAM"],
    ["FLEX_DIRHAM", "CAMPUS_DIRHAM"],
    ["CAMPUS_DIRHAM", "FALCON_DIRHAM"],
    ["FALCON_DIRHAM", "REAL_DIRHAM"],
    ["FLEX_DIRHAM", "FALCON_DIRHAM"]
  ] as const;

  for (const [baseCode, quoteCode] of marketPairs) {
    const baseCurrency = byCode.get(baseCode);
    const quoteCurrency = byCode.get(quoteCode);

    if (!baseCurrency || !quoteCurrency) {
      throw new Error(`Missing currency for ${baseCode}/${quoteCode}`);
    }

    await prisma.market.upsert({
      where: { slug: `${baseCode}-${quoteCode}`.toLowerCase().replaceAll("_", "-") },
      update: {
        active: true,
        baseCurrencyId: baseCurrency.id,
        quoteCurrencyId: quoteCurrency.id
      },
      create: {
        slug: `${baseCode}-${quoteCode}`.toLowerCase().replaceAll("_", "-"),
        baseCurrencyId: baseCurrency.id,
        quoteCurrencyId: quoteCurrency.id
      }
    });
  }

  const buyer = await prisma.user.upsert({
    where: { netId: "samplebuyer" },
    update: {
      verificationStatus: "VERIFIED",
      whatsappNumber: "+971500000001"
    },
    create: {
      netId: "samplebuyer",
      email: "samplebuyer@nyu.edu",
      verificationStatus: "VERIFIED",
      whatsappNumber: "+971500000001"
    }
  });

  const falconMarket = await prisma.market.findUniqueOrThrow({
    where: { slug: "falcon-dirham-real-dirham" }
  });

  const flexMarket = await prisma.market.findUniqueOrThrow({
    where: { slug: "flex-dirham-falcon-dirham" }
  });

  await prisma.bid.deleteMany({
    where: {
      buyerId: buyer.id,
      marketId: { in: [falconMarket.id, flexMarket.id] }
    }
  });

  const sampleBids = [
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 75.0, status: "ACCEPTED", createdAt: "2025-05-24T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 75.6, status: "ACCEPTED", createdAt: "2025-07-24T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 76.1, status: "ACCEPTED", createdAt: "2025-11-24T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 76.8, status: "ACCEPTED", createdAt: "2026-02-24T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 78.2, status: "ACCEPTED", createdAt: "2026-04-24T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 79.2, status: "ACCEPTED", createdAt: "2026-05-19T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 80.2, status: "ACTIVE", createdAt: "2026-05-23T10:00:00.000Z" },
    { marketId: falconMarket.id, baseAmount: 100, quoteAmount: 80.5, status: "ACTIVE", createdAt: "2026-05-24T10:00:00.000Z" },
    { marketId: flexMarket.id, baseAmount: 50, quoteAmount: 58, status: "ACTIVE", createdAt: "2026-05-22T14:00:00.000Z" },
    { marketId: flexMarket.id, baseAmount: 75, quoteAmount: 84, status: "ACTIVE", createdAt: "2026-05-23T15:00:00.000Z" }
  ] as const;

  for (const sampleBid of sampleBids) {
    await prisma.bid.create({
      data: {
        marketId: sampleBid.marketId,
        buyerId: buyer.id,
        baseAmount: sampleBid.baseAmount,
        quoteAmount: sampleBid.quoteAmount,
        rate: calculateBidRate(sampleBid.baseAmount, sampleBid.quoteAmount),
        status: sampleBid.status,
        createdAt: new Date(sampleBid.createdAt)
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
