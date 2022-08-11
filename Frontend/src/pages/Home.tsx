import React from "react";
import { Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { ContentWrapper } from "../components/PageWrapper";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export function Home() {
  return (
    <ContentWrapper>
      <Flex alignSelf="center">
        <Heading size="3xl" color="#007eff">
          Welcome To DAOs got talent!
        </Heading>
      </Flex>
      <Text fontSize="lg">
        We are aiming at cutting the noise in the NFT space!! 🚀 🚀 🚀{" "}
      </Text>
      <Image
        maxW="xl"
        src="https://c.tenor.com/4bXSLBEsxlYAAAAC/welcome-terry-crews.gif"
      />
      <Flex alignSelf="center">
        <Heading size="xl" color="#007eff">
          Idea
        </Heading>
      </Flex>
      <Box borderLeft="5px solid #6992bc" pl={8}>
        The NFT space is full of hype and it is easy to get lost if you want to
        get into early projects that show promise.{" "}
        <Text fontWeight="bold">
          So instead we let the DAO members choose on sample collections by a
          vote, before they go on chain.
        </Text>
      </Box>
      <Flex alignSelf="center">
        <Heading size="xl" color="#007eff">
          Execution
        </Heading>
      </Flex>
      <Box borderLeft="5px solid #6992bc" pl={8}>
        With DGT™ artists get a platform to showcase their work, which gets
        voted on by the DAO members. The artists get platform recognition and
        members get a curated collection that they actually want. When a
        collection wins the vote, the voters for that collection get an airdrop
        of the NFT from the collection when it goes live (this trigger will be
        carried out by Chainlink keeper). This way only the most deserving
        collection actually goes through. It's good for the community (the best
        one wins, because nobody needs more ape derivatives), good for the
        artists since they get direct feedback from the community even before
        they go live and good for the Ethereum network since less gas is spent
        on useless collections that no one wants.
      </Box>
      <Flex alignSelf="center" flexDir="column" alignItems="center">
        <Heading size="xl" color="#007eff" mb={12}>
          Team & Links
        </Heading>
        <Link href="https://github.com/aloksahay" isExternal>
          alok <ExternalLinkIcon mx="2px" />
        </Link>
        <Link href="https://github.com/Bitcoinera" isExternal>
          Bitcoinera <ExternalLinkIcon mx="2px" />
        </Link>
        <Link href="https://github.com/Caruso33" isExternal>
          Caruso23 <ExternalLinkIcon mx="2px" />
        </Link>
        <Link href="https://github.com/sidlami" isExternal>
          Sid <ExternalLinkIcon mx="2px" />
        </Link>
        <Link href="https://github.com/lakchote" isExternal>
          Luc <ExternalLinkIcon mx="2px" />
        </Link>
        <Link href="https://github.com/vidvidvid" isExternal>
          vid <ExternalLinkIcon mx="2px" />
        </Link>
        <Link
          href="https://github.com/encode-bootcamp-the-buidlers/capstone-project"
          isExternal
          color="#007eff"
        >
          GitHub repo <ExternalLinkIcon mx="2px" />
        </Link>
        <Link
          href="https://www.figma.com/file/K1Kr9nPDGVQAl4VupLmgb9/Get-DAOwn-on-it!"
          isExternal
          color="#007eff"
        >
          Figma <ExternalLinkIcon mx="2px" />
        </Link>
        <Link
          href="https://docs.google.com/document/d/1z13J6rvdrSP8rKiFUkezwkFL4eh_J7ZzZe1GYx_GJx4/edit#"
          isExternal
          color="#007eff"
        >
          Project brief <ExternalLinkIcon mx="2px" />
        </Link>
      </Flex>
    </ContentWrapper>
  );
}
