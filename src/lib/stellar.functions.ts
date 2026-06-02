import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Pi Mainnet uses a Stellar-based Horizon API.
const HORIZON_URL = "https://api.mainnet.minepi.com";

// Standard Stellar base fee is 100 stroops (1 stroop = 1e-7 PI).
export const BASE_FEE_STROOPS = 100;

// 2.5% reconstruction split (Gaza / Sudan humanitarian flow).
export const RECONSTRUCTION_BPS = 250; // basis points out of 10_000

// Configure via env: DONATION_WALLET (Stellar G... public key).
function getDonationWallet(): string {
  const w = process.env.DONATION_WALLET;
  if (!w) throw new Error("DONATION_WALLET is not configured");
  return w;
}

interface HorizonBalance {
  asset_type: string;
  balance: string;
}

interface HorizonAccount {
  account_id: string;
  balances: HorizonBalance[];
}

export const getAccountBalance = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ accountId: z.string().regex(/^G[A-Z0-9]{55}$/) }).parse(input),
  )
  .handler(async ({ data }) => {
    const res = await fetch(`${HORIZON_URL}/accounts/${data.accountId}`);
    if (res.status === 404) {
      return { accountId: data.accountId, native: "0", reconstructionCut: "0" };
    }
    if (!res.ok) {
      throw new Error(`Horizon lookup failed: ${res.status}`);
    }
    const account = (await res.json()) as HorizonAccount;
    const native = account.balances.find((b) => b.asset_type === "native")?.balance ?? "0";
    const cut = ((Number(native) * RECONSTRUCTION_BPS) / 10_000).toFixed(7);
    return { accountId: account.account_id, native, reconstructionCut: cut };
  });

/**
 * Compute the donation split for an incoming transaction amount (in PI).
 * Returns the wallet and amount that must be routed to the reconstruction fund.
 */
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

export const computeReconstructionSplit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ amount: z.number().positive().finite() }).parse(input),
  )
  .handler(async ({ data }) => computeReconstructionSplitSync(data.amount));
