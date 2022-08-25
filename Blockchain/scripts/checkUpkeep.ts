import "dotenv/config"
import { ethers, BigNumber } from "ethers"
import * as daoJson from "../artifacts/contracts/dao.sol/dao.json"
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

  console.log("Checking checkUpkeep")
  const checkUpkeep = await daoContract.checkUpkeep(0x0)
  console.log(`checkUpkeep is ${checkUpkeep}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
