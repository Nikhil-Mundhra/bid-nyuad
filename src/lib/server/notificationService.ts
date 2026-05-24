import { prisma } from "@/lib/prisma";
import { buildHighestBidPayload } from "@/lib/domain/notifications";

export async function notifyHighestBid(input: {
  marketId: string;
  bidId: string;
  buyerId: string;
  baseAmount: number;
  quoteAmount: number;
  rate: number;
}) {
  const users = await prisma.user.findMany({
    where: {
      id: { not: input.buyerId },
      verificationStatus: "VERIFIED"
    },
    select: { id: true }
  });

  if (users.length === 0) {
    return [];
  }

  const payload = buildHighestBidPayload(input);

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type: "HIGHEST_BID",
      payload
    }))
  });

  return users.map((user) => user.id);
}
