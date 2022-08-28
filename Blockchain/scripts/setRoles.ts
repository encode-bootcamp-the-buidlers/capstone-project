import * as governanceTokenJson from "../artifacts/contracts/GovernanceToken.sol/GovernanceToken.json"
import { getSignerProvider, getWallet } from "./utils/utils"
import { ethers } from "ethers"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const ballotAddress = process.argv[3]
  if (!ballotAddress) {
    throw new Error("Ballot contract needs to be specified")
  }

  const wallet = getWallet()
  const network = process.argv[4] || "localhost"
  const { signer } = getSignerProvider(wallet, network)

  const governanceTokenContract = new ethers.Contract(
    contractAddress,
    governanceTokenJson.abi,
    signer
  )

  console.log(`Setting minter and burner roles for ${wallet.address} and ${ballotAddress}`)
  const tx = await governanceTokenContract.setRoles(wallet.address, ballotAddress)
  tx.wait()
  console.log(`Done in ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
