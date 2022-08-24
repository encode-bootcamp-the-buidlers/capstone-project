import { Box, Divider, Flex, Image, VStack } from "@chakra-ui/react"
import { ethers } from "ethers"
import React, { useState } from "react"
import { Route, Routes } from "react-router"
import { BrowserRouter, Link } from "react-router-dom"

import { Home } from "./pages/Home"
import { MyCollections } from "./pages/MyCollections"
import { Vote } from "./pages/Vote"

import mycollections from "./assets/mycollections.svg"
import vote from "./assets/vote.svg"

//import contracts
import Header from "./components/Header"
import StateContext from "./state/stateContext"

function App() {
  const [daoContract, setDaoContract] = useState(
    new ethers.Contract(ethers.constants.AddressZero, [])
  ) //necessary init due to TS

  //rendered component
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

          {/* MAIN */}
          <Flex w="full" h="calc(100% - 60px)" px={8} pt={8}>
            {/* NAVIGATION */}
            <Flex w={60} h="full" flexDir="column" gap={6}>
              <Link to="/vote">
                <Flex alignItems="center" gap={4}>
                  <Box w={6}>
                    <Image src={vote} alt="logo" />
                  </Box>
                  Vote
                </Flex>
              </Link>
              <Link to="/my-collections">
                <Flex alignItems="center" gap={4}>
                  <Box w={6}>
                    <Image src={mycollections} alt="logo" />
                  </Box>
                  My Collections
                </Flex>
              </Link>
            </Flex>
            <Box mr={10} h="90%">
              <Divider orientation="vertical" />
            </Box>

            {/* CONTENT */}
            <Flex w="full" h="full" justifyContent="center">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vote" element={<Vote />} />
                <Route path="/my-collections" element={<MyCollections />} />
              </Routes>
            </Flex>
          </Flex>
        </VStack>
      </StateContext.Provider>
    </BrowserRouter>
  )
}

export default App
