import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";

import { ethers } from "ethers";

const axios = require("axios");

interface Props {
  daoContract: ethers.Contract;
}

interface Gallery {
  index: number;
  items?: string[];
}

export function MyCollections(props: Props) {
  const [collections, setCollections] = useState<any[]>([]);
  const [percents, setPercents] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);

  useEffect(() => {
    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        const collections = await props.daoContract.getAccountCollections();
        setCollections(collections);
        console.log("COLLECTIONS", collections);
      } catch (error) {
        console.log(error);
      }
    };
    const getPercentages = async () => {
      // get percentages of each collection
      try {
        const proposals = await props.daoContract.getAllProposals();
        // get the total vount count
        const totalVoteCount = await props.daoContract.getTotalVotes();
        const votePercents = proposals.map((proposal: any) => {
          return (proposal.voteCount / totalVoteCount) * 100;
        });
        // TODO: for now, we only have one winning collection
        const winningCollectionIndex =
          await props.daoContract.getWinningProposal();
        setPercents(votePercents[winningCollectionIndex]);
      } catch (error) {
        console.log(error);
      }
    };
    getCollections();
    getPercentages();
  }, []);
  return (
    <ContentWrapper>
      <Gallery
        images={collections.map((item: any) => "https://ipfs.io/ipfs/" + item)}
        artistName="T"
        percent={percents[0]}
      />
      <Box></Box>
    </ContentWrapper>
  );
}
