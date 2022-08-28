import { Flex, Heading, Spinner, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Gallery } from "../components/Gallery"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadPercentages from "../hooks/useLoadPercentages"
import useLoadProposals from "../hooks/useLoadProposals"
import useLoadWinningCollection from "../hooks/useLoadWinningCollection"
import StateContext from "../state/stateContext"

interface Props {}

export function MyCollections(props: Props) {
  const {
    daoContract,
    winningProposalIndex,
    winningCollection,
    isWinningCollectionsLoading,
  } = useContext(StateContext)

  const { address, isConnected } = useAccount()

  const [percents, setPercents] = useState<number[]>([])

  useLoadProposals()
  useLoadWinningCollection({})

  const [proposalVoters, setProposalVoters] = useState([])
  useLoadPercentages({ percents, setPercents })

  useEffect(() => {
    const getProposalVoters = async () => {
      if (!daoContract || proposalVoters.length > 0) return

      try {
        const voters = await daoContract.getVotersForProposal(
          winningProposalIndex
        )
        setProposalVoters(voters)
      } catch (error) {
        console.log(error)
      }
    }

    getProposalVoters()
  }, [
    daoContract,
    percents.length,
    proposalVoters.length,
    winningProposalIndex,
  ])

  return (
    <ContentWrapper>
      <Heading>Winning collections you've received an airdrop</Heading>

      {isConnected ? (
        isWinningCollectionsLoading ? (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        ) : // @ts-ignore
        !proposalVoters.includes(address) ? (
          <Text>
            You haven't voted for a winning collection yet. Good luck!
          </Text>
        ) : (
          <Gallery
            images={winningCollection
              .filter((item: any) => item.Name.endsWith("png"))
              .map((item: any) => "https://ipfs.io/ipfs/" + item.Hash)}
            artistName="Mr T."
            {...(winningProposalIndex
              ? { percent: percents[winningProposalIndex] }
              : {})}
          />
        )
      ) : (
        <Text>
          Please connect to your wallet to interact with the dashboard.
        </Text>
      )}
    </ContentWrapper>
  )
}
