// Pi Network gas fee framework (Mainnet).
//
// Pi runs on a Stellar-derived ledger. Every payment operation is charged a
// network base fee in stroops (1 Pi = 10,000,000 stroops). The Pi Wallet
// signs the transaction with this fee — it cannot be set by the app — but
// the app must surface it so the user sees the true total cost before
// approving, and so backend bookkeeping reconciles net vs. gross.
//
// This module is the single source of truth for fee math used by the SDK
// layer (pi-client) and any UI that previews a transaction.

/** Stroops per 1 Pi (Stellar standard precision: 7 decimals). */
export const STROOPS_PER_PI = 10_000_000;

/** Mainnet base fee per operation, in stroops. Matches Stellar core default. */
export const MAINNET_BASE_FEE_STROOPS = 100;

/** Conservative ceiling we accept from the network before refusing to sign. */
export const MAX_ACCEPTABLE_FEE_STROOPS = 10_000; // 0.001 Pi — 100x base

export type Network = "mainnet" | "testnet";

export interface GasQuote {
  /** Number of Stellar operations in the tx (payment = 1, +1 per extra op). */
  operations: number;
  /** Per-op fee in stroops actually used for the quote. */
  baseFeeStroops: number;
  /** Total network fee in stroops (operations × baseFeeStroops). */
  totalFeeStroops: number;
  /** Same total expressed in Pi (7-decimal precision). */
  totalFeePi: number;
  /** Payment amount the user sees in their wallet (Pi). */
  amountPi: number;
  /** amountPi + totalFeePi, rounded to 7 decimals. */
  grossPi: number;
  network: Network;
}

function round7(n: number): number {
  return Math.round(n * STROOPS_PER_PI) / STROOPS_PER_PI;
}

/**
 * Compute the gas quote for a Pi payment.
 *
 * @param amountPi   The payment amount in Pi (what the recipient receives).
 * @param operations Number of Stellar ops; default 1 (single payment).
 * @param baseFeeStroops Override per-op fee (defaults to mainnet base).
 */
export function quoteGas(
  amountPi: number,
  operations = 1,
  baseFeeStroops: number = MAINNET_BASE_FEE_STROOPS,
  network: Network = "mainnet",
): GasQuote {
  if (!Number.isFinite(amountPi) || amountPi <= 0) {
    throw new Error("quoteGas: amountPi must be a positive finite number");
  }
  if (!Number.isInteger(operations) || operations < 1) {
    throw new Error("quoteGas: operations must be a positive integer");
  }
  if (!Number.isInteger(baseFeeStroops) || baseFeeStroops < 1) {
    throw new Error("quoteGas: baseFeeStroops must be a positive integer");
  }
  assertFeeAcceptable(baseFeeStroops * operations);

  const totalFeeStroops = baseFeeStroops * operations;
  const totalFeePi = round7(totalFeeStroops / STROOPS_PER_PI);
  const grossPi = round7(amountPi + totalFeePi);
  return {
    operations,
    baseFeeStroops,
    totalFeeStroops,
    totalFeePi,
    amountPi: round7(amountPi),
    grossPi,
    network,
  };
}

/** Throws if a quoted/observed fee exceeds our safety ceiling. */
export function assertFeeAcceptable(feeStroops: number): void {
  if (feeStroops > MAX_ACCEPTABLE_FEE_STROOPS) {
    throw new Error(
      `Gas fee ${feeStroops} stroops exceeds maximum ${MAX_ACCEPTABLE_FEE_STROOPS}`,
    );
  }
}

export function formatPi(pi: number, decimals = 7): string {
  return pi.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
}
