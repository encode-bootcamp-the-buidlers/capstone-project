import { Box, Divider, Flex, Image } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import mycollections from "../assets/mycollections.svg"
import vote from "../assets/vote.svg"

interface Props {
  children: React.ReactNode
}

export default function Sidebar({ children }: Props) {
  return (
    <Flex w="full" h="calc(100% - 60px)" px={8} pt={8}>
      <Flex w={60} h="full" flexDir="column" gap={6}>
        {/* <Link to="/voting-overview">
          <Flex alignItems="center" gap={4}>
            <Box w={6}>
              <Image src={vote} alt="logo" />
            </Box>
            Voting Overview
          </Flex>
        </Link> */}

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

      {children}
    </Flex>
  )
}
