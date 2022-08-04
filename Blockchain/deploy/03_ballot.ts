import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../scripts/utils/verify"
import { networkConfig, developmentChains } from "../hardhat-helper-config"

const deployBallot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")

  log("----------------------------------------------------")
  log("Deploying Ballot and waiting for confirmations...")

  const Ballot = await deploy("Ballot", {
    from: deployer,
    args: [governanceToken.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Ballot at ${Ballot.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(Ballot.address, [])
  }
}

export default deployBallot
