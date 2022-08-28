import { Flex, VStack } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useState } from "react"
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { AddProposal } from "./pages/AddProposal"
import { Home } from "./pages/Home"
import { MyCollections } from "./pages/MyCollections"
import { Vote } from "./pages/Vote"
import VotingOverview from "./pages/Voting-Overview"
import StateContext from "./state/stateContext"

function App() {
  const [daoContract, setDaoContract] = useState<null | ethers.Contract>(null)
  // new ethers.Contract(ethers.constants.AddressZero, []) //necessary init due to TS

  const [proposals, setProposals] = useState<any[]>([])
  const [isProposalsLoading, setIsProposalsLoading] = useState<boolean>(false)

  const [collections, setCollections] = useState<any[]>([])
  const [isCollectionsLoading, setIsCollectionsLoading] =
    useState<boolean>(false)

  const [winningProposalIndex, setWinningProposalIndex] = useState<
    number | null
  >(null)

  const [winningCollection, setWinningCollection] = useState<any>(null)
  useState<boolean>(false)
  const [isWinningCollectionsLoading, setIsWinningCollectionsLoading] =
    useState<boolean>(false)

  return (
    <BrowserRouter>
      <StateContext.Provider
        value={{
          daoContract,
          setDaoContract,

          proposals,
          setProposals,
          isProposalsLoading,
          setIsProposalsLoading,

          collections,
          setCollections,
          isCollectionsLoading,
          setIsCollectionsLoading,

          winningProposalIndex,
          setWinningProposalIndex,

          winningCollection,
          setWinningCollection,
          isWinningCollectionsLoading,
          setIsWinningCollectionsLoading,
        }}
      >
        <VStack h="full">
          <Header />

          <Sidebar>
            <Flex w="full" h="full" justifyContent="center">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/voting-overview" element={<VotingOverview />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/add-proposal" element={<AddProposal />} />
                <Route path="/my-collections" element={<MyCollections />} />
              </Routes>
            </Flex>
          </Sidebar>
        </VStack>
      </StateContext.Provider>
    </BrowserRouter>
  )
}

export default App
