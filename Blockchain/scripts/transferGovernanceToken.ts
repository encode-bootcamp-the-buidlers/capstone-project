import { ethers, BigNumber } from "ethers"
import * as governanceTokenJson from "../artifacts/contracts/GovernanceToken.sol/GovernanceToken.json"
import { getSignerProvider, getWallet } from "./utils/utils"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const receiverAddress = process.argv[3]
  if (!receiverAddress) {
    throw new Error("Receiver address needs to be specified.")
  }
  const amount = process.argv[4]
  if (!amount) {
    throw new Error("Amount needs to be specified.")
  }
  const network = process.argv[5] || "localhost"

  const wallet = getWallet()

  const { signer } = getSignerProvider(wallet, network)

  const governanceTokenContract = new ethers.Contract(
    contractAddress,
    governanceTokenJson.abi,
    signer
  )

  console.log("Sending tokens")
  const tx = await governanceTokenContract.transfer(
    receiverAddress,
    BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
  )
  await tx.wait()
  console.log(
    `Transferred ${amount} governance tokens to address ${receiverAddress} in transaction ${tx.hash}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
