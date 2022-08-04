import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../scripts/utils/verify"
import { networkConfig, developmentChains } from "../hardhat-helper-config"

const deployNFTContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying NFTContract and waiting for confirmations...")

  const NFTContract = await deploy("NFTContract", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  })

  log(`NFTContract at ${NFTContract.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(NFTContract.address, [])
  }
}

export default deployNFTContract
deployNFTContract.tags = ["all", "nft"]
