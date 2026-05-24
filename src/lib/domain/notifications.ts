import { isNewHighestBid, type BidLike } from "./bids";

export function shouldNotifyHighestBid(candidate: BidLike, currentHighest?: BidLike | null) {
  return isNewHighestBid(candidate, currentHighest);
}

export function buildHighestBidPayload(input: {
  marketId: string;
  bidId: string;
  baseAmount: number;
  quoteAmount: number;
  rate: number;
}) {
  return {
    marketId: input.marketId,
    bidId: input.bidId,
    baseAmount: input.baseAmount,
    quoteAmount: input.quoteAmount,
    rate: input.rate
  };
}
