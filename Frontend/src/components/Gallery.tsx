import { Grid, GridItem, Image } from "@chakra-ui/react";
import React from "react";

type GalleryProps = {
  images: string[];
};

export const Gallery: React.FC<GalleryProps> = ({ images }) => (
  <Grid
    templateRows="repeat(2, 1fr)"
    templateColumns="repeat(4, 1fr)"
    gap={4}
    height="fit-content"
    justifyContent="center"
  >
    <GridItem rowSpan={2} colSpan={2}>
      <Image src={images[0]} />
    </GridItem>
    <GridItem colSpan={1}>
      <Image src={images[1]} />
    </GridItem>
    <GridItem colSpan={1}>
      <Image src={images[2]} />
    </GridItem>
    <GridItem colSpan={1}>
      <Image src={images[3]} />
    </GridItem>
    <GridItem colSpan={1}>
      <Image src={images[4]} />
    </GridItem>
  </Grid>
);
