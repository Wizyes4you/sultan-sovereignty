export interface DocumentedErrorState {
  id: string;
  matches: string[];
  guidance: string;
}

export const DOCUMENTED_ERROR_STATES: DocumentedErrorState[] = [
  {
    id: "pi-sdk",
    matches: ["pi sdk not available", "pi.init", "pi.authenticate", "open this app inside the pi browser"],
    guidance:
      "Pi SDK not available: open Sultan inside Pi Browser, confirm the official Pi SDK loaded, then reconnect the wallet.",
  },
  {
    id: "session-verification",
    matches: ["session failed", "pi token verification failed", "establish-session", "401"],
    guidance:
      "Session verification: reconnect and approve the requested Pi account scopes. A rejected token requires a fresh Pi authentication; never share the access token.",
  },
  {
    id: "payment-approval",
    matches: ["approve failed", "payment lookup failed", "missing paymentid", "approval"],
    guidance:
      "Payment approval: check the payment state in Pi Browser before trying again. A server approval error may need app-server configuration support; do not create a duplicate payment while the original is pending.",
  },
  {
    id: "payment-completion",
    matches: ["complete failed", "missing paymentid or txid", "completion", "transaction not completed"],
    guidance:
      "Payment completion: check the transaction in Pi Browser and confirm its on-chain status before retrying. Keep the transaction ID private when asking for help.",
  },
  {
    id: "payment-cancelled",
    matches: ["payment cancelled", "payment canceled", "oncancel"],
    guidance:
      "Payment cancelled: the wallet cancelled the operation. Confirm no payment is pending or completed before starting a new payment.",
  },
  {
    id: "horizon-rpc",
    matches: ["horizon lookup failed", "rpc", "horizon", "account lookup"],
    guidance:
      "Pi Mainnet Horizon/RPC lookup: check service availability and retry the read later; an account-not-found response is treated as a zero balance by this app.",
  },
  {
    id: "gas-quote",
    matches: ["gas fee", "quotegas", "stroops", "fee"],
    guidance:
      "Gas/fee validation: verify the displayed network fee and amount. The app blocks fee quotes above 10,000 stroops; do not bypass this limit or sign until the quote is valid.",
  },
];

const SENSITIVE_ASSIGNMENT =
  /(access[_ -]?token|api[_ -]?key|passphrase|private[_ -]?key|secret)\s*[:=]\s*["']?[^\s,"';]+/gi;
const PAYMENT_REFERENCE = /(payment[_ -]?id|txid)\s*[:=]\s*[^\s,"';]+/gi;

export function sanitizeTroubleshootingText(value: string): string {
  return value
    .slice(0, 800)
    .replace(/bearer\s+[^\s,"';]+/gi, "Bearer [redacted]")
    .replace(SENSITIVE_ASSIGNMENT, "$1=[redacted]")
    .replace(PAYMENT_REFERENCE, "$1=[redacted]")
    .replace(/\bG[A-Z0-9]{55}\b/gi, "[wallet address redacted]")
    .replace(/\b[A-Za-z0-9_-]{40,}\b/g, "[identifier redacted]")
    .trim();
}

export function getRelevantDocumentedErrorStates(issue: string, errorMessage?: string): DocumentedErrorState[] {
  const searchText = `${issue} ${errorMessage ?? ""}`.toLowerCase();
  const matched = DOCUMENTED_ERROR_STATES.filter((state) =>
    state.matches.some((phrase) => searchText.includes(phrase)),
  );
  return matched.length > 0 ? matched : DOCUMENTED_ERROR_STATES;
}