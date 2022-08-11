import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ethers } from "ethers";
import checkmark from "../assets/checkmark.svg";
import AmountModal from "./AmountModal";
import { toast } from "react-hot-toast";

export const handleError = (error: any) => {
  toast.error(
    (error as { error?: Error }).error?.message ?? (error as Error).message
  );
};

type GalleryProps = {
  images: string[];
  artistName: string;
  percent?: number;
  daoContract?: ethers.Contract;
  proposalIndex?: number;
};

export const Gallery: React.FC<GalleryProps> = ({
  images,
  artistName,
  percent,
  daoContract,
  proposalIndex,
}) => {
  const vote = async (amount: number) => {
    if (daoContract) {
      try {
        await daoContract.vote(proposalIndex, amount);
      } catch (error) {
        handleError(error);
      }
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column">
      <Flex alignItems="center" justifyContent="space-between" w="full" mb={4}>
        <Flex alignItems="center" gap={3}>
          <Avatar name={artistName} size="sm" />
          <Text color="#7080A4">
            Last week's collection by Artist {artistName}.
          </Text>
        </Flex>

        {percent && (
          <Flex gap={3}>
            <Text color="#20BE72">{percent}% votes</Text>
            <Image src={checkmark} alt="checkmark" />
          </Flex>
        )}

        {!percent && (
          <Flex gap={3}>
            <Button
              // onClick={() => vote()}
              borderRadius="full"
              borderColor="#20BE72"
              color="#20BE72"
              borderWidth={1}
              h={8}
              px={8}
              onClick={onOpen}
            >
              Vote
            </Button>
            <AmountModal
              onClose={onClose}
              isOpen={isOpen}
              confirmationAction={vote}
            />
          </Flex>
        )}
      </Flex>
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
    </Flex>
  );
};
