// @ts-ignore
import { ethers } from "hardhat";
import { expect, use } from "chai";
import { BigNumber, constants } from "ethers";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SimpleERC20__factory, SimpleERC20 } from "../types";
use(solidity);

describe("Tokens Test", function () {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user_no_usdt: SignerWithAddress;

  let usdtToken: SimpleERC20;

  const name = "Simple ERC20";
  const symbol = "SimpleERC20";
  const decimals = 6;
  const initialSupply: BigNumber = ethers.utils.parseUnits("1500000", "6");
  const mintAmount: BigNumber = ethers.utils.parseUnits("1000", "6");
  const toAmount: BigNumber = ethers.utils.parseUnits("10", "6");

  beforeEach("Setup for Simple ERC20 Tokens", async () => {
    [deployer, user, user1, user2, user_no_usdt] = await ethers.getSigners();
    const SimpleERC20Factory: SimpleERC20__factory =
      await ethers.getContractFactory("SimpleERC20");

    usdtToken = await SimpleERC20Factory.deploy(deployer.address);

    await usdtToken.deployed();
    await usdtToken.connect(user).mint();
    await usdtToken.connect(user1).mint();
    await usdtToken.connect(user2).mint();
  });

  describe("Tokens", async function () {
    it("Should check variables of USDT Token", async function () {
      expect(await usdtToken.name()).to.be.equal(name);
      expect(await usdtToken.symbol()).to.be.equal(symbol);
      expect(await usdtToken.decimals()).to.be.equal(decimals);

      expect(await usdtToken.balanceOf(deployer.address)).to.be.equal(
        initialSupply
      );
      expect(await usdtToken.balanceOf(user.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user1.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user2.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user_no_usdt.address)).to.be.equal(0);
    });

    it("Should let any one mint USDT Token", async function () {
      await usdtToken.connect(user_no_usdt).mint();
      expect(await usdtToken.balanceOf(user.address)).to.be.equal(mintAmount);
    });

    it("check transfers of the tokens with transfer()", async function () {
      expect(await usdtToken.balanceOf(user.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user1.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user2.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user_no_usdt.address)).to.be.equal(0);

      await usdtToken.connect(user).transfer(user_no_usdt.address, toAmount);
      await usdtToken.connect(user1).transfer(user_no_usdt.address, toAmount);
      await usdtToken.connect(user2).transfer(user_no_usdt.address, toAmount);

      expect(await usdtToken.balanceOf(user.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user1.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user2.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user_no_usdt.address)).to.be.equal(
        toAmount.mul(3)
      );

      await expect(
        usdtToken.connect(user_no_usdt).transfer(user.address, toAmount)
      )
        .to.emit(usdtToken, "Transfer")
        .withNamedArgs({
          from: user_no_usdt.address,
          to: user.address,
          value: toAmount,
        });
    });

    it("check transfers of the tokens with transferFrom()", async function () {
      await usdtToken.connect(user).approve(deployer.address, toAmount);
      await usdtToken.connect(user1).approve(deployer.address, toAmount);
      await usdtToken.connect(user2).approve(deployer.address, toAmount);

      expect(await usdtToken.balanceOf(user.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user1.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user2.address)).to.be.equal(mintAmount);
      expect(await usdtToken.balanceOf(user_no_usdt.address)).to.be.equal(0);

      await usdtToken
        .connect(deployer)
        .transferFrom(user.address, user_no_usdt.address, toAmount);
      await usdtToken
        .connect(deployer)
        .transferFrom(user1.address, user_no_usdt.address, toAmount);
      await usdtToken
        .connect(deployer)
        .transferFrom(user2.address, user_no_usdt.address, toAmount);

      expect(await usdtToken.balanceOf(user.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user1.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user2.address)).to.be.equal(
        mintAmount.sub(toAmount)
      );
      expect(await usdtToken.balanceOf(user_no_usdt.address)).to.be.equal(
        toAmount.mul(3)
      );

      await expect(
        usdtToken
          .connect(user_no_usdt)
          .transferFrom(deployer.address, user.address, toAmount)
      ).to.revertedWith("ERC20: insufficient allowance");
      await usdtToken.connect(user_no_usdt).approve(deployer.address, toAmount);

      await expect(
        usdtToken
          .connect(deployer)
          .transferFrom(user_no_usdt.address, user.address, toAmount)
      )
        .to.emit(usdtToken, "Transfer")
        .withNamedArgs({
          from: user_no_usdt.address,
          to: user.address,
          value: toAmount,
        });
    });
  });
});
