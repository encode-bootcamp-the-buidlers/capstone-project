import * as governanceTokenJson from "../artifacts/contracts/GovernanceToken.sol/GovernanceToken.json"
import { getSignerProvider, getWallet } from "./utils/utils"
import { ethers, BigNumber } from "ethers"

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const amount = process.argv[3]
  if (!amount) {
    throw new Error("Amount needs to be specified.")
  }
  const network = process.argv[4] || "localhost"

  const wallet = getWallet()
  let receiverAddress = process.argv[5] || wallet.address
  const { signer } = getSignerProvider(wallet, network)

  const governanceTokenContract = new ethers.Contract(
    contractAddress,
    governanceTokenJson.abi,
    signer
  )

  console.log(`Minting ${amount} tokens for address ${receiverAddress}`)
  // mint governance tokens for the chaiperson
  const tx = await governanceTokenContract.mint(
    receiverAddress,
    BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
  )
  tx.wait()
  console.log(`Transaction successful with hash ${tx.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
