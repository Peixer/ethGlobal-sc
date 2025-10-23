import { createDeploy } from "@nomicfoundation/hardhat-ignition";

// Testnet configuration
const TESTNET_CONFIG = {
  // PYUSD token address (update with actual testnet PYUSD address)
  PYUSD_TOKEN: "0x3456789012345678901234567890123456789012" // Mock PYUSD for testing
};

const PYUSDTransferDeploy = createDeploy("PYUSDTransfer", {
  args: [
    TESTNET_CONFIG.PYUSD_TOKEN
  ]
});

export default PYUSDTransferDeploy;
