import { Spinner } from "@chakra-ui/react"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Gallery } from "../components/Gallery"
import { ContentWrapper } from "../components/PageWrapper"
import StateContext from "../state/stateContext"

interface Props {}

export function MyCollections(props: Props) {
  const { daoContract } = useContext(StateContext)

  const [collections, setCollections] = useState<any[]>([])
  const [isCollectionsLoading, setIsCollectionsLoading] =
    useState<boolean>(false)

  const [percents, setPercents] = useState<number[]>([])
  const [winningProposalIndex, setwinningProposalIndex] = useState<number>(0)

  useEffect(() => {
    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      if (!daoContract || collections.length > 0 || isCollectionsLoading) return

      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        setIsCollectionsLoading(true)

        const proposals = await daoContract.getAllProposals()
        const winningProposal = await daoContract.getWinningProposal()

        setwinningProposalIndex(winningProposal)
        // TODO: for now, we only have one winning collection

        const ipfsFolderCID = proposals[winningProposal].ipfsFolderCID

        const { data } = await axios.get(
          `https://dweb.link/api/v0/ls?arg=${ipfsFolderCID}`
        )

        const collection = data?.["Objects"]?.[0]?.["Links"] || []
        console.log("Winning collection", collection)

        setCollections(collection)
      } catch (error) {
        console.log(error)
      } finally {
        setIsCollectionsLoading(false)
      }
    }

    const getPercentages = async () => {
      // get percentages of each collection
      if (!daoContract || percents.length > 0 || isCollectionsLoading) return

      try {
        const proposals = await daoContract.getAllProposals()
        // get the total vote count
        const totalVoteCount = await daoContract.getTotalVotes()

        const votePercents = proposals.map((proposal: any) => {
          if (totalVoteCount.toString() === "0") return 0

          return (proposal.voteCount / +totalVoteCount) * 100
        })
        console.log("votePercents", votePercents)

        setPercents(votePercents)
      } catch (error) {
        console.log(error)
      }
    }

    getCollections()
    getPercentages()
  }, [
    collections.length,
    daoContract,
    isCollectionsLoading,
    percents.length,
    winningProposalIndex,
  ])

  return (
    <ContentWrapper>
      {isCollectionsLoading ? (
        <Spinner />
      ) : (
        <Gallery
          images={collections
            .filter((item) => item.Name.endsWith("png"))
            .map((item: any) => "https://ipfs.io/ipfs/" + item.Hash)}
          artistName="Mr T."
          percent={percents[winningProposalIndex]}
        />
      )}
    </ContentWrapper>
  )
}
