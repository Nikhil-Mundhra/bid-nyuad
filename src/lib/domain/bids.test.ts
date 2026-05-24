import { describe, expect, it } from "vitest";
import { assertBidCanBeAccepted, calculateBidRate, getHighestActiveBid } from "./bids";

describe("bid domain", () => {
  it("calculates bid rate as quote per base", () => {
    expect(calculateBidRate(100, 80)).toBe(0.8);
  });

  it("returns the highest active bid", () => {
    const highest = getHighestActiveBid([
      { id: "low", rate: 0.75, status: "ACTIVE" },
      { id: "accepted", rate: 0.9, status: "ACCEPTED" },
      { id: "high", rate: 0.8, status: "ACTIVE" }
    ]);

    expect(highest?.id).toBe("high");
  });

  it("prevents double acceptance of inactive bids", () => {
    expect(() =>
      assertBidCanBeAccepted({ id: "bid", rate: 0.8, status: "ACCEPTED" }, "seller", "buyer")
    ).toThrow("Bid is no longer active.");
  });

  it("prevents buyers from accepting their own bids", () => {
    expect(() =>
      assertBidCanBeAccepted({ id: "bid", rate: 0.8, status: "ACTIVE" }, "same-user", "same-user")
    ).toThrow("Buyers cannot accept their own bids.");
  });
});
