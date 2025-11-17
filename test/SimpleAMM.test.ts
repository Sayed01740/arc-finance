import { expect } from "chai"
import { ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"

describe("SimpleAMM", function () {
  async function deployContracts() {
    const [deployer, user1, user2] = await ethers.getSigners()

    const TokenA = await ethers.getContractFactory("TestToken")
    const tokenA = await TokenA.deploy("Token A", "TKA", ethers.parseEther("1000000"), 18)

    const TokenB = await ethers.getContractFactory("TestToken")
    const tokenB = await TokenB.deploy("Token B", "TKB", ethers.parseEther("1000000"), 18)

    const AMM = await ethers.getContractFactory("SimpleAMM")
    const amm = await AMM.deploy(await tokenA.getAddress(), await tokenB.getAddress())

    return { tokenA, tokenB, amm, deployer, user1, user2 }
  }

  it("Should deploy contracts correctly", async function () {
    const { tokenA, tokenB, amm } = await loadFixture(deployContracts)

    expect(await tokenA.getAddress()).to.be.properAddress
    expect(await tokenB.getAddress()).to.be.properAddress
    expect(await amm.getAddress()).to.be.properAddress
  })

  it("Should add liquidity correctly", async function () {
    const { tokenA, tokenB, amm, deployer } = await loadFixture(deployContracts)

    const amountA = ethers.parseEther("1000")
    const amountB = ethers.parseEther("1000")

    await tokenA.approve(await amm.getAddress(), amountA)
    await tokenB.approve(await amm.getAddress(), amountB)

    await amm.addLiquidity(amountA, amountB, deployer.address)

    const [reserveA, reserveB] = await amm.getReserves()
    expect(reserveA).to.equal(amountA)
    expect(reserveB).to.equal(amountB)
  })

  it("Should swap tokens correctly", async function () {
    const { tokenA, tokenB, amm, deployer } = await loadFixture(deployContracts)

    // Add liquidity first
    const amountA = ethers.parseEther("1000")
    const amountB = ethers.parseEther("1000")

    await tokenA.approve(await amm.getAddress(), amountA)
    await tokenB.approve(await amm.getAddress(), amountB)
    await amm.addLiquidity(amountA, amountB, deployer.address)

    // Swap tokens
    const swapAmount = ethers.parseEther("100")
    await tokenA.approve(await amm.getAddress(), swapAmount)
    
    const tx = await amm.swapExactTokens(swapAmount, await tokenA.getAddress(), deployer.address)
    await tx.wait()

    // Check that reserves changed
    const [reserveA, reserveB] = await amm.getReserves()
    expect(reserveA).to.be.gt(amountA)
    expect(reserveB).to.be.lt(amountB)
  })

  it("Should remove liquidity correctly", async function () {
    const { tokenA, tokenB, amm, deployer } = await loadFixture(deployContracts)

    // Add liquidity first
    const amountA = ethers.parseEther("1000")
    const amountB = ethers.parseEther("1000")

    await tokenA.approve(await amm.getAddress(), amountA)
    await tokenB.approve(await amm.getAddress(), amountB)
    const tx = await amm.addLiquidity(amountA, amountB, deployer.address)
    await tx.wait()

    const lpBalance = await amm.balanceOf(deployer.address)

    // Remove liquidity
    await amm.removeLiquidity(lpBalance, deployer.address)

    const [reserveA, reserveB] = await amm.getReserves()
    expect(reserveA).to.equal(0)
    expect(reserveB).to.equal(0)
  })
})
