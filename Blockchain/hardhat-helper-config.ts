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
  ipfsFolderCIDs: ["QmPkrpqECpnUYDE1FfMAj4ZeoY4KdjAXt8dzW4GufELG7A"],
}
