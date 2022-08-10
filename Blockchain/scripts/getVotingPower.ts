import "dotenv/config"
import { ethers, BigNumber } from "ethers"
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

  console.log("Getting the current voting power")
  const votingPowerRaw = await ballotContract.votingPower()
  const votingPower = BigNumber.from(votingPowerRaw).div(BigNumber.from(10).pow(18))
  console.log(`Current voting Power is ${votingPower.toNumber()}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
