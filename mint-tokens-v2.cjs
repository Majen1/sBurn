// Mint Initial sBurn Tokens for the v2 contract
// This script mints an initial supply of sBurn tokens for the v2 contract

const { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion
} = require("@stacks/transactions");
const { StacksTestnet } = require("@stacks/network");
const bip39 = require("bip39");
const { HDKey } = require("@scure/bip32");

// Configuration
const CONTRACT_ADDRESS = 'ST1HJBP42BAG96ZN0VF6N4ZET178PN3DHJKWRJKKY'; // Derived from mnemonic
const CONTRACT_NAME = 'sburn-v2'; // Updated contract name
const FUNCTION_NAME = 'mint';
// Amount to mint (adjust as needed)
// Default: 10,000,000 tokens with 8 decimals = 1,000,000,000,000
const MINT_AMOUNT = '1000000000000'; 
const network = new StacksTestnet({ url: 'https://stacks-node-api.testnet.stacks.co' });

// Get mnemonic from environment
const mnemonic = process.env.STACKS_DEPLOYER_MNEMONIC;
if (!mnemonic) {
  console.error("Error: STACKS_DEPLOYER_MNEMONIC environment variable not set");
  console.log("Set it using: $env:STACKS_DEPLOYER_MNEMONIC='your mnemonic phrase'");
  process.exit(1);
}

// Convert mnemonic to seed
console.log("Deriving keys from mnemonic...");
const seed = bip39.mnemonicToSeedSync(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);
const childKey = hdKey.derive("m/44'/5757'/0'/0/0");

// Get private key
const pvtKey = createStacksPrivateKey(Buffer.from(childKey.privateKey).toString('hex'));

// Get address from private key
const address = getAddressFromPrivateKey(
  pvtKey.data,
  TransactionVersion.Testnet
);

console.log(`Using address: ${address}`);
console.log(`Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
console.log(`Minting ${MINT_AMOUNT} tokens (${parseInt(MINT_AMOUNT) / 100000000} with decimals)`);

async function mintTokens() {
  try {
    console.log("Preparing mint transaction...");
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: FUNCTION_NAME,
      functionArgs: [uintCV(MINT_AMOUNT)],
      senderKey: pvtKey.data,
      validateWithAbi: false,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 10000 // adjust if needed
    };

    const transaction = await makeContractCall(txOptions);
    console.log("Broadcasting mint transaction to Stacks testnet...");
    const result = await broadcastTransaction(transaction, network);
    
    if (result.hasOwnProperty("error")) {
      console.error("Error broadcasting transaction:", result);
      process.exit(1);
    } else {
      console.log("Mint transaction broadcast successfully!");
      console.log(`Transaction ID: ${result.txid}`);
      console.log(`View transaction: https://explorer.stacks.co/txid/${result.txid}?chain=testnet`);
    }
  } catch (e) {
    console.error("Failed to mint tokens:", e);
    process.exit(1);
  }
}

// Execute token minting
mintTokens()
  .then(() => console.log("Token minting process completed"))
  .catch(err => console.error("Token minting failed:", err));
