# 🚀 PYUSD Transfer Smart Contract

<div align="center">
  <h1 align="center">
    <img src="https://github.com/Peixer/ethGlobal-sc/blob/ecd2aaf948b2e4df6871792112aaf4c008819a33/logo.png" alt="Atlas Logo" width="200">
  </h1> 
  <h3>◦ Buy, manage, and use consumption cards seamlessly at the festival. Powered by blockchain for instant, secure transactions.</h3>
</div>

> **A secure, efficient smart contract for PYUSD token transfers with order tracking and duplicate prevention**

Built for **ETHGlobal Hackathon** using Hardhat 3 Beta, TypeScript, and modern Ethereum development tools.

## 🎯 Project Overview

The **PYUSD Transfer Contract** is a production-ready smart contract that enables secure PYUSD token transfers with built-in order ID tracking to prevent duplicate transactions. This contract is designed for integration with payment systems, e-commerce platforms, and financial applications.

### ✨ Key Features

- **🔒 Secure Token Transfers**: Safe PYUSD token transfers using OpenZeppelin's SafeERC20
- **📋 Order ID Tracking**: Prevents duplicate order processing with unique order ID system
- **🛡️ Access Control**: Owner-only emergency functions with OpenZeppelin's Ownable
- **✅ Input Validation**: Comprehensive parameter validation for security
- **📊 Event Logging**: Detailed event emission for transaction tracking
- **🧪 Fully Tested**: Complete test suite with 11/11 tests passing

## 🏗️ Contract Architecture

### Core Functions

| Function | Purpose | Access |
|----------|---------|--------|
| `transferPYUSD()` | Transfer PYUSD with order tracking | Public |
| `isOrderIdUsed()` | Check if order ID exists | Public |
| `getContractInfo()` | Get contract configuration | Public |
| `emergencyWithdraw()` | Emergency token recovery | Owner Only |

### Security Features

- **Order ID Protection**: Each order ID can only be used once
- **Input Validation**: Zero address and amount validation
- **Safe Token Operations**: Uses SafeERC20 for secure transfers
- **Access Control**: Owner-only emergency functions
- **Event Logging**: Complete transaction audit trail

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Hardhat 3 Beta
- TypeScript
- Ethereum wallet with testnet funds

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ethGlobal-sc

# Install dependencies
npm install

# Compile contracts
npx hardhat compile
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run specific test suites
npx hardhat test test/PYUSDTransfer.ts
npx hardhat test test/PYUSDMock.ts
```

**Test Results**: ✅ 11/11 tests passing
- Deployment & Configuration
- Order ID Management  
- Input Validation
- Access Control
- Contract Information

## 📋 Usage Examples

### Basic Transfer Flow

```typescript
// 1. Approve contract to spend PYUSD tokens
await pyusdToken.write.approve([
  contractAddress, 
  amount
]);

// 2. Transfer PYUSD with order tracking
await pyusdTransfer.write.transferPYUSD([
  recipientAddress,    // Address to receive tokens
  amount,             // Amount in PYUSD units (6 decimals)
  orderId             // Unique order identifier
]);
```

### Check Order Status

```typescript
// Check if order ID has been used
const isUsed = await pyusdTransfer.read.isOrderIdUsed([orderId]);
console.log(`Order ${orderId} used: ${isUsed}`);
```

### Contract Information

```typescript
// Get contract configuration
const contractInfo = await pyusdTransfer.read.getContractInfo();
console.log(`PYUSD Token: ${contractInfo}`);
```

## 🌐 Deployment

### Local Development

```bash
# Deploy to local Hardhat network
npx hardhat run scripts/deploy-pyrusd-transfer.ts --network localhost
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-pyrusd-transfer-testnet.ts --network sepolia
```

### Production Deployment

1. Update `ignition/modules/PYUSDTransfer.ts` with production PYUSD address
2. Deploy using Hardhat Ignition:

```bash
npx hardhat ignition deploy ignition/modules/PYUSDTransfer.ts --network mainnet
```

## 🔧 Configuration

### Environment Variables

```bash
# Set your private key for deployment
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

### Contract Configuration

Update the PYUSD token address in `ignition/modules/PYUSDTransfer.ts`:

```typescript
const TESTNET_CONFIG = {
  PYUSD_TOKEN: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" // PYUSD testnet address
};
```

### Deployed Contract Addresses

**Testnet Deployment:**
- **PYUSD Token**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **PYUSD Transfer Contract**: `0x178f726de574954f4fdeb6c03a6f360ac5f84df2`

## 📊 Contract Events

The contract emits detailed events for monitoring and analytics:

```solidity
event TransferExecuted(
    address indexed sender,
    address indexed recipient, 
    uint256 amount,
    uint256 orderId,
    uint256 timestamp
);

event OrderIdUsed(
    uint256 orderId,
    address indexed sender,
    uint256 timestamp
);
```
 
## 🧪 Testing Strategy

Our comprehensive test suite covers:

- ✅ Contract deployment and initialization
- ✅ Order ID tracking and duplicate prevention
- ✅ Input validation and error handling
- ✅ Access control and permissions
- ✅ Token transfer functionality
- ✅ Emergency functions

## 📈 Performance Metrics

- **Gas Optimized**: Efficient storage and computation
- **Event Efficient**: Minimal event emissions
- **Storage Efficient**: Optimized mapping usage
- **Batch Compatible**: Ready for batch operations

## 🔮 Future Enhancements

- [ ] Batch transfer functionality
- [ ] Multi-signature support
- [ ] Time-locked transfers
- [ ] Fee management system
- [ ] Integration with payment processors

## 📚 Technical Stack

- **Solidity**: ^0.8.28
- **Hardhat**: 3 Beta with TypeScript
- **OpenZeppelin**: Security-focused libraries
- **Viem**: Modern Ethereum library
- **Node.js Test**: Native testing framework
 

## 📄 License

MIT License - see LICENSE file for details
 

**Built with ❤️ for the Ethereum ecosystem**
