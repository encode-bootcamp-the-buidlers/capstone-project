import { Flex, Grid, GridItem, Heading, Spinner, Text } from "@chakra-ui/react"
import { useContext } from "react"
import { useAccount } from "wagmi"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadProposals from "../hooks/useLoadProposals"
import useLoadWinningCollection from "../hooks/useLoadWinningCollection"
import StateContext from "../state/stateContext"

function VotingOverview() {
  const { proposals, isProposalsLoading, winningProposalIndex } =
    useContext(StateContext)

  useLoadProposals()
  useLoadWinningCollection({})

  const { isConnected } = useAccount()

  const totalVotes = proposals.reduce((acc, inc) => {
    acc += inc.voteCount?.toNumber()
    return acc
  }, 0)

  return isProposalsLoading ? (
    <Spinner />
  ) : (
    <ContentWrapper>
      <Heading>Voting Overview</Heading>

      {isConnected ? (
        proposals.length > 0 ? (
          <>
            <Flex>
              <Text>Voting active? </Text>
              <Text ml={5}>
                {proposals.some((proposal) => !proposal.active)
                  ? "Finished"
                  : "Ongoing"}
              </Text>
            </Flex>

            <Text>Total Votes: {totalVotes}</Text>

            <Flex
              mt={5}
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
                  const { index, voteCount, collectionSize } = proposal

                  return (
                    <GridItem
                      key={`proposal-${idx}`}
                      flexDirection="column"
                      border="2px"
                      borderRadius="10px"
                      p={10}
                      bg={
                        winningProposalIndex?.toString() === index?.toString()
                          ? "green.50"
                          : "gray.50"
                      }
                      boxShadow="dark-lg"
                      rounded="md"
                    >
                      <Text>Index: {index?.toString()}</Text>
                      <Text>VoteCount: {voteCount?.toString()}</Text>
                      <Text>
                        Vote:{" "}
                        {totalVotes === 0
                          ? "0"
                          : (voteCount?.toNumber() / totalVotes) * 100}
                        %
                      </Text>
                      <Text>Collection Size: {collectionSize?.toString()}</Text>
                    </GridItem>
                  )
                })}
              </Grid>
            </Flex>
          </>
        ) : (
          <Text>No proposals</Text>
        )
      ) : (
        <Text>
          Please connect to your wallet to interact with the dashboard.
        </Text>
      )}
    </ContentWrapper>
  )
}

export default VotingOverview
