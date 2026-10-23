import { BASE_FEE_STROOPS, RECONSTRUCTION_BPS, computeReconstructionSplitSync } from "./stellar";

export { BASE_FEE_STROOPS, RECONSTRUCTION_BPS };

// Pi Mainnet uses a Stellar-based Horizon API.
const HORIZON_URL = "https://api.mainnet.minepi.com";

interface HorizonBalance {
  asset_type: string;
  balance: string;
}

interface HorizonAccount {
  account_id: string;
  balances: HorizonBalance[];
}

export async function getAccountBalance(accountId: string) {
  if (!/^G[A-Z0-9]{55}$/.test(accountId)) {
    throw new Error("Invalid Stellar account ID");
  }

  const res = await fetch(`${HORIZON_URL}/accounts/${accountId}`);
  if (res.status === 404) {
    return { accountId, native: "0", reconstructionCut: "0" };
  }
  if (!res.ok) {
    throw new Error(`Horizon lookup failed: ${res.status}`);
  }
  const account = (await res.json()) as HorizonAccount;
  const native = account.balances.find((b) => b.asset_type === "native")?.balance ?? "0";
  const cut = ((Number(native) * RECONSTRUCTION_BPS) / 10_000).toFixed(7);
  return { accountId: account.account_id, native, reconstructionCut: cut };
}

/**
 * Compute the donation split for an incoming transaction amount (in PI).
 * Returns the wallet and amount that must be routed to the reconstruction fund.
 */
export function computeReconstructionSplit(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive finite number");
  }
  return computeReconstructionSplitSync(amount);
}
