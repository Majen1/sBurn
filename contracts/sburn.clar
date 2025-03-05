;; sBurn Coin - SIP-010 implementation with automatic fee distribution
;; Written by Majen 
;; Created: 2024

(impl-trait .trait-sip010.sip-010-trait)

;; Define the FT, with no maximum supply
(define-fungible-token sBurn-coin)

;; Define errors
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_INSUFFICIENT_TRANSFER (err u101))
(define-constant ERR_NOT_TOKEN_OWNER (err u102))
(define-constant ERR_INVALID_RECIPIENT (err u103))
(define-constant ERR_INSUFFICIENT_BALANCE (err u104)) ;; New error for insufficient balance

;; Define constants for contract
(define-constant CONTRACT_OWNER 'ST1Y0JZ5NGPR6E2S5GGWN3XFJ9SZ6R8K4M0QQ1V8X) ;; Your first Leather wallet address
(define-constant FEE_RECIPIENT 'ST1Y2465GZ3YNX9SA316W5SXSEQM21SBVPY3QNH1E) ;; Your second Leather wallet address
(define-constant BURN_ADDRESS 'ST14B9EJ6KECBQ17G5D13BKAT5AE32AVNYTHTGV7R) ;; Your third Leather wallet address
;; Real burn address for mainnet: 'SP000000000000000000002Q6VF78
(define-constant TOKEN_URI u"https://bafkreicy5mu34ikqd7e7rgarkf2hhipicfriw4krmabkiusjhua3sh2oyi.ipfs.flk-ipfs.xyz/")
(define-constant TOKEN_NAME "sBurn")
(define-constant TOKEN_SYMBOL "SBURN")
(define-constant TOKEN_DECIMALS u6)
(define-constant FEE_BASIS_POINTS u25) ;; 0.25% (25 basis points)
(define-constant MIN_TRANSFER_AMOUNT u1000000)

;; Storage Variables
(define-data-var total-burned uint u0)
(define-data-var total-fees-collected uint u0)

;; Fee Calculation Helper
(define-private (calculate-fee (amount uint))
    ;; 25 basis points = 0.25% = 25/10000
    (/ (* amount FEE_BASIS_POINTS) u10000))

;; SIP-010 Functions
(define-read-only (get-balance (account principal))
    (ok (ft-get-balance sBurn-coin account)))

(define-read-only (get-total-supply)
    (ok (ft-get-supply sBurn-coin)))

(define-read-only (get-name)
    (ok TOKEN_NAME))

(define-read-only (get-symbol)
    (ok TOKEN_SYMBOL))

(define-read-only (get-decimals)
    (ok TOKEN_DECIMALS))

(define-read-only (get-token-uri)
    (ok (some TOKEN_URI)))

;; Mint function - Owner Only
(define-public (mint (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
        (ft-mint? sBurn-coin amount recipient)))

;; Transfer Function with Fee Distribution (No Memo)
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (let (
        (fee (calculate-fee amount))
        (recipient-fee (/ fee u2))
        (burn-amount (- fee recipient-fee))
        (transfer-amount (- amount fee))  ;; This is correct - recipient gets amount minus total fees
    )
        ;; Ensure the sender has enough balance for the transfer + fee
        (let ((sender-balance (ft-get-balance sBurn-coin sender)))
            (asserts! (>= sender-balance (+ amount fee)) ERR_INSUFFICIENT_BALANCE)
        )
        
        ;; Ensure transfer amount is above the minimum allowed
        (asserts! (>= amount MIN_TRANSFER_AMOUNT) ERR_INSUFFICIENT_TRANSFER)
        (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
        
        ;; Ensure recipient is not the burn address
        (asserts! (not (is-eq recipient BURN_ADDRESS)) ERR_INVALID_RECIPIENT)
        
        ;; First do the main transfer to recipient
        (try! (ft-transfer? sBurn-coin transfer-amount sender recipient))
        ;; Then transfer fee portion to fee recipient
        (try! (ft-transfer? sBurn-coin recipient-fee sender FEE_RECIPIENT))
        ;; Finally transfer burn amount to burn address
        (try! (ft-transfer? sBurn-coin burn-amount sender BURN_ADDRESS))
        
        ;; Update total burned and total fees in one batch to save gas
        (var-set total-burned (+ (var-get total-burned) burn-amount))
        (var-set total-fees-collected (+ (var-get total-fees-collected) fee))
        
        (ok true)))

;; Additional Read-Only Functions
(define-read-only (get-total-burned)
    (ok (var-get total-burned)))

(define-read-only (get-burn-rate)
    (ok (/ FEE_BASIS_POINTS u2)))

(define-read-only (get-effective-supply)
    (ok (- (ft-get-supply sBurn-coin) (var-get total-burned))))

(define-read-only (get-total-fees-collected)
    (ok (var-get total-fees-collected)))




