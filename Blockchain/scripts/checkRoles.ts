import * as governanceTokenJson from "../artifacts/contracts/GovernanceToken.sol/GovernanceToken.json"
import { getSignerProvider, getWallet } from "./utils/utils"
import { ethers } from "ethers"
import { toUtf8Bytes} from 'ethers/lib/utils';
import {keccak256} from '@ethersproject/keccak256';

async function main() {
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    throw new Error("Contract address needs to be specified.")
  }
  const wallet = getWallet()
  const network = process.argv[3] || "localhost"
  const address = process.argv[4] || wallet.address
  const { signer } = getSignerProvider(wallet, network)

  const governanceTokenContract = new ethers.Contract(
    contractAddress,
    governanceTokenJson.abi,
    signer
  )

  console.log(`Checking roles on governance token contract for ${address}`)
  const minterRole = await governanceTokenContract.hasRole(
    keccak256(toUtf8Bytes('MINTER_ROLE')),
    address
  )
  const burnerRole = await governanceTokenContract.hasRole(
    keccak256(toUtf8Bytes('BURNER_ROLE')),
    address
  )
  console.log(`Has minter role is: ${minterRole}`)
  console.log(`Has burner role is: ${burnerRole}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
