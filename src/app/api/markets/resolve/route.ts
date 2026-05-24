import { NextResponse } from "next/server";
import { z } from "zod";
import { currencies, marketSlug, validateMarketPair } from "@/lib/domain/currencies";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const resolveMarketSchema = z.object({
  baseCurrencyCode: z.string(),
  quoteCurrencyCode: z.string()
});

export async function POST(request: Request) {
  const parsed = resolveMarketSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid market pair." }, { status: 400 });
  }

  const validation = validateMarketPair(parsed.data.baseCurrencyCode, parsed.data.quoteCurrencyCode);

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const slug = marketSlug(validation.baseCurrencyCode, validation.quoteCurrencyCode);

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ market: { id: slug, slug } });
  }

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

  const [baseCurrency, quoteCurrency] = await Promise.all([
    prisma.currency.findUniqueOrThrow({ where: { code: validation.baseCurrencyCode } }),
    prisma.currency.findUniqueOrThrow({ where: { code: validation.quoteCurrencyCode } })
  ]);

  const existingMarket = await prisma.market.findUnique({
    where: {
      baseCurrencyId_quoteCurrencyId: {
        baseCurrencyId: baseCurrency.id,
        quoteCurrencyId: quoteCurrency.id
      }
    },
    select: {
      id: true,
      slug: true,
      active: true
    }
  });

  if (existingMarket) {
    const market = existingMarket.active
      ? existingMarket
      : await prisma.market.update({
          where: { id: existingMarket.id },
          data: { active: true },
          select: { id: true, slug: true, active: true }
        });

    return NextResponse.json({ market: { id: market.id, slug: market.slug } });
  }

  const market = await prisma.market.create({
    data: {
      slug,
      active: true,
      baseCurrencyId: baseCurrency.id,
      quoteCurrencyId: quoteCurrency.id
    },
    select: {
      id: true,
      slug: true
    }
  });

  return NextResponse.json({ market });
}
