export type BidLike = {
  id: string;
  rate: number;
  status: "ACTIVE" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  createdAt?: Date;
};

export function calculateBidRate(baseAmount: number, quoteAmount: number) {
  if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
    throw new Error("Base amount must be greater than zero.");
  }

  if (!Number.isFinite(quoteAmount) || quoteAmount <= 0) {
    throw new Error("Quote amount must be greater than zero.");
  }

  return Number((quoteAmount / baseAmount).toFixed(6));
}

export function getHighestActiveBid<T extends BidLike>(bids: T[]) {
  return bids
    .filter((bid) => bid.status === "ACTIVE")
    .sort((left, right) => {
      if (right.rate !== left.rate) {
        return right.rate - left.rate;
      }

      return (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0);
    })[0];
}

export function isNewHighestBid(candidate: BidLike, currentHighest?: BidLike | null) {
  if (candidate.status !== "ACTIVE") {
    return false;
  }

  if (!currentHighest) {
    return true;
  }

  return candidate.rate > currentHighest.rate;
}

export function assertBidCanBeAccepted(bid: BidLike, sellerId: string, buyerId: string) {
  if (bid.status !== "ACTIVE") {
    throw new Error("Bid is no longer active.");
  }

  if (sellerId === buyerId) {
    throw new Error("Buyers cannot accept their own bids.");
  }
}
