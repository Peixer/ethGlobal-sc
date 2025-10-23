# PYUSDMock - ERC20 Mock Token

This is a mock ERC20 token implementation for testing PYUSD functionality. It mimics the behavior of PayPal USD (PYUSD) with 6 decimals.

## Features

- **Standard ERC20**: Full ERC20 token implementation
- **Mintable**: Owner can mint tokens to any address, anyone can mint to themselves
- **Burnable**: Users can burn their own tokens, owner can burn from any address
- **6 Decimals**: Matches PYUSD's decimal precision
- **Ownable**: Owner has special privileges for minting and burning

## Contract Details

- **Name**: PayPal USD Mock
- **Symbol**: PYUSDM
- **Decimals**: 6
- **Initial Supply**: 1,000,000 tokens (minted to deployer)

## Functions

### Public Functions
- `mint(uint256 amount)` - Mint tokens to msg.sender
- `burn(uint256 amount)` - Burn tokens from msg.sender
- Standard ERC20 functions: `transfer`, `approve`, `transferFrom`, etc.

### Owner-Only Functions
- `mint(address to, uint256 amount)` - Mint tokens to specific address
- `burnFrom(address from, uint256 amount)` - Burn tokens from specific address

## Usage Example

```typescript
// Deploy the mock token
const pyusdMock = await viem.deployContract("PYUSDMock", [
  "PayPal USD Mock", // name
  "PYUSDM",          // symbol
  6,                 // decimals
  1000000n * 10n ** 6n // initial supply
]);

// Mint tokens for testing
await pyusdMock.write.mint([1000000000n]); // Mint 1000 tokens

// Approve another contract to spend tokens
await pyusdMock.write.approve([contractAddress, 100000000n]); // Approve 100 tokens

// Transfer tokens
await pyusdMock.write.transfer([recipientAddress, 50000000n]); // Transfer 50 tokens
```

## Testing

Run the test suite:
```bash
npx hardhat test test/PYUSDMock.ts
```

## Deployment

The mock token is automatically deployed when running the PYUSDTransfer deployment script:

```bash
npx hardhat run scripts/deploy-pyrusd-transfer.ts --network localhost
```

## Important Notes

- This is a **MOCK** token for testing purposes only
- Do not use in production environments
- Replace with actual PYUSD token address for production deployments
- All amounts should be specified with 6 decimal places (e.g., 100000000n = 100.000000 tokens)
