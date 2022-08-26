import { ethers } from "ethers"
import React from "react"

type ContextInterface = {
  daoContract: null | ethers.Contract
  setDaoContract: React.Dispatch<React.SetStateAction<ethers.Contract | null>>
  collections: any[]
  setCollections: React.Dispatch<React.SetStateAction<any[]>>
  isCollectionsLoading: boolean
  setIsCollectionsLoading: React.Dispatch<React.SetStateAction<boolean>>
  winningProposalIndex: number | null
  setWinningProposalIndex: React.Dispatch<React.SetStateAction<number | null>>
  winningCollection: any
  setWinningCollection: React.Dispatch<React.SetStateAction<any>>
  isWinningCollectionsLoading: boolean
  setIsWinningCollectionsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

// @ts-ignore
const StateContext = React.createContext<ContextInterface>({})

export default StateContext
