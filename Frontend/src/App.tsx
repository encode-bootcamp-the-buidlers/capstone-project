import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import { Home } from "./pages/Home";
import { MyCollections } from "./pages/MyCollections";
import { Vote } from "./pages/Vote";

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
          <Link to="/">DAOs got talent</Link>

          <Box>Wallet login</Box>
        </Flex>

        {/* MAIN */}
        <Flex w="full" h="full" px={8} pt={8}>
          {/* NAVIGATION */}
          <Flex w={40} h="full" flexDir="column" gap={6}>
            <Link to="/vote">Vote</Link>
            <Link to="/my-collections">My Collections</Link>
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
