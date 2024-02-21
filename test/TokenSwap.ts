import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenSwap", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySwapContractandTokens() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const VickishToken = await ethers.getContractFactory("VickishToken");
    const SeyiToken = await ethers.getContractFactory("SeyiToken");
    const TokenSwap = await ethers.getContractFactory("TokenSwap");

    const vickishToken = await VickishToken.deploy();
    const seyiToken = await SeyiToken.deploy();
    const tokenSwap = TokenSwap.deploy(vickishToken.target, seyiToken.target);
    return { tokenSwap, vickishToken, seyiToken, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right token as VickishToken", async function () {
      const { vickishToken } = await loadFixture(deploySwapContractandTokens);
      expect(vickishToken).to.equal(vickishToken.target);
    });

    it("Should set the right token as VickishToken", async function () {
      const { seyiToken } = await loadFixture(deploySwapContractandTokens);
      expect(seyiToken).to.equal(seyiToken.target);
    });
  });

  describe("Withdrawals", function () {});
});
