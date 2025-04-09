TERMINAL - npm run test


(node:15012) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:15012) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
 ✓ tests/sburn.test.ts (14) 842ms
   ✓ sBurn tests (14) 841ms
     ✓ should have contract deployed
     ✓ Token Operations (3) 341ms
       ✓ should mint tokens successfully 316ms
       ✓ should fail transfer with error 104 when sender and recipient order is incorrect
       ✓ should reject invalid transfer
     ✓ Burn and Fee Distribution (1)
       ✓ should fail transfer with error 104 before burn and fee distribution
     ✓ Transfer Mechanics (2)
       ✓ should successfully transfer tokens between accounts
       ✓ should handle multiple transfers correctly
     ✓ Burn Mechanism (2)
       ✓ should burn correct amount on transfer
       ✓ should accumulate burns from multiple transfers
     ✓ Fee Distribution (1)
       ✓ should distribute fees correctly on transfer
     ✓ Edge Cases and Security (4)
       ✓ should prevent self-transfers
       ✓ should handle zero amount transfers
       ✓ should prevent transfers to burn address
       ✓ should reject insufficient balance transfers

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  15:10:48
   Duration  942ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit

```
