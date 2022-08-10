import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { ballotConfig, developmentChains, networkConfig } from "../hardhat-helper-config"
import verify from "../scripts/utils/verify"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

const deployBallot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")
  const governanceTokenContract = await ethers.getContract("GovernanceToken")

  log("----------------------------------------------------")
  log("Deploying Ballot and waiting for confirmations...")

  const Ballot = await deploy("Ballot", {
    from: deployer,
    args: [
      governanceToken.address,
      ballotConfig.ipfsFolderCIDs,
      ballotConfig.collectionsSize,
      ballotConfig.quorum,
    ],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`Ballot at ${Ballot.address}`)

  // set Ballot as the admin of the governance token contract
  governanceTokenContract.setRoles(deployer, Ballot.address)
  // mint governance tokens for the chaiperson
  governanceTokenContract.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)))

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(Ballot.address, [])
  }
}

export default deployBallot
deployBallot.tags = ["all", "ballot"]
