import { Button, Box, Flex, Image } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import logo from "../assets/logo.svg"
import useLoadContracts from "../hooks/useLoadContracts"

function Header() {
  useLoadContracts()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const { address, isConnected } = useAccount()

  return (
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

      {isConnected ? (
        <Flex alignItems={"center"}>
          <Box>Logged in as {address}</Box>
          <Button ml={5} onClick={() => disconnect()}>
            Logout
          </Button>
        </Flex>
      ) : (
        <Button onClick={() => connect()}>Wallet login</Button>
      )}
    </Flex>
  )
}

export default Header
