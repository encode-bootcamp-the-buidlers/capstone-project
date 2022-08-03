import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../scripts/utils/verify"
import { networkConfig, developmentChains } from "../hardhat-helper-config"
import { ethers } from "hardhat"

const deployProposal: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying Proposal and waiting for confirmations...")

  const proposalName = "Test"

  const proposal = await deploy("Proposal", {
    from: deployer,
    args: [proposalName],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Proposal at ${proposal.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(proposal.address, [])
  }

  const proposalContract = await ethers.getContractAt("Proposal", proposal.address)

  const governor = await get("GovernorContract")
  
  const transferTx = await proposalContract.transferOwnership(governor.address)

  await transferTx.wait(1)
}

export default deployProposal
deployProposal.tags = ["proposal"]
