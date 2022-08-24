import { Flex, Spinner, Text } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Gallery } from "../components/Gallery"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadPercentages from "../hooks/useLoadPercentages"
import useLoadWinningCollection from "../hooks/useLoadWinningCollection"
import StateContext from "../state/stateContext"

interface Props {}

export function MyCollections(props: Props) {
  const { daoContract } = useContext(StateContext)

  const { address } = useAccount()

  const [collection, setCollection] = useState<any>()
  const [isCollectionsLoading, setIsCollectionsLoading] =
    useState<boolean>(false)

  const [percents, setPercents] = useState<number[]>([])
  const [winningProposalIndex, setwinningProposalIndex] = useState<number>(0)

  useLoadWinningCollection({
    collection,
    setCollection,
    isCollectionsLoading,
    setIsCollectionsLoading,
    winningProposalIndex,
    setwinningProposalIndex,
  })

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
      {isCollectionsLoading ? (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      ) : // @ts-ignore
      !proposalVoters.includes(address) ? (
        <Text>You haven't voted for a winning collection yet. Good luck!</Text>
      ) : (
        <Gallery
          images={collection
            .filter((item: any) => item.Name.endsWith("png"))
            .map((item: any) => "https://ipfs.io/ipfs/" + item.Hash)}
          artistName="Mr T."
          percent={percents[winningProposalIndex]}
        />
      )}
    </ContentWrapper>
  )
}
