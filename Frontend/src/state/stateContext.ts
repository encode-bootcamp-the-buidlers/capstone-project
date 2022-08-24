import { ethers } from "ethers"
import React from "react"

type ContextInterface = {
  daoContract: ethers.Contract
  setDaoContract: React.Dispatch<React.SetStateAction<ethers.Contract>>
}

// @ts-ignore
const StateContext = React.createContext<ContextInterface>({})

export default StateContext
