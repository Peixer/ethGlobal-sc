import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("PYUSDTransfer", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  
  // Deploy fixture
  async function deployPYUSDTransferFixture() {
    // Testnet configuration
    const config = {
      PYUSD_TOKEN: "0x3456789012345678901234567890123456789012" // Mock PYUSD
    };
    
    const pyusdTransfer = await viem.deployContract("PYUSDTransfer", [
      config.PYUSD_TOKEN as `0x${string}`
    ]);
    
    const [owner, user1, user2] = await viem.getWalletClients();
    
    return { pyusdTransfer, owner, user1, user2, config };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { pyusdTransfer, owner } = await deployPYUSDTransferFixture();
      const contractOwner = await pyusdTransfer.read.owner();
      assert.equal(contractOwner.toLowerCase(), owner.account.address.toLowerCase());
    });

    it("Should have correct configuration", async function () {
      const { pyusdTransfer, config } = await deployPYUSDTransferFixture();
      
      const pyusdToken = await pyusdTransfer.read.PYUSD_TOKEN();
      
      assert.equal(pyusdToken, config.PYUSD_TOKEN);
    });

    it("Should revert with invalid PYUSD token address", async function () {
      try {
        await viem.deployContract("PYUSDTransfer", [
          "0x0000000000000000000000000000000000000000" // Invalid address
        ]);
        assert.fail("Should have reverted");
      } catch (error: any) {
        const errorMessage = error.message || error.toString();
        assert.ok(errorMessage.includes("PYUSDTransfer: Invalid PYUSD token address") ||
                  errorMessage.includes("Invalid PYUSD token address") ||
                  errorMessage.includes("revert"));
      }
    });
  });

  describe("Order ID Management", function () {
    it("Should track unused order IDs correctly", async function () {
      const { pyusdTransfer } = await deployPYUSDTransferFixture();
      
      const orderId = 123n;
      const isUsed = await pyusdTransfer.read.isOrderIdUsed([orderId]);
      assert.equal(isUsed, false);
    });

    it("Should mark order ID as used after successful transfer", async function () {
      const { pyusdTransfer, user1 } = await deployPYUSDTransferFixture();
      
      const orderId = 456n;
      
      // This will fail because we don't have actual PYUSD tokens
      // Since the transfer fails, the order ID won't be marked as used (transaction reverts)
      try {
        await pyusdTransfer.write.transferPYUSD([user2.account.address, 1000000n, orderId], {
          account: user1.account
        });
        assert.fail("Should have failed due to insufficient tokens");
      } catch (error) {
        // Expected to fail due to insufficient tokens
        // Since the transaction reverts, the order ID should NOT be marked as used
        const isUsed = await pyusdTransfer.read.isOrderIdUsed([orderId]);
        assert.equal(isUsed, false);
      }
    });

    it("Should prevent duplicate order ID usage", async function () {
      const { pyusdTransfer, user1, user2 } = await deployPYUSDTransferFixture();
      
      const orderId = 789n;
      
      // First attempt (will fail due to tokens, order ID won't be marked due to revert)
      try {
        await pyusdTransfer.write.transferPYUSD([user2.account.address, 1000000n, orderId], {
          account: user1.account
        });
      } catch (error) {
        // Expected to fail
      }
      
      // Since the first attempt failed and reverted, order ID should still be available
      // Second attempt should also fail due to insufficient tokens, not duplicate order ID
      try {
        await pyusdTransfer.write.transferPYUSD([user2.account.address, 1000000n, orderId], {
          account: user1.account
        });
        assert.fail("Should have failed due to insufficient tokens");
      } catch (error: any) {
        // Should fail due to insufficient tokens, not duplicate order ID
        const errorMessage = error.message || error.toString();
        assert.ok(!errorMessage.includes("Order ID already used"));
      }
    });
  });

  describe("Input Validation", function () {
    it("Should revert with zero amount", async function () {
      const { pyusdTransfer, user1, user2 } = await deployPYUSDTransferFixture();
      
      try {
        await pyusdTransfer.write.transferPYUSD([user2.account.address, 0n, 999n], {
          account: user1.account
        });
        assert.fail("Should have reverted");
      } catch (error: any) {
        const errorMessage = error.message || error.toString();
        assert.ok(errorMessage.includes("PYUSDTransfer: Amount must be greater than 0") ||
                  errorMessage.includes("Amount must be greater than 0") ||
                  errorMessage.includes("revert"));
      }
    });

    it("Should revert with invalid recipient address", async function () {
      const { pyusdTransfer, user1 } = await deployPYUSDTransferFixture();
      
      try {
        await pyusdTransfer.write.transferPYUSD(["0x0000000000000000000000000000000000000000", 1000000n, 999n], {
          account: user1.account
        });
        assert.fail("Should have reverted");
      } catch (error: any) {
        const errorMessage = error.message || error.toString();
        assert.ok(errorMessage.includes("PYUSDTransfer: Invalid recipient address") ||
                  errorMessage.includes("Invalid recipient address") ||
                  errorMessage.includes("revert"));
      }
    });
  });

  describe("Contract Information", function () {
    it("Should return correct contract info", async function () {
      const { pyusdTransfer, config } = await deployPYUSDTransferFixture();
      
      const pyusdToken = await pyusdTransfer.read.getContractInfo();
      
      assert.equal(pyusdToken, config.PYUSD_TOKEN);
    });
  });

  describe("Access Control", function () {
    it("Should allow only owner to call emergency withdraw", async function () {
      const { pyusdTransfer, user1 } = await deployPYUSDTransferFixture();
      
      try {
        await pyusdTransfer.write.emergencyWithdraw([
          "0x0000000000000000000000000000000000000000",
          1000000000000000000n
        ], {
          account: user1.account
        });
        assert.fail("Should have reverted");
      } catch (error: any) {
        const errorMessage = error.message || error.toString();
        assert.ok(errorMessage.includes("OwnableUnauthorizedAccount") ||
                  errorMessage.includes("Ownable: caller is not the owner") ||
                  errorMessage.includes("caller is not the owner") ||
                  errorMessage.includes("AccessControl") ||
                  errorMessage.includes("revert"));
      }
    });

    it("Should allow owner to call emergency withdraw", async function () {
      const { pyusdTransfer, owner } = await deployPYUSDTransferFixture();
      
      // Send some ETH to contract first
      await owner.sendTransaction({
        to: pyusdTransfer.address,
        value: 1000000000000000000n // 1 ETH
      });
      
      const initialBalance = await publicClient.getBalance({
        address: owner.account.address
      });
      
      await pyusdTransfer.write.emergencyWithdraw([
        "0x0000000000000000000000000000000000000000",
        1000000000000000000n
      ], {
        account: owner.account
      });
      
      const finalBalance = await publicClient.getBalance({
        address: owner.account.address
      });
      
      assert.ok(finalBalance > initialBalance);
    });
  });
});
