# PYUSD Transfer Contract

A simple smart contract that transfers PYUSD testnet tokens to a specified recipient wallet with order ID tracking.

## Features

- **Simple Transfer**: Transfers PYUSD tokens to a recipient wallet
- **Order ID Tracking**: Prevents duplicate order IDs from being used
- **Three Parameters**: Requires `recipient`, `amount`, and `orderId` parameters
- **Security**: Includes access controls and input validation
- **Testnet Ready**: Configured for testnet deployment

## Contract Functions

### `transferPYUSD(address recipient, uint256 amount, uint256 orderId)`
Transfers PYUSD tokens from the caller to the specified recipient wallet.

**Parameters:**
- `recipient`: Address to receive PYUSD tokens
- `amount`: Amount of PYUSD to transfer (in token units)
- `orderId`: Unique order identifier (prevents duplicates)

**Requirements:**
- User must have approved the contract to spend their PYUSD tokens
- Recipient address cannot be zero address
- Amount must be greater than 0
- Order ID must not have been used before

### `isOrderIdUsed(uint256 orderId)`
Checks if an order ID has already been used.

**Returns:** `true` if order ID has been used, `false` otherwise

### `getContractInfo()`
Returns contract configuration information.

**Returns:** 
- `pyusdToken`: PYUSD token address

## Events

- `TransferExecuted`: Emitted when a transfer is executed (includes sender, recipient, amount, orderId, timestamp)
- `OrderIdUsed`: Emitted when an order ID is marked as used

## Deployment

1. **Update Configuration**: Edit `ignition/modules/PYUSDTransfer.ts` with your PYUSD token address:
   ```typescript
   const TESTNET_CONFIG = {
     PYUSD_TOKEN: "0x..." // Your PYUSD testnet address
   };
   ```

2. **Deploy Contract**:
   ```bash
   npx hardhat run scripts/deploy-pyrusd-transfer.ts --network sepolia
   ```

## Usage Example

```javascript
// First, approve the contract to spend PYUSD tokens
await pyusdToken.approve(contractAddress, amount);

// Then transfer PYUSD with recipient address and order ID
await pyusdTransfer.transferPYUSD(recipientAddress, amount, orderId);
```

## Testing

Run the test suite:
```bash
npx hardhat test test/PYUSDTransfer.ts
```

All tests pass (11/11) covering:
- Deployment and configuration
- Order ID management
- Input validation
- Access control
- Contract information

## Security Features

- **Ownable**: Only owner can call emergency functions
- **Input Validation**: Validates all input parameters
- **Order ID Protection**: Prevents duplicate order ID usage
- **SafeERC20**: Safe token transfer operations

## Important Notes

- Users must approve the contract to spend their PYUSD tokens before calling `transferPYUSD`
- Each order ID can only be used once
- Amount should be in PYUSD token units (typically 6 decimals)
- Only the contract owner can call `emergencyWithdraw`

## License

MIT License
