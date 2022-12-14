import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../scripts/utils/verify"
import { networkConfig, developmentChains } from "../hardhat-helper-config"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying GovernanceToken and waiting for confirmations...")

  const governanceTokenName = "DAOs got talent"
  const governanceTokenSymbol = "DAOGT"

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: [governanceTokenName, governanceTokenSymbol],
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })
  log(`GovernanceToken at ${governanceToken.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(governanceToken.address, [])
  }
}

export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "token"]
