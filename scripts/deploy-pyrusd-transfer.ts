import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  
  console.log("Deploying PYUSDMock token...");
  
  // Deploy mock PYUSD token first
  const pyusdMock = await viem.deployContract("PYUSDMock", [
    "PayPal USD Mock", // name
    "PYUSDM", // symbol
    6, // decimals (PYUSD uses 6 decimals)
    1000000n * 10n ** 6n // initial supply: 1M tokens
  ]);
  
  console.log(`PYUSDMock deployed to: ${pyusdMock.address}`);
  
  console.log("Deploying PYUSDTransfer contract...");
  
  // Deploy the PYUSDTransfer contract with mock token address
  const pyusdTransfer = await viem.deployContract("PYUSDTransfer", [
    pyusdMock.address
  ]);
  
  console.log(`PYUSDTransfer deployed to: ${pyusdTransfer.address}`);
  
  // Get wallet clients
  const [owner] = await viem.getWalletClients();
  
  console.log("\n=== Contract Information ===");
  console.log(`Owner: ${owner.account.address}`);
  console.log(`PYUSD Mock Token: ${pyusdMock.address}`);
  console.log(`PYUSD Transfer Contract: ${pyusdTransfer.address}`);
  
  // Get token info
  const tokenName = await pyusdMock.read.name();
  const tokenSymbol = await pyusdMock.read.symbol();
  const tokenDecimals = await pyusdMock.read.decimals();
  const ownerBalance = await pyusdMock.read.balanceOf([owner.account.address]);
  
  console.log("\n=== Token Information ===");
  console.log(`Name: ${tokenName}`);
  console.log(`Symbol: ${tokenSymbol}`);
  console.log(`Decimals: ${tokenDecimals}`);
  console.log(`Owner Balance: ${ownerBalance} ${tokenSymbol}`);
  
  console.log("\n=== Usage ===");
  console.log("1. Mint tokens for testing:");
  console.log("await pyusdMock.write.mint([amount]);");
  console.log("2. Approve the transfer contract:");
  console.log("await pyusdMock.write.approve([pyusdTransfer.address, amount]);");
  console.log("3. Transfer PYUSD:");
  console.log("await pyusdTransfer.write.transferPYUSD([recipientAddress, amount, orderId]);");
  
  console.log("\n=== Example ===");
  console.log("Mint 1000 PYUSD tokens:");
  console.log("await pyusdMock.write.mint([1000000000n]); // 1000 tokens with 6 decimals");
  console.log("Approve 100 PYUSD for transfer:");
  console.log("await pyusdMock.write.approve([pyusdTransfer.address, 100000000n]);");
  console.log("Transfer 100 PYUSD to address 0x123... with order ID 123:");
  console.log("await pyusdTransfer.write.transferPYUSD([\"0x123...\", 100000000n, 123n]);");
  
  console.log("\n=== Important Notes ===");
  console.log("- This is a MOCK token for testing purposes");
  console.log("- Users must approve the contract to spend their PYUSD tokens first");
  console.log("- Each orderId can only be used once");
  console.log("- Amount should be in PYUSD token units (6 decimals)");
  console.log("- Recipient address cannot be zero address");
  console.log("- Only the contract owner can call emergencyWithdraw");
  
  console.log("\n=== Next Steps ===");
  console.log("1. Mint tokens for testing");
  console.log("2. Test the transfer functionality");
  console.log("3. Replace with actual PYUSD token address for production");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
