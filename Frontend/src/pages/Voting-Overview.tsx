import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { useContext } from "react"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadAllCollections from "../hooks/useLoadAllCollections"
import useLoadProposals from "../hooks/useLoadProposals"
import useLoadWinningCollection from "../hooks/useLoadWinningCollection"
import StateContext from "../state/stateContext"

function VotingOverview() {
  const { daoContract, proposals, isProposalsLoading, winningProposalIndex } =
    useContext(StateContext)

  useLoadProposals()
  useLoadWinningCollection({})
  // useLoadAllCollections({})

  // TODO: This component is here to show some basic metrics for the current ballot
  // like proposal count, proposal owners
  // collection preview?
  // voting count on the collections
  // total votes until now
  // eligible voting count
  // more?

  const totalVotes = proposals.reduce((acc, inc) => {
    acc += inc.voteCount?.toNumber()
    return acc
  }, 0)

  return isProposalsLoading ? (
    <Spinner />
  ) : proposals.length > 0 ? (
    <ContentWrapper>
      <Flex flexDir="column">
        <Heading as="h2">Voting Overview</Heading>

        <Flex mt={10}>
          <Text>Voting active? </Text>
          <Text ml={5}>
            {proposals.some((proposal) => !proposal.active)
              ? "Finished"
              : "Ongoing"}
          </Text>
        </Flex>

        <Text mt={5}>Total Votes: {totalVotes}</Text>

        <Flex
          mt={10}
          alignItems="center"
          justifyContent="center"
          w="full"
          mb={4}
        >
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={4}
            height="fit-content"
            justifyContent="center"
          >
            {proposals.map((proposal, idx) => {
              const { index, voteCount, collectionSize, active } = proposal

              return (
                <GridItem
                  key={`proposal-${idx}`}
                  flexDirection="column"
                  border="2px"
                  borderRadius="10px"
                  p={10}
                  bg={
                    winningProposalIndex?.toString() === index?.toString()
                      ? "green.100"
                      : ""
                  }
                >
                  <Text>Index: {index?.toString()}</Text>
                  <Text>VoteCount: {voteCount?.toString()}</Text>
                  <Text>
                    Vote %:{" "}
                    {totalVotes?.toString() === "0"
                      ? "0"
                      : voteCount?.toNumber() / totalVotes?.toNumber()}
                  </Text>
                  <Text>Collection Size: {collectionSize?.toString()}</Text>
                  <Text>Is active: {active?.toString()}</Text>
                </GridItem>
              )
            })}
          </Grid>
        </Flex>
      </Flex>
    </ContentWrapper>
  ) : (
    <div>No proposals</div>
  )
}

export default VotingOverview
