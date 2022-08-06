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
    "QmUP33aMa3dVhfqyqzYsmm8wG2hyZpGvwWwvDvGLNHCcA3/",
    "QmS2Dt8HFyAQd2tQYEyMHjyVTJqdBxcuYXdLbU38Tkn7pV/",
    "Qmez6fQ7pQ88MecRpiJSCcSF8ePdCtVPRLCB6kvxVXQgCp/",
  ],
  collectionsSize: [5, 6, 6, 8],
}
