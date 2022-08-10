import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
  ballotConfig,
  developmentChains,
  governorConfig,
  networkConfig,
} from "../hardhat-helper-config"
import verify from "../scripts/utils/verify"

const deployGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")

  log("----------------------------------------------------")
  log("Deploying Governor and waiting for confirmations...")

  const Governor = await deploy("Governor", {
    from: deployer,
    args: [governanceToken.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Governor at ${Governor.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(Governor.address, [])
  }

  // deploy the first ballot automagically
  if (governorConfig.createBallotOnDeploy) {
    log("----------------------------------------------------")
    const governor = await ethers.getContract("Governor", deployer)

    log("Creating a new ballot inside the Governor and waiting for confirmations...")
    await governor.createNewBallot(
      ballotConfig.ipfsFolderCIDs,
      ballotConfig.collectionsSize,
      ballotConfig.quorum
    )
    log(`Governor's Ballot at ${await governor.getCurrentBallotAddress()}`)
  }
}

export default deployGovernor
deployGovernor.tags = ["all", "governor"]
