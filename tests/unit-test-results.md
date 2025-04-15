TERMINAL - npm run test


RERUN  tests/sburn.test.ts x4

(node:3724) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:3724) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
 ✓ tests/sburn.test.ts (15)
   ✓ sBurn2 tests (15)
     ✓ Token Metadata (5)
       ✓ should have correct name
       ✓ should have correct symbol
       ✓ should have correct decimals
       ✓ should have correct token URI
       ✓ should have correct burn rate
     ✓ Token Operations (3)
       ✓ should fail minting tokens when not contract owner
       ✓ should report zero initial supply
       ✓ should fail transfer with insufficient balance
     ✓ Transfer Restrictions (3)
       ✓ should reject transfers below minimum amount
       ✓ should reject transfers to burn address
       ✓ should reject unauthorized transfers
     ✓ Fee Calculation (1)
       ✓ should accurately calculate fees and burns
     ✓ System Metadata (3)
       ✓ should report correct metadata
       ✓ should report zero for effective supply initially
       ✓ should report zero for initial burned amounts

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  16:14:17
   Duration  358ms


 PASS  Waiting for file changes...
       press h to show help, press q to quit
