export type TradeParty = {
  buyerId: string;
  sellerId: string;
};

export function canAccessTradeChat(userId: string, trade: TradeParty) {
  return userId === trade.buyerId || userId === trade.sellerId;
}

export function getSellerConfirmationStatus(successful: boolean) {
  return successful ? "COMPLETED" : "FAILED";
}

export function assertSellerCanConfirm(userId: string, trade: TradeParty) {
  if (userId !== trade.sellerId) {
    throw new Error("Only the seller can confirm trade completion.");
  }
}
