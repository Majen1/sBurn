// sBurn Token Contract Verification Script
// This script checks if the contract is deployed and ready to interact with

const { 
  callReadOnlyFunction,
  cvToValue
} = require("@stacks/transactions");
const { StacksTestnet } = require("@stacks/network");
const fetch = require("node-fetch");

// Configuration
const CONTRACT_ADDRESS = process.argv[2] || 'ST1HJBP42BAG96ZN0VF6N4ZET178PN3DHJKWRJKKY';
const CONTRACT_NAME = process.argv[3] || 'sburn-v2';
const NETWORK = new StacksTestnet({ url: 'https://stacks-node-api.testnet.stacks.co' });

async function checkContractDeployment() {
  console.log(`Checking contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  
  try {
    // Step 1: Check if the contract exists in the API
    const contractUrl = `https://stacks-node-api.testnet.stacks.co/v2/contracts/interface/${CONTRACT_ADDRESS}/${CONTRACT_NAME}`;
    console.log(`Fetching contract interface from: ${contractUrl}`);
    
    const response = await fetch(contractUrl);
    const data = await response.json();
    
    if (response.status !== 200) {
      console.error("Contract not found or not properly deployed:", data);
      return false;
    }
    
    console.log("Contract found! Checking functions...");
    
    // Step 2: Check for expected functions
    const functions = data.functions || [];
    console.log(`Found ${functions.length} functions in the contract:`);
    functions.forEach(func => {
      console.log(`- ${func.name} (${func.access === 'read_only' ? 'read-only' : 'public'})`);
    });
    
    // Step 3: Try to call a read-only function, e.g., get-name
    if (functions.some(f => f.name === 'get-name')) {
      console.log("\nAttempting to call get-name function...");
      try {
        const nameResult = await callReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-name',
          functionArgs: [],
          network: NETWORK,
          senderAddress: CONTRACT_ADDRESS,
        });
        
        const name = cvToValue(nameResult).value;
        console.log(`Success! Token name: ${name}`);
        return true;
      } catch (error) {
        console.error("Error calling get-name function:", error);
        return false;
      }
    } else {
      console.log("\nWarning: get-name function not found in contract!");
      return false;
    }
    
  } catch (error) {
    console.error("Error checking contract:", error);
    return false;
  }
}

// Run the check
checkContractDeployment()
  .then(isReady => {
    if (isReady) {
      console.log("\n✅ Contract is successfully deployed and ready to use!");
      console.log("You can now use your Leather wallet to mint tokens.");
    } else {
      console.log("\n❌ Contract is not ready to use.");
      console.log("Please check your deployment or try deploying again.");
    }
  })
  .catch(error => {
    console.error("Error in verification process:", error);
  });
