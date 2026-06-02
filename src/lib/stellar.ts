// Pure helpers shared by stellar.functions.ts and unit tests.
// Kept out of *.functions.ts so the TanStack server-fn plugin doesn't
// transform these into RPC stubs.

export const BASE_FEE_STROOPS = 100;
export const RECONSTRUCTION_BPS = 250; // 2.5%

export function getDonationWallet(): string {
  const w = process.env.DONATION_WALLET;
  if (!w) throw new Error("DONATION_WALLET is not configured");
  return w;
}

export function computeReconstructionSplitSync(amount: number) {
  if (!(amount > 0) || !Number.isFinite(amount)) {
    throw new Error("amount must be a positive finite number");
  }
  const donationAmount = +((amount * RECONSTRUCTION_BPS) / 10_000).toFixed(7);
  const netAmount = +(amount - donationAmount).toFixed(7);
  return {
    donationAmount,
    netAmount,
    donationWallet: getDonationWallet(),
    baseFeeStroops: BASE_FEE_STROOPS,
  };
}
