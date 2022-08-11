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

  useEffect(() => {
    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        const proposals = await props.daoContract.getAllProposals();
        const winningProposalIndex =
          await props.daoContract.getWinningProposal();
        const ipfsFolderCID = proposals[winningProposalIndex].ipfsFolderCID;
        const collection = await axios.get(
          "https://dweb.link/api/v0/ls?arg=" + ipfsFolderCID
        );
        console.log("COLLECTION", collection);

        // get CID of files in ipfs folder and store it in gaery object
        const cids = [];
        for (const item of collection["data"]["Objects"][0]["Links"]) {
          if (item["Name"].includes("png")) {
            cids.push(item["Hash"]);
          }
        }
        setCollections(cids);
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
