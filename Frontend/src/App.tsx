import { Flex, VStack } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useState } from "react"
import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { Home } from "./pages/Home"
import { MyCollections } from "./pages/MyCollections"
import { Vote } from "./pages/Vote"
import VotingOverview from "./pages/Voting-Overview"
import StateContext from "./state/stateContext"

function App() {
  const [daoContract, setDaoContract] = useState<null | ethers.Contract>(null)
  // new ethers.Contract(ethers.constants.AddressZero, []) //necessary init due to TS

  return (
    <BrowserRouter>
      <StateContext.Provider
        value={{
          daoContract,
          setDaoContract,
        }}
      >
        <VStack h="full">
          <Header />

          <Sidebar>
            <Flex w="full" h="full" justifyContent="center">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/voting-overview" element={<VotingOverview />} /> */}
                <Route path="/vote" element={<Vote />} />
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
