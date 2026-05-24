import { describe, expect, it } from "vitest";
import { shouldNotifyHighestBid } from "./notifications";

describe("notification domain", () => {
  it("notifies only when a candidate beats the current best bid", () => {
    expect(
      shouldNotifyHighestBid(
        { id: "candidate", rate: 0.81, status: "ACTIVE" },
        { id: "current", rate: 0.8, status: "ACTIVE" }
      )
    ).toBe(true);

    expect(
      shouldNotifyHighestBid(
        { id: "candidate", rate: 0.79, status: "ACTIVE" },
        { id: "current", rate: 0.8, status: "ACTIVE" }
      )
    ).toBe(false);
  });
});
