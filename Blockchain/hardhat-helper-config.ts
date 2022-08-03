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

// Governor Values
export const governorConfig = {
  QUORUM_PERCENTAGE: 4, // Need 4% of voters to pass
  MIN_DELAY: 3600, // 1 hour - after a vote passes, you have 1 hour before you can enact
  VOTING_PERIOD: 10, // blocks
  VOTING_DELAY: 2, // blocks - How many blocks till a proposal vote becomes active
}
