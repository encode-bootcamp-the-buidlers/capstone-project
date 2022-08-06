export interface networkConfigItem {
  ethUsdPriceFeed?: string
  blockConfirmations?: number
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  hardhat: {},
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Rinkeby
  rinkeby: {
    blockConfirmations: 6,
  },
}

export const developmentChains = ["hardhat", "localhost"]

export const ballotConfig = {
  ipfsFolderCIDs: [
    // IMPORTANT! leave the trailing slash to indicate it's a folder
    "QmUMm4SdH9XVBvAhf2uAyx9tPJqQR4mgvYELzhn2qdS1mz/",
    "QmdX9MsCLmuXMbViFWSjSL8Z77jTsvSaTbrvNVC7HVrpU6/",
    "QmQQTL7npdih2MK8dT6QJV3jeYdx6Yzf7CWDu2xoJkoVYy/",
    "QmRsaXDMBVvDg4GFyh4fSrWzwb97s2dCnZAPL4bMmpMZsk/",
  ],
  collectionsSize: [5, 6, 6, 8],
}
