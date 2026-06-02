import { describe, it, expect, beforeAll } from "vitest";
import { computeReconstructionSplitSync, RECONSTRUCTION_BPS } from "../stellar.functions";

const WALLET = "GCVRDWR2T2DFJLWF2BLN4AU7U6TKWFGAPS4T5V7GPZCTGRWWOZDS4URF";

beforeAll(() => {
  process.env.DONATION_WALLET = WALLET;
});

describe("computeReconstructionSplit", () => {
  it("splits 1 Pi into 0.025 donation + 0.975 net", () => {
    const r = computeReconstructionSplitSync(1);
    expect(r.donationAmount).toBe(0.025);
    expect(r.netAmount).toBe(0.975);
    expect(r.donationWallet).toBe(WALLET);
  });

  it("uses 250 bps (2.5%) and rounds to 7 decimals", () => {
    expect(RECONSTRUCTION_BPS).toBe(250);
    const r = computeReconstructionSplitSync(3.1415927);
    expect(r.donationAmount).toBeCloseTo(0.0785398, 7);
    expect(r.netAmount + r.donationAmount).toBeCloseTo(3.1415927, 6);
  });

  it("rejects non-positive amounts", () => {
    expect(() => computeReconstructionSplitSync(0)).toThrow();
    expect(() => computeReconstructionSplitSync(-1)).toThrow();
    expect(() => computeReconstructionSplitSync(NaN)).toThrow();
  });

  it("returns a valid Stellar G... wallet", () => {
    const r = computeReconstructionSplitSync(100);
    expect(r.donationWallet).toMatch(/^G[A-Z0-9]{55}$/);
  });
});
