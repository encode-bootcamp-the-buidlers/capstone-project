import { Spinner } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { Gallery } from "../components/Gallery"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadAllCollections from "../hooks/useLoadAllCollection"
import StateContext from "../state/stateContext"

interface Props {}

export function Vote(_props: Props) {
  const { daoContract } = useContext(StateContext)

  //state variables
  const [proposals, setProposals] = useState<any[]>([])
  const [isProposalsLoading, setIsProposalsLoading] = useState(false)
  const [isProposalLoaded, setIsProposalLoaded] = useState(false)

  const [collections, setCollections] = useState<any[]>([])
  const [isCollectionsLoading, setIsCollectionsLoading] =
    useState<boolean>(false)

  useEffect(() => {
    async function loadProposals() {
      if (!daoContract || proposals.length > 0 || isProposalsLoading) return
      try {
        setIsProposalsLoading(true)

        const proposals = await daoContract.getAllProposals()
        console.log("proposals", proposals)

        setProposals(proposals)
        setIsProposalLoaded(true)
      } catch (e: any) {
        console.error(e.message)
      } finally {
        setIsProposalsLoading(false)
      }
    }

    loadProposals()
  }, [daoContract, isProposalsLoading, proposals.length])

  useLoadAllCollections({
    collections,
    setCollections,
    isCollectionsLoading,
    setIsCollectionsLoading,
  })

  return isCollectionsLoading ? (
    <Spinner />
  ) : isProposalLoaded && collections.length > 0 ? (
    <ContentWrapper>
      {collections.map((collection, idx) => (
        <Gallery
          key={idx}
          images={collection
            .filter((item: any) => item.Name.endsWith("png"))
            .map((item: any) => "https://ipfs.io/ipfs/" + item.Hash)}
          artistName={"collection nr. " + idx}
          daoContract={daoContract}
          proposalIndex={idx}
        />
      ))}
    </ContentWrapper>
  ) : (
    <div>No proposals</div>
  )
}
