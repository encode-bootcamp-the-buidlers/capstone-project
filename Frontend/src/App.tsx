import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Box, Flex, VStack, Image } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import { Home } from "./pages/Home";
import { MyCollections } from "./pages/MyCollections";
import { Vote } from "./pages/Vote";

import logo from "./assets/logo.svg";
import mycollections from "./assets/mycollections.svg";
import vote from "./assets/vote.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <VStack h="full">
        {/* HEADER */}
        <Flex
          w="100%"
          justify="space-between"
          h={20}
          zIndex={1000}
          px={8}
          background="linear-gradient(rgba(255, 255, 255, 0.1), transparent)"
          backdropFilter="blur(8px)"
          alignItems="center"
        >
          <Flex alignItems="center" gap={4}>
            <Box w={6}>
              <Image src={logo} alt="logo" />
            </Box>
            <Link to="/">DAOs got talent</Link>
          </Flex>

          <Box>Wallet login</Box>
        </Flex>

        {/* MAIN */}
        <Flex w="full" h="full" px={8} pt={8}>
          {/* NAVIGATION */}
          <Flex w={48} h="full" flexDir="column" gap={6}>
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
    </Router>
  );
}

export default App;
