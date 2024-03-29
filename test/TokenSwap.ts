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
    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const VickishToken = await ethers.getContractFactory("VickishToken");
    const SeyiToken = await ethers.getContractFactory("SeyiToken");
    const TokenSwap = await ethers.getContractFactory("TokenSwap");

    const vickishToken = await VickishToken.deploy();
    const seyiToken = await SeyiToken.deploy();
    const tokenSwap = await TokenSwap.deploy(
      vickishToken.target,
      seyiToken.target
    );

    return {
      tokenSwap,
      vickishToken,
      seyiToken,
      owner,
      otherAccount,
      thirdAccount,
    };
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

  describe("swapVickishToken", function () {
    it("Should successfully swap vickish token to seyi", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      // Approve contract to spend amount of tokens
      await vickishToken.approve(tokenSwap.target, 200);
      await seyiToken.approve(tokenSwap.target, 200);

      // Put amount into token pool of contract
      await tokenSwap.poolVickish(200);
      await tokenSwap.poolSeyi(200);

      await vickishToken.transfer(otherAccount, 300);

      const userBalVickish = await tokenSwap.checkUserBalOfvickishToken(
        otherAccount
      );
      const userBalSeyi = await tokenSwap.checkUserBalOfseyiToken(otherAccount);

      const contractBalVickish =
        await tokenSwap.checkContractBalanceOfvickishToken();
      const contractBalSeyi = await tokenSwap.checkContractBalanceOfseyiToken();

      // console.log("userBalVickish", userBalVickish);
      // console.log("userBalSeyi", userBalSeyi);
      // console.log("contractBalVickish", contractBalVickish);
      // console.log("contractBalSeyi", contractBalSeyi);

      // approve contract to spend money from otherAccount which is msg.sender
      await vickishToken.connect(otherAccount).approve(tokenSwap.target, 200);

      // Swap vickish token to seyitoken
      const swapVickish = await tokenSwap
        .connect(otherAccount)
        .swapVickishToken(100);

      // check user bal for seyitoken to check if it was swapped successfully
      const balOfSeyiToken = await tokenSwap.checkUserBalOfseyiToken(
        otherAccount
      );
      const balOfVickishToken = await tokenSwap.checkUserBalOfvickishToken(
        otherAccount
      );

      // expect user's bal of seyitoken to be equal the swapped amount
      expect(balOfSeyiToken).to.be.equal(100);

      console.log("balOfSeyiToken", balOfSeyiToken);
      console.log("balOfVickishToken", balOfVickishToken);
    });

    it("Should revert if not enough vickish token in contract", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      await vickishToken.transfer(otherAccount, 300);

      // approve contract to spend money from otherAccount which is msg.sender
      await vickishToken.connect(otherAccount).approve(tokenSwap.target, 200);

      const swapVickish = tokenSwap.connect(otherAccount).swapVickishToken(100);

      await expect(swapVickish).to.be.revertedWith(
        "Not enough vickishToken in contract"
      );
    });

    it("Should revert if not enough vickish token in user's bal", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      // Approve contract to spend amount of tokens
      await vickishToken.approve(tokenSwap.target, 200);
      await seyiToken.approve(tokenSwap.target, 200);

      // Put amount into token pool of contract
      await tokenSwap.poolVickish(200);
      await tokenSwap.poolSeyi(200);

      const swapVickish = tokenSwap.connect(otherAccount).swapVickishToken(100);

      await expect(swapVickish).to.be.revertedWith(
        "User does not have  enougn Vickish tokens for this transaction"
      );
    });

    it("Should revert if Transfer of vickishToken to contract failed or transfer to user failed", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, thirdAccount } =
        await loadFixture(deploySwapContractandTokens);

      const swapVickish = tokenSwap.connect(otherAccount).swapVickishToken(100);

      expect(swapVickish).to.be.revertedWithCustomError;
    });
  });
  describe("swapSeyiToken", function () {
    it("Should successfully swap seyi token to Vickish", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      // Approve contract to spend amount of tokens
      await seyiToken.approve(tokenSwap.target, 200);
      await vickishToken.approve(tokenSwap.target, 200);

      // Put amount into token pool of contract
      await tokenSwap.poolSeyi(200);
      await tokenSwap.poolVickish(200);

      await seyiToken.transfer(otherAccount, 300);

      // approve contract to spend money from otherAccount which is msg.sender
      await seyiToken.connect(otherAccount).approve(tokenSwap.target, 200);

      // Swap vickish token to seyitoken
      const swapSeyi = await tokenSwap.connect(otherAccount).swapSeyiToken(100);

      // check user bal for seyitoken to check if it was swapped successfully
      const balOfSeyiToken = await tokenSwap.checkUserBalOfseyiToken(
        otherAccount
      );
      const balOfVickishToken = await tokenSwap.checkUserBalOfvickishToken(
        otherAccount
      );

      // expect user's bal of seyitoken to be equal the swapped amount
      expect(balOfVickishToken).to.be.equal(100);

      console.log("balOfSeyiToken", balOfSeyiToken);
      console.log("balOfVickishToken", balOfVickishToken);
    });

    it("Should revert if not enough seyi token in contract", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      await seyiToken.transfer(otherAccount, 300);

      // approve contract to spend money from otherAccount which is msg.sender
      await seyiToken.connect(otherAccount).approve(tokenSwap.target, 200);

      const swapSeyi = tokenSwap.connect(otherAccount).swapSeyiToken(100);

      await expect(swapSeyi).to.be.revertedWith(
        "Not enough seyiToken in contract"
      );
    });

    it("Should revert if not enough seyi token in user's bal", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, owner } =
        await loadFixture(deploySwapContractandTokens);

      // Approve contract to spend amount of tokens
      await seyiToken.approve(tokenSwap.target, 200);
      await vickishToken.approve(tokenSwap.target, 200);

      // Put amount into token pool of contract
      await tokenSwap.poolSeyi(200);
      await tokenSwap.poolVickish(200);

      const swapSeyi = tokenSwap.connect(otherAccount).swapSeyiToken(100);

      await expect(swapSeyi).to.be.revertedWith(
        "User do not have  enougn Seyi tokens for this transaction"
      );
    });

    it("Should revert if Transfer of seyiToken to contract failed or transfer to user failed", async function () {
      const { tokenSwap, vickishToken, seyiToken, otherAccount, thirdAccount } =
        await loadFixture(deploySwapContractandTokens);

      const swapSeyi = tokenSwap.connect(otherAccount).swapSeyiToken(100);

      expect(swapSeyi).to.be.revertedWithCustomError;
    });
  });
});
