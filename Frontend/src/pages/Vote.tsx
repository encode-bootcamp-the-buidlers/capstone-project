import { Box, Flex, Heading, Spinner } from "@chakra-ui/react"
import { useContext } from "react"
import { Gallery } from "../components/Gallery"
import { ContentWrapper } from "../components/PageWrapper"
import useLoadAllCollections from "../hooks/useLoadAllCollections"
import useLoadProposals from "../hooks/useLoadProposals"
import StateContext from "../state/stateContext"

interface Props {}

export function Vote(_props: Props) {
  const { daoContract, collections, isCollectionsLoading } =
    useContext(StateContext)

  useLoadProposals()
  useLoadAllCollections({})

  return isCollectionsLoading ? (
    <Spinner />
  ) : collections.length > 0 ? (
    <ContentWrapper>
      <Heading>Vote for a Proposal</Heading>

      <Box mt={10}>
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
      </Box>
    </ContentWrapper>
  ) : (
    <div>No proposals</div>
  )
}
