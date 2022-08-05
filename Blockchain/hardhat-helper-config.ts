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
    "Qma67uxmsq8ZnXy36CYyAiA9wRpHKqXcgygGJhi93JMtzp",
    "QmZwq3UFdWCvaTsZr9bpXcMuNPwJTVTRvN7Q3yF7i4ChRX",
    "QmYJdoS1QnU3wDoDaVLVkKXjmHgV3bj5j7igTi6oqxHcaz",
    "Qmae9doNZGn2EbGpKpgBiEU61HgBKNuYmU6uCuvKGSZGym",
  ],
}
