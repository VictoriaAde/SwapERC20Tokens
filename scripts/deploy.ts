import { ethers } from "hardhat";

async function main() {
  const lockedAmount = ethers.parseEther("0.001");

  const vickishToken = await ethers.deployContract("VickishToken", {});
  const seyiToken = await ethers.deployContract("SeyiToken", {});
  const tokenSwap = await ethers.deployContract("TokenSwap", [
    vickishToken,
    seyiToken,
  ]);

  await tokenSwap.waitForDeployment();

  console.log(`VickishToken deployed to ${vickishToken.target}`);
  console.log(`SeyiToken deployed to ${seyiToken.target}`);
  console.log(`TokenSwap deployed to ${tokenSwap.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// VickishToken deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
// SeyiToken deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// TokenSwap deployed to 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
