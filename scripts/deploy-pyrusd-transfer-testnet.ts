import { network } from "hardhat";
import { getContract, PublicClient, Abi } from 'viem'
// import abi from './PYUSD.json'
import { erc20Abi } from 'viem'

async function main() {
  const { viem } = await network.connect(); 
  console.log("Deploying pyusdTestnet token..."); 

  const pyusdTestnet = await getContract({
    address: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
    abi: erc20Abi,
    client: await viem.getPublicClient() as PublicClient,
  });
  
  console.log(`pyusdTestnet deployed to: ${pyusdTestnet.address}`);
  
  console.log("Deploying PYUSDTransfer contract...");
  
  // Deploy the PYUSDTransfer contract with PYUSD token address
  // const pyusdTransfer = await viem.deployContract("PYUSDTransfer", [
  //   pyusdTestnet.address
  // ]);
  // READ an existing contract
  const pyusdTransfer = await viem.getContractAt("PYUSDTransfer", "0x178f726de574954f4fdeb6c03a6f360ac5f84df2");
  
  console.log(`PYUSDTransfer deployed to: ${pyusdTransfer.address}`);
  
  // Get wallet clients
  const [owner, accountB] = await viem.getWalletClients();
  
  console.log("\n=== Contract Information ===");
  console.log(`Owner (Account A): ${owner.account.address}`);
  console.log(`Account B: ${accountB.account.address}`);
  console.log(`PYUSD Mock Token: ${pyusdTestnet.address}`);
  console.log(`PYUSD Transfer Contract: ${pyusdTransfer.address}`);
  
  // Get token info
  const tokenName = await pyusdTestnet.read.name();
  const tokenSymbol = await pyusdTestnet.read.symbol();
  const tokenDecimals = await pyusdTestnet.read.decimals();
  const ownerBalance = await pyusdTestnet.read.balanceOf([owner.account.address]);
  
  console.log("\n=== Token Information ===");
  console.log(`Name: ${tokenName}`);
  console.log(`Symbol: ${tokenSymbol}`);
  console.log(`Decimals: ${tokenDecimals}`);
  console.log(`Owner Balance: ${ownerBalance} ${tokenSymbol}`);
  
  // Transfer 10 pyusdTestnet tokens to Account B
  const transferAmount = 10n * 10n ** 6n; // 10 tokens with 6 decimals
  console.log(`\n=== Transferring ${transferAmount / 10n ** 6n} ${tokenSymbol} to Account B ===`);
  
  const transferTx = await pyusdTestnet.write.transfer([accountB.account.address, transferAmount], {
    account: accountB.account,
    chain: undefined
  });
  console.log(`Transfer transaction hash: ${transferTx}`);
  
  // Check balances after transfer
  const ownerBalanceAfter = await pyusdTestnet.read.balanceOf([owner.account.address]);
  const accountBBalance = await pyusdTestnet.read.balanceOf([accountB.account.address]);
  
  console.log(`Owner Balance After Transfer: ${ownerBalanceAfter} ${tokenSymbol}`);
  console.log(`Account B Balance: ${accountBBalance} ${tokenSymbol}`);
  
  // Now demonstrate the PYUSDTransfer contract functionality
  console.log(`\n=== Demonstrating PYUSDTransfer Contract ===`);
  
  // Account B approves the transfer contract to spend 5 tokens
  const approveAmount = 5n * 10n ** 6n; // 5 tokens with 6 decimals
  console.log(`Account B approving ${approveAmount / 10n ** 6n} ${tokenSymbol} for transfer contract...`);
  
  const approveTx = await pyusdTestnet.write.approve([pyusdTransfer.address, approveAmount], {
    account: accountB.account,
    chain: undefined
  });
  console.log(`Approve transaction hash: ${approveTx}`);
  
  // Check allowance
  const allowance = await pyusdTestnet.read.allowance([accountB.account.address, pyusdTransfer.address]);
  console.log(`Allowance granted: ${allowance} ${tokenSymbol}`);
  
  // Execute transfer from Account B to Account A using the contract
  const transferContractAmount = 3n * 10n ** 6n; // 3 tokens with 6 decimals
  const orderId = 12345n; // Unique order ID
  
  console.log(`\nExecuting transfer of ${transferContractAmount / 10n ** 6n} ${tokenSymbol} from Account B to Account A via contract...`);
  console.log(`Order ID: ${orderId}`);
  
  const contractTransferTx = await pyusdTransfer.write.transferPYUSD([
    owner.account.address, // recipient (Account A)
    transferContractAmount,
    orderId
  ], {
    account: accountB.account
  });
  console.log(`Contract transfer transaction hash: ${contractTransferTx}`);
  
  // Check final balances
  const finalOwnerBalance = await pyusdTestnet.read.balanceOf([owner.account.address]);
  const finalAccountBBalance = await pyusdTestnet.read.balanceOf([accountB.account.address]);
  const remainingAllowance = await pyusdTestnet.read.allowance([accountB.account.address, pyusdTransfer.address]);
  
  console.log(`\n=== Final Balances ===`);
  console.log(`Account A (Owner) Final Balance: ${finalOwnerBalance} ${tokenSymbol}`);
  console.log(`Account B Final Balance: ${finalAccountBBalance} ${tokenSymbol}`);
  console.log(`Remaining Allowance: ${remainingAllowance} ${tokenSymbol}`);
  
  // Check if order ID was used
  const isOrderIdUsed = await pyusdTransfer.read.isOrderIdUsed([orderId]);
  console.log(`Order ID ${orderId} used: ${isOrderIdUsed}`);
  
  console.log("\n=== Usage ===");
  console.log("1. Mint tokens for testing:");
  console.log("await pyusdTestnet.write.mint([amount]);");
  console.log("2. Approve the transfer contract:");
  console.log("await pyusdTestnet.write.approve([pyusdTransfer.address, amount]);");
  console.log("3. Transfer PYUSD:");
  console.log("await pyusdTransfer.write.transferPYUSD([recipientAddress, amount, orderId]);");
  
  console.log("\n=== Example ===");
  console.log("Mint 1000 PYUSD tokens:");
  console.log("await pyusdTestnet.write.mint([1000000000n]); // 1000 tokens with 6 decimals");
  console.log("Transfer tokens to another account:");
  console.log("await pyusdTestnet.write.transfer([recipientAddress, 100000000n]); // 100 tokens");
  console.log("Approve 100 PYUSD for transfer:");
  console.log("await pyusdTestnet.write.approve([pyusdTransfer.address, 100000000n]);");
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
  console.log("1. ✅ Tokens transferred to Account B");
  console.log("2. ✅ Transfer contract functionality demonstrated");
  console.log("3. Replace with actual PYUSD token address for production");
  console.log("4. Deploy to testnet/mainnet as needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
