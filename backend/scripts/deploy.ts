import { ethers } from "hardhat";

async function main() {
  const Keijiban = await ethers.getContractFactory("keijiban");
  const keijiban = await Keijiban.deploy();
  await keijiban.deployed();

  console.log("todoList deployed to:", keijiban.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});