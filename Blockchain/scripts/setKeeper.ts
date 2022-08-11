import "dotenv/config"
import { ethers, BigNumber } from "ethers"
import * as ballotJson from "../artifacts/contracts/Ballot.sol/Ballot.json"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const keeperAddress = process.argv[3]
  if (!keeperAddress) {
    throw new Error("Keeper address needs to be specified.")
  }
  const network = process.argv[4] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const ballotContract = new ethers.Contract(contractAddress, ballotJson.abi, signer)

  console.log("Granting Chainlink Keeper access rights to Ballot contract")
  const tx = await ballotContract.setKeeperRegistryAddress(keeperAddress)
  await tx.wait()
  console.log(`Keeper address successfully set in transaction ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
