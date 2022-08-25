import "dotenv/config"
import { ethers } from "ethers"
import * as daoJson from "../artifacts/contracts/DAO.sol/DAO.json"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const network = process.argv[3] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const daoContract = new ethers.Contract(contractAddress, daoJson.abi, signer)

  console.log("Getting the winning proposal name")
  const winnerIndex = await daoContract.winnerIndex()
  console.log("Fetching winning proposal struct data")
  const winningProposal = await daoContract.proposals(winnerIndex)
  console.log(
    `Winning proposal index : ${winnerIndex}, current vote count : ${winningProposal.voteCount}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
