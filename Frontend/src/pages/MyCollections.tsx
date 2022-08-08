import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import React from "react";
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
        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
          height="fit-content"
          justifyContent="center"
        >
          <GridItem rowSpan={2} colSpan={2}>
            <Image src={A1} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={A2} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={A3} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={A4} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={A5} />
          </GridItem>
        </Grid>

        <Grid
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
          height="fit-content"
          justifyContent="center"
        >
          <GridItem rowSpan={2} colSpan={2}>
            <Image src={B1} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={B2} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={B3} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={B4} />
          </GridItem>
          <GridItem colSpan={1}>
            <Image src={B5} />
          </GridItem>
        </Grid>

        <Flex></Flex>
      </Flex>
    </Flex>
  );
}
