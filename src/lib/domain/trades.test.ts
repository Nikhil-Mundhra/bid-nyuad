import { describe, expect, it } from "vitest";
import { canAccessTradeChat, getSellerConfirmationStatus } from "./trades";

describe("trade domain", () => {
  it("limits chat access to buyer and seller", () => {
    const trade = { buyerId: "buyer", sellerId: "seller" };

    expect(canAccessTradeChat("buyer", trade)).toBe(true);
    expect(canAccessTradeChat("seller", trade)).toBe(true);
    expect(canAccessTradeChat("stranger", trade)).toBe(false);
  });

  it("maps seller confirmation to final trade status", () => {
    expect(getSellerConfirmationStatus(true)).toBe("COMPLETED");
    expect(getSellerConfirmationStatus(false)).toBe("FAILED");
  });
});
