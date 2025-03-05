# sBurn Token Tests

> All tests were conducted on the Stacks Explorer Sandbox using the deployed testnet contract at ST1Y0JZ5NGPR6E2S5GGWN3XFJ9SZ6R8K4M0QQ1V8X.sburn

## Testing Sequence

**Important:** Execute tests in the order shown below to ensure proper state progression. Each section builds upon the previous one.

## Read-Only Functions

| Function | Expected | Actual | Status |
|----------|----------|--------|--------|
| get-name | (ok "sBurn") | (ok "sBurn") | ✅ |
| get-symbol | (ok "SBURN") | (ok "SBURN") | ✅ |
| get-decimals | (ok u6) | (ok u6) | ✅ |
| get-token-uri | (ok (some u"https://bafkreicy5mu34ikqd7e7rgarkf2hhipicfriw4krmabkiusjhua3sh2oyi.ipfs.flk-ipfs.xyz/")) | (ok (some u"https://bafkreicy5mu34ikqd7e7rgarkf2hhipicfriw4krmabkiusjhua3sh2oyi.ipfs.flk-ipfs.xyz/")) | ✅ |
| get-burn-rate | (ok u12) | (ok u12) | ✅ |
| get-total-supply | (ok u0) | (ok u0) | ✅ |
| get-total-burned | (ok u0) | (ok u0) | ✅ |
| get-total-fees-collected | (ok u0) | (ok u0) | ✅ |
| get-effective-supply | (ok u0) | (ok u0) | ✅ |
| get-balance | (ok u0) | (ok u0) | ✅ |

## Mint Function

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Unauthorized mint | (err u100) | (err u100) | ✅ |
| Successful mint | (ok true) | (ok true) | ✅ |

## Transfer Function

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Below minimum | (err u101) | (err u101) | ✅ |
| Self transfer | (err u2) | (err u2) | ✅ |
| To burn address | (err u103) | (err u103) | ✅ |
| Not owner | (err u102) | (err u102) | ✅ |
| Successful transfer | (ok true) | (ok true) | ✅ |
| Second transfer | (ok true) | (ok true) | ✅ |

## Post-Operation State

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Final burned amount | (ok u15000) | (ok u15000) | ✅ |
| Final fees collected | (ok u30000) | (ok u30000) | ✅ |
| Final effective supply | (ok u999999985000) | (ok u999999985000) | ✅ |

## Important Settings
```
Contract name: sburn
Asset name: sBurn-coin
Testing platform: Stacks Explorer Sandbox (https://explorer.hiro.so/sandbox/contract-call?chain=testnet)
Contract ID: ST1Y0JZ5NGPR6E2S5GGWN3XFJ9SZ6R8K4M0QQ1V8X.sburn
```

## ⚠️ Important Note on Post Conditions

When setting up post conditions for transfers, use these exact settings to avoid failed transactions:

1. **Select "Fungible Token"** (not STX FT)
2. Fill in:
   - **Principal**: Your address (sender)
   - **Contract name**: `sburn` (NOT "sburn-coin" - this is a common mistake!)
   - **Asset name**: `sBurn-coin` (case sensitive - note the capital 'B')
   - **Amount**: Same as transfer amount (e.g., u2000000)
   - **Condition**: "Less than or equal to"

The most common causes of post condition failures are:
- Using "sburn-coin" as the contract name (incorrect)
- Using "sburnCoin" or other variations of the asset name (incorrect)
- Not being case-sensitive with "sBurn-coin" (must have capital 'B')

Remember that `Contract address` and `Asset address` should both be the same: ST1Y0JZ5NGPR6E2S5GGWN3XFJ9SZ6R8K4M0QQ1V8X


