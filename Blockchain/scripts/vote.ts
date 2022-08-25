import "dotenv/config"
import { ethers } from "ethers"
import * as daoJson from "../artifacts/contracts/DAO.sol/DAO.json"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const proposalIndex = process.argv[3]
  if (!proposalIndex) {
    throw new Error("Proposal index needs to be specified.")
  }
  const amount = process.argv[4]
  if (!proposalIndex) {
    throw new Error("Amount to vote with needs to be specified.")
  }
  const network = process.argv[5] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const daoContract = new ethers.Contract(contractAddress, daoJson.abi, signer)

  const currentProposal = await daoContract.proposals(proposalIndex)
  console.log(
    `Casting vote on proposal with index : ${proposalIndex}, current vote count : ${currentProposal.voteCount}`
  )
  const tx = await daoContract.vote(proposalIndex, amount)
  console.log("Awaiting confirmations")
  await tx.wait()
  console.log("Fetching updated data for new proposal")
  const updatedProposal = await daoContract.proposals(proposalIndex)
  console.log(
    `Proposal with index ${proposalIndex}, new vote count : ${updatedProposal.voteCount}, tx hash : ${tx.hash}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
