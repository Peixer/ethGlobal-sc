 
import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

describe("PYUSDMock", function () {
  let pyusdMock: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    const { viem } = await network.connect();
    const [ownerAccount, user1Account, user2Account] = await viem.getWalletClients();
    owner = ownerAccount;
    user1 = user1Account;
    user2 = user2Account;

    // Deploy PYUSDMock
    pyusdMock = await viem.deployContract("PYUSDMock", [
      "PayPal USD Mock",
      "PYUSDM",
      6, // decimals
      1000000n * 10n ** 6n // 1M tokens initial supply
    ]);
  });

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and decimals", async function () {
      assert.strictEqual(await pyusdMock.read.name(), "PayPal USD Mock");
      assert.strictEqual(await pyusdMock.read.symbol(), "PYUSDM");
      assert.strictEqual(await pyusdMock.read.decimals(), 6);
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await pyusdMock.read.balanceOf([owner.account.address]);
      assert.strictEqual(ownerBalance, 1000000n * 10n ** 6n);
    });

    it("Should set the correct total supply", async function () {
      const totalSupply = await pyusdMock.read.totalSupply();
      assert.strictEqual(totalSupply, 1000000n * 10n ** 6n);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens to any address", async function () {
      const mintAmount = 1000n * 10n ** 6n; // 1000 tokens
      
      await pyusdMock.write.mint([user1.account.address, mintAmount], {
        account: owner.account
      });

      const user1Balance = await pyusdMock.read.balanceOf([user1.account.address]);
      assert.strictEqual(user1Balance, mintAmount);
    });

    it("Should allow anyone to mint tokens to themselves", async function () {
      const mintAmount = 500n * 10n ** 6n; // 500 tokens
      
      await pyusdMock.write.mint([mintAmount], {
        account: user1.account
      });

      const user1Balance = await pyusdMock.read.balanceOf([user1.account.address]);
      assert.strictEqual(user1Balance, mintAmount);
    });

    it("Should reject minting to zero address", async function () {
      const mintAmount = 1000n * 10n ** 6n;
      
      await assert.rejects(
        async () => {
          await pyusdMock.write.mint(["0x0000000000000000000000000000000000000000", mintAmount], {
            account: owner.account
          });
        },
        {
          message: /PYUSDMock: Cannot mint to zero address/
        }
      );
    });

    it("Should reject minting zero amount", async function () {
      await assert.rejects(
        async () => {
          await pyusdMock.write.mint([user1.account.address, 0n], {
            account: owner.account
          });
        },
        {
          message: /PYUSDMock: Amount must be greater than 0/
        }
      );
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint tokens to user1 for burning tests
      await pyusdMock.write.mint([user1.account.address, 1000n * 10n ** 6n], {
        account: owner.account
      });
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = 100n * 10n ** 6n; // 100 tokens
      const initialBalance = await pyusdMock.read.balanceOf([user1.account.address]);
      
      await pyusdMock.write.burn([burnAmount], {
        account: user1.account
      });

      const finalBalance = await pyusdMock.read.balanceOf([user1.account.address]);
      assert.strictEqual(finalBalance, initialBalance - burnAmount);
    });

    it("Should allow owner to burn tokens from any address", async function () {
      const burnAmount = 200n * 10n ** 6n; // 200 tokens
      const initialBalance = await pyusdMock.read.balanceOf([user1.account.address]);
      
      await pyusdMock.write.burnFrom([user1.account.address, burnAmount], {
        account: owner.account
      });

      const finalBalance = await pyusdMock.read.balanceOf([user1.account.address]);
      assert.strictEqual(finalBalance, initialBalance - burnAmount);
    });

    it("Should reject burning more tokens than balance", async function () {
      const burnAmount = 2000n * 10n ** 6n; // 2000 tokens (more than user1 has)
      
      await assert.rejects(
        async () => {
          await pyusdMock.write.burn([burnAmount], {
            account: user1.account
          });
        },
        {
          message: /PYUSDMock: Insufficient balance/
        }
      );
    });

    it("Should reject burning zero amount", async function () {
      await assert.rejects(
        async () => {
          await pyusdMock.write.burn([0n], {
            account: user1.account
          });
        },
        {
          message: /PYUSDMock: Amount must be greater than 0/
        }
      );
    });
  });

  describe("ERC20 Standard Functions", function () {
    beforeEach(async function () {
      // Mint tokens to user1 for transfer tests
      await pyusdMock.write.mint([user1.account.address, 1000n * 10n ** 6n], {
        account: owner.account
      });
    });

    it("Should allow standard ERC20 transfers", async function () {
      const transferAmount = 100n * 10n ** 6n; // 100 tokens
      
      await pyusdMock.write.transfer([user2.account.address, transferAmount], {
        account: user1.account
      });

      const user2Balance = await pyusdMock.read.balanceOf([user2.account.address]);
      assert.strictEqual(user2Balance, transferAmount);
    });

    it("Should allow approved transfers", async function () {
      const transferAmount = 100n * 10n ** 6n; // 100 tokens
      
      // Approve user2 to spend user1's tokens
      await pyusdMock.write.approve([user2.account.address, transferAmount], {
        account: user1.account
      });

      // Transfer from user1 to user2 using user2's account
      await pyusdMock.write.transferFrom([user1.account.address, user2.account.address, transferAmount], {
        account: user2.account
      });

      const user2Balance = await pyusdMock.read.balanceOf([user2.account.address]);
      assert.strictEqual(user2Balance, transferAmount);
    });
  });
});
