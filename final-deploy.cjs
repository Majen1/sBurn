// sBurn Token Final Deployment Script
// This is a streamlined script for reliable deployment 

const fs = require("fs");
const { 
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  createStacksPrivateKey,
  getAddressFromPrivateKey,
  TransactionVersion
} = require("@stacks/transactions");
const { StacksTestnet } = require("@stacks/network");
const bip39 = require("bip39");
const { HDKey } = require("@scure/bip32");

console.log("=== sBurn Token Final Deployment ===");

// Read contract source
const contractSource = fs.readFileSync("./contracts/sburn.clar").toString();
const contractName = "sburn-token"; // Using a new, clean name
const network = new StacksTestnet();
network.coreApiUrl = "https://stacks-node-api.testnet.stacks.co";

// Get mnemonic from environment
const mnemonic = process.env.STACKS_DEPLOYER_MNEMONIC;
if (!mnemonic) {
  console.error("Error: STACKS_DEPLOYER_MNEMONIC not set");
  console.log("Set it using: $env:STACKS_DEPLOYER_MNEMONIC=\"your mnemonic phrase\"");
  process.exit(1);
}

// Convert mnemonic to seed
console.log("Deriving keys from mnemonic...");
const seed = bip39.mnemonicToSeedSync(mnemonic);
const hdKey = HDKey.fromMasterSeed(seed);
const childKey = hdKey.derive("m/44'/5757'/0'/0/0"); // Standard path for Stacks

// Get private key
const pvtKey = createStacksPrivateKey(Buffer.from(childKey.privateKey).toString('hex'));

// Get address from private key
const address = getAddressFromPrivateKey(
  pvtKey.data,
  TransactionVersion.Testnet
);

console.log(`Using address for deployment: ${address}`);
console.log(`Deploying contract: ${contractName}`);
console.log(`Contract owner (from contract): 'ST1D5T4V67KDJ96GA1BR5728AJ2HDBWZH63Y0WTXG'`);

// Deploy the contract
async function deployContract() {
  try {
    console.log("Preparing contract deployment...");
    
    // Higher fee to ensure processing
    const txOptions = {
      contractName,
      codeBody: contractSource,
      senderKey: pvtKey.data,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 100000, // Higher fee (0.1 STX) for faster confirmation
      clarityVersion: 2, // Explicitly set Clarity version
      nonce: undefined // Let the API determine the nonce
    };

    console.log("Creating contract deployment transaction...");
    const transaction = await makeContractDeploy(txOptions);
    
    console.log("Broadcasting transaction to Stacks testnet...");
    console.log("This may take a minute...");
    const result = await broadcastTransaction(transaction, network);
    
    if (result.hasOwnProperty("error")) {
      console.error("Error broadcasting transaction:", result);
      process.exit(1);
    } else {
      console.log("\n=== Transaction broadcast successfully! ===");
      console.log(`Contract: ${contractName}`);
      console.log(`Contract Address: ${address}.${contractName}`);
      console.log(`Transaction ID: ${result.txid}`);
      console.log(`View transaction: https://explorer.stacks.co/txid/${result.txid}?chain=testnet`);
      console.log("\nImportant next steps:");
      console.log("1. Wait for transaction to confirm (typically 15-20 minutes)");
      console.log("2. Visit the link above to verify deployment");
      console.log("3. After confirmation, use your Leather wallet to mint tokens");
    }
  } catch (e) {
    console.error("Failed to deploy contract:", e);
    process.exit(1);
  }
}

// Execute deployment
deployContract()
  .then(() => console.log("Deployment process completed"))
  .catch(err => console.error("Deployment failed:", err));
