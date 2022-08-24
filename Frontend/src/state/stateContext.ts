import { ethers } from "ethers"
import React from "react"

type ContextInterface = {
  daoContract: null | ethers.Contract
  setDaoContract: React.Dispatch<React.SetStateAction<ethers.Contract | null>>
}

// @ts-ignore
const StateContext = React.createContext<ContextInterface>({})

export default StateContext
