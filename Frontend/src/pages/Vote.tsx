import { Box, Heading, Spinner, Text } from "@chakra-ui/react"
import { useContext } from "react"
import { useAccount } from "wagmi"
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

  const { isConnected } = useAccount()

  return isCollectionsLoading ? (
    <Spinner />
  ) : (
    <ContentWrapper>
      <Heading>Vote for a Proposal</Heading>

      {isConnected ? (
        collections.length > 0 ? (
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
