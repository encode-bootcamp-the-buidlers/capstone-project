import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import React from "react";

import { Gallery } from "../components/Gallery";

import A1 from "../assets/collections/A1.png";
import A2 from "../assets/collections/A2.png";
import A3 from "../assets/collections/A3.png";
import A4 from "../assets/collections/A4.png";
import A5 from "../assets/collections/A5.png";
import B1 from "../assets/collections/B1.png";
import B2 from "../assets/collections/B2.png";
import B3 from "../assets/collections/B3.png";
import B4 from "../assets/collections/B4.png";
import B5 from "../assets/collections/B5.png";

export function MyCollections() {
  return (
    <Flex h="full" w="full">
      <Flex
        minW="4xl"
        bgColor="gray.100"
        borderRadius={14}
        p={6}
        flexDir="column"
        gap={8}
      >
        <Gallery images={[A1, A2, A3, A4, A5]} artistName="T" percent={67} />
        <Gallery images={[B1, B2, B3, B4, B5]} artistName="K" percent={43} />
      </Flex>
    </Flex>
  );
}
