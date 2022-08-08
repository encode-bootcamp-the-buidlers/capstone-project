import "dotenv/config"
import { Contract, ethers } from "ethers"
import * as ballotJson from "../artifacts/contracts/Ballot.sol/Ballot.json"
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../typechain-types"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const network = process.argv[5] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const balanceBN = await signer.getBalance()
  const balance = Number(ethers.utils.formatEther(balanceBN))
  console.log(`Wallet balance ${balance}`)

  if (balance < 0.01) {
    throw new Error("Not enough ether")
  }

  if (process.argv.length < 3) throw new Error("Ballot address missing")
  const ballotAddress = process.argv[2]

  if (process.argv.length < 4) throw new Error("Voter address missing")
  const voterAddress = process.argv[3]

  if (process.argv.length < 5) throw new Error("Amount missing")
  const amount = process.argv[4]

  console.log(`Attaching ballot contract interface to address ${ballotAddress}`)

  const ballotContract: Ballot = new Contract(ballotAddress, ballotJson.abi, signer) as Ballot

  console.log(`Giving right to vote to ${voterAddress}`)
  const tx = await ballotContract.giveRightToVote(voterAddress, amount)

  console.log("Awaiting confirmations")
  await tx.wait()

  console.log(`Transaction completed. Hash: ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
