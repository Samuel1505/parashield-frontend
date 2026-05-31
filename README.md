# parashield-frontend

Next.js 15 marketplace for Parashield. Browse insurance products, buy policies with USDC, and submit claims — all from a Stellar wallet.

---

## Pages

| Route | Component | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Product grid + hero. Server component — fetches products at request time. Falls back to seed data if API is offline. |
| `/policies` | `app/policies/page.tsx` | User policy portfolio. Client component — requires wallet connection. |
| `/pools` | — | Risk pool LP view — v2, not yet built. |

---

## Components

**`ProductCard`** — displays one insurance product. Shows trigger condition, premium rate, and coverage range. "Buy Policy" opens `BuyPolicyModal`.

**`BuyPolicyModal`** — full purchase flow: coverage input, duration, oracle key, estimated premium calculation, wallet signing. Soroban tx integration is stubbed — the signing step simulates 2 seconds then shows success. Replace the stub with a real `policy-engine.buy_policy()` invocation.

**`ClaimStatus`** — rendered inside each active policy card. "Submit Claim" button calls `POST /claims`, then polls `GET /claims/:id` every 3 seconds until the result is `Paid`, `Rejected`, or `Expired`.

---

## Lib

**`lib/api.ts`** — typed Axios wrappers for all backend endpoints. Every response is typed — no `any`.

**`lib/stellar.ts`** — Freighter wallet connect via `@creit.tech/stellar-wallets-kit`. `fromStroops` / `toStroops` for 7-decimal fixed-point conversion.

```ts
fromStroops(1_000_000_000n)  // "100.0000000"
toStroops("50")               // 500_000_000n
```

---

## Setup

```bash
npm install
cp .env.example .env
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STELLAR_NETWORK=testnet
```

```bash
npm run dev    # http://localhost:3000
```

Install [Freighter](https://www.freighter.app) and switch it to testnet before testing wallet flows.

---

## Wallet support

Uses `@creit.tech/stellar-wallets-kit`. Supported: Freighter, xBull, Lobstr, Albedo.

The kit is imported dynamically (`await import(...)`) to avoid SSR errors in the App Router.

---

## What needs to be wired

`BuyPolicyModal` has the full UX but the transaction signing step is a 2-second fake. To go live, replace the `// TODO` block with:

```ts
import { TransactionBuilder, Networks, BASE_FEE, rpc } from '@stellar/stellar-sdk';

// Build InvokeHostFunction for policy-engine.buy_policy(...)
// Sign with the connected wallet via stellar-wallets-kit
// Submit via rpc.sendTransaction(...)
```

The contracts and API are fully functional — this is the only missing piece.

---

## Related

- [parashield-contracts](https://github.com/Parashield-Protocol/parashield-contracts) — Soroban contracts
- [parashield-backend](https://github.com/Parashield-Protocol/parashield-backend) — API + keeper daemon
