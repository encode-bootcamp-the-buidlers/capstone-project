import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../scripts/utils/verify"
import { networkConfig, developmentChains, governorConfig } from "../hardhat-helper-config"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")

  log("----------------------------------------------------")
  log("Deploying GovernorContract and waiting for confirmations...")

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governorConfig.GOVERNOR_NAME,
      governanceToken.address,
      governorConfig.QUORUM_PERCENTAGE,
      governorConfig.VOTING_PERIOD,
      governorConfig.VOTING_DELAY,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`GovernorContract at ${governorContract.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(governorContract.address, [])
  }
}

export default deployGovernorContract
deployGovernorContract.tags = ["all", "governor"]
