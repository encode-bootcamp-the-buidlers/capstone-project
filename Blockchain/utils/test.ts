import { ethers } from "hardhat"

// left if needed in the future
// can be deleted if not
// async function getBlockInfo() {
//   const blockNumber = await ethers.provider.getBlockNumber()
//   const block = await ethers.provider.getBlock(blockNumber)

//   return { blockNumber, block, blockTimestamp: block.timestamp }
// }

async function increaseTime(seconds = 60 * 60 * 24 + 1) {
  await ethers.provider.send("evm_increaseTime", [seconds])
  await ethers.provider.send("evm_mine", [])
}

export { increaseTime }
