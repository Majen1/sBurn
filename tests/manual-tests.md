# sBurn2 Token Manual Tests

## Initial Setup
1. Deploy Contract 

2. Check contract owner balance:
```clarity
(contract-call? .sburn2 get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```
Expected: `(ok u0)`
Actual: `(ok u0)` ✅ PASS

3. Check initial supply:
```clarity
(contract-call? .sburn2 get-total-supply)
```
Expected: `(ok u0)`
Actual: `(ok u0)` ✅ PASS

4. Check token details:
```clarity
(contract-call? .sburn2 get-name)
(contract-call? .sburn2 get-symbol)
(contract-call? .sburn2 get-decimals)
```
Expected: 
- `(ok "sBurn2")`
- `(ok "SBURN2")`
- `(ok u6)`

Actual:
- `(ok "sBurn2")` ✅ PASS
- `(ok "SBURN2")` ✅ PASS
- `(ok u6)` ✅ PASS

5. Check token URI:
```clarity
(contract-call? .sburn2 get-token-uri)
```
Expected: `(ok (some u""))`
Actual: `(ok (some u""))` ✅ PASS

## Minting Tokens
1. First mint tokens (as contract owner):
```clarity
;; Make sure you're using the contract owner for this call
(contract-call? .sburn2 mint u5000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```
Expected: `(ok true)`
Actual: `(ok true)` ✅ PASS

2. Verify the balance after minting:
```clarity
(contract-call? .sburn2 get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```
Expected: `(ok u5000000)`
Actual: `(ok u5000000)` ✅ PASS

## Transferring Tokens
1. Transfer tokens to external recipient:
```clarity
;; Transfer to an external recipient (different from fee recipient)
(contract-call? .sburn2 transfer u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG none)
```
Expected: `(ok true)`
Actual: `(ok true)` ✅ PASS

2. Check all balances after transfer:
```clarity
;; Check individual balances
(contract-call? .sburn2 get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(contract-call? .sburn2 get-balance 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
(contract-call? .sburn2 get-balance 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
(contract-call? .sburn2 get-balance 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ)
(contract-call? .sburn2 get-total-burned)
(contract-call? .sburn2 get-total-fees-collected)

;; Verify in assets map
::get_assets_maps .sburn2
```

Expected Results:
- Sender: `(ok u4000000)` (remaining from 5M minted after 1M transfer)
- External Recipient: `(ok u997500)` (1M - 0.25% total fee)
- Fee Recipient: `(ok u1250)` (half of 0.25% fee)
- Test Burn Address: `(ok u1250)` (other half of 0.25% fee)
- Total Burned: `(ok u1250)`
- Total Fees: `(ok u2500)`

Actual Results:
- Sender: `(ok u4000000)` ✅ PASS
- External Recipient: `(ok u997500)` ✅ PASS
- Fee Recipient: `(ok u1250)` ✅ PASS
- Test Burn Address: `(ok u1250)` ✅ PASS
- Total Burned: `(ok u1250)` ✅ PASS
- Total Fees: `(ok u2500)` ✅ PASS

Expected Assets Map:
```clarity
{
    ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sburn2::sBurn2-coin: {
        ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM: 4000000,
        ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG: 997500,
        ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5: 1250,
        ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ: 1250
    }
}
```
Actual: Assets map matches expected values ✅ PASS

Math Verification:
For 1,000,000 transfer:
- 0.25% total fee = 2,500 (25 basis points = 25/10000)
- Half to burn = 1,250 (0.125%)
- Half to fee recipient = 1,250 (0.125%)
- Recipient gets = 997,500 (original - 0.25% fee)
✅ PASS

3. Test insufficient balance:
```clarity
;; Attempt to transfer more than the sender's balance
(contract-call? .sburn2 transfer u5000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG none)
```
Expected: `(err u104)` (which represents the ERR_INSUFFICIENT_BALANCE error)
Actual: `(err u104)` ✅ PASS

4. Test transfer to burn address:
```clarity
;; Try to send tokens to the burn address
(contract-call? .sburn2 transfer u1000000 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ none)
```
Expected: `(err u103)` (which represents the ERR_INVALID_RECIPIENT error - cannot transfer to burn address)
Actual: `(err u103)` ✅ PASS

## Read-Only Functions
```clarity
;; Get burn rate
(contract-call? .sburn2 get-burn-rate)

;; Get effective supply
(contract-call? .sburn2 get-effective-supply)

;; Get total supply
(contract-call? .sburn2 get-total-supply)
```
Expected:
- Burn Rate: `(ok u12)` ;; The burn rate is half of the fee rate (u25). Since we're using integers, it rounds down to 12.
- Effective Supply: `(ok u4998750)` (5,000,000 - 1,250 burned)
- Total Supply: `(ok u5000000)`

Actual:
- Burn Rate: `(ok u12)` ✅ PASS
- Effective Supply: `(ok u4998750)` ✅ PASS
- Total Supply: `(ok u5000000)` ✅ PASS
