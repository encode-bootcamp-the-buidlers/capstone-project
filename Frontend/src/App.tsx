import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Box, Flex, VStack, Image, Divider } from "@chakra-ui/react";
import { Route, Routes } from "react-router";
import { ethers } from "ethers";

import { Home } from "./pages/Home";
import { MyCollections } from "./pages/MyCollections";
import { Vote } from "./pages/Vote";

import logo from "./assets/logo.svg";
import mycollections from "./assets/mycollections.svg";
import vote from "./assets/vote.svg";
import "./App.css";

//import contracts
import DaoContract from "./contracts/daoContract.json"

function App() {
  //state variables
  const [walletAddress, setWalletAddress] = useState("");
  const [daoContract, setDaoContract] = useState(new ethers.Contract(ethers.constants.AddressZero, [])); //necessary init due to TS
  const [proposals, setProposals] = useState<any[]>([])
  //functions

  //facilitates login process
  const requestAccount = async () => {
    if (window.ethereum) {
      try {
        console.log("Loging in...");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("Error connecting...");
      }
    } else {
      alert("Meta Mask extension not detected! Please add to engage with DAO.");
    }
  };

  //connect to smart contracts
  const connectToContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider", provider)

    const network = await provider.getNetwork()
    console.log("network", network)

    if(network.name === "rinkeby"){
      const signer = provider.getSigner()
      console.log("signer", signer)

      const daoContract = new ethers.Contract(DaoContract.address, DaoContract.abi, signer)
      setDaoContract(daoContract)
      console.log("Dao contract", daoContract)

      const totalSupply = await daoContract.totalSupply()
      console.log("totalSupply", totalSupply)

      const chairperson = await daoContract.chairperson()
      console.log("chairperson", chairperson)

      //get on-chain proposal data
      const proposal0 = await daoContract.proposals(0)
      const proposal1 = await daoContract.proposals(1)
      setProposals([proposal0, proposal1])
      console.log("first proposal", proposal0)

    }else{
      alert("DAO got talent is in development! Please connect to rinkeby test network to access website.")
    }
  }

  //triggers login and creates connection to dao contract
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount(); // login
      await connectToContracts() //connect to DAO contract
    }
  };

  //rendered component
  return (
    <Router>
      <VStack h="full">
        {/* HEADER */}
        <Flex
          w="100%"
          justify="space-between"
          h="60px"
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

          {walletAddress !== "" ? (
            <Box>Logged in as {walletAddress}</Box>
          ) : (
            <Box onClick={connectWallet}>Wallet login</Box>
          )}
        </Flex>

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
              <Route path="/vote" element={<Vote daoContract={daoContract}/>} />
              <Route path="/my-collections" element={<MyCollections />} />
            </Routes>
          </Flex>
        </Flex>
      </VStack>
    </Router>
  );
}

export default App;
