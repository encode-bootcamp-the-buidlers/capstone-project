import "dotenv/config"
import { ethers } from "ethers"
import * as ballotJson from "../artifacts/contracts/Ballot.sol/Ballot.json"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const network = process.argv[3] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const ballotContract = new ethers.Contract(contractAddress, ballotJson.abi, signer)

  console.log("Getting the winning proposal name")
  const winnerIndex = await ballotContract.winnerIndex()
  console.log("Fetching winning proposal struct data")
  const winningProposal = await ballotContract.proposals(winnerIndex)
  console.log(
    `Winning proposal index : ${winnerIndex}, current vote count : ${winningProposal.voteCount}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
