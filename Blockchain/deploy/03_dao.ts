import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { daoConfig, developmentChains, networkConfig } from "../hardhat-helper-config"
import verify from "../scripts/utils/verify"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

const deployDAO: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const governanceToken = await get("GovernanceToken")
  const governanceTokenContract = await ethers.getContract("GovernanceToken")

  log("----------------------------------------------------")
  log("Deploying DAO and waiting for confirmations...")

  const args = [
    governanceToken.address,
    daoConfig.ipfsFolderCIDs,
    daoConfig.collectionsSize,
    daoConfig.quorum,
  ]

  const DAO = await deploy("DAO", {
    from: deployer,
    args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`DAO at ${DAO.address}`)

  // set DAO as the admin of the governance token contract
  governanceTokenContract.setRoles(deployer, DAO.address)
  // mint governance tokens for the chaiperson
  governanceTokenContract.mint(deployer, BigNumber.from(1000).mul(BigNumber.from(10).pow(18)))

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(DAO.address, args)
  }
}

export default deployDAO
deployDAO.tags = ["all", "DAO"]
