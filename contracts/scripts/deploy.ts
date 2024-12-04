// @ts-ignore
import { ethers, run } from "hardhat";
import { SimpleERC20__factory } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function spaces() {
  console.log("--------------------");
}

async function main() {
  const deployer: SignerWithAddress = (await ethers.getSigners())[0];
  console.log("Deployer Address:", deployer.address);

  const SimpleERC20Factory: SimpleERC20__factory =
    await ethers.getContractFactory("SimpleERC20");

  const simpleERC20 = await SimpleERC20Factory.deploy(deployer.address);
  await simpleERC20.deployed();
  spaces();
  console.log("SimpleERC20 deployed to:", simpleERC20.address);
  spaces();
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
