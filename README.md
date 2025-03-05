# 🔥 sBurn Token (SBURN)

A deflationary token built on the Stacks blockchain that automatically burns tokens with every transaction, creating natural scarcity over time.

## 💡 What is sBurn?

sBurn is a smart token that implements two key mechanisms on every transfer:
- **Auto-Burning**: Permanently removes tokens from circulation
- **Maintenance Fee**: Supports ongoing development and maintenance

Think of it like a self-managing cryptocurrency that gets more scarce over time!

## ⚙️ How It Works

Every time SBURN tokens are transferred:
1. A tiny 0.25% fee is taken from the transfer amount
2. Half of that fee (0.125%) is **permanently burned** 🔥
3. The other half (0.125%) goes to the contract owner for maintenance and development
4. The rest reaches its destination normally

For example, if you send 1000 SBURN:
- 2.5 SBURN is the total fee
- 1.25 SBURN gets burned forever
- 1.25 SBURN goes to maintenance/development
- 997.5 SBURN arrives at the destination

## ✨ Key Features

### Core Mechanics
- 🔥 **Deflationary**: Total supply decreases with every transaction
- 💎 **Store of Value**: Designed for long-term value appreciation
- 🔒 **SIP-010 Compliant**: Follows Stacks' standard token protocol
- 🛡️ **Secure**: Thoroughly tested smart contract

### Token Economics
- 📊 **Supply Tracking**: Real-time monitoring of burned tokens
- 💫 **Minimum Transfer**: 1.0 SBURN (prevents dust transactions)
- 🎯 **Precision**: 6 decimal places for accurate calculations
- 📈 **Transparency**: All burns are public and verifiable

## 🔍 Technical Details

### Token Specifications
```
Name: sBurn Token
Symbol: SBURN
Decimals: 6
Minimum Transfer: 1.0 SBURN
Total Fee: 0.25% per transfer
Burn Rate: 0.125% per transfer
Maintenance Fee: 0.125% per transfer
```

### Smart Contract Functions

#### 📖 Read-Only Functions
| Function | Description |
|----------|-------------|
| `get-name` | Returns "sBurn Token" |
| `get-symbol` | Returns "SBURN" |
| `get-decimals` | Returns 6 |
| `get-balance` | Shows tokens held by an address |
| `get-total-supply` | Shows current total supply |
| `get-total-burned` | Shows amount of burned tokens |
| `get-effective-supply` | Shows circulating supply (excluding burns) |

#### ⚡ Public Functions
| Function | Description |
|----------|-------------|
| `transfer` | Send tokens with automatic burn & fee |
| `mint` | Create new tokens (restricted to owner) |


## 📝 Usage Examples

### Basic Transfer
```clarity
;; Transfer 1000 SBURN tokens
(contract-call? .sburn transfer 
    u1000000000     ;; Amount (with 6 decimals)
    tx-sender       ;; From
    'RECIPIENT      ;; To
    none)          ;; Memo (optional)
```



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ on Stacks
