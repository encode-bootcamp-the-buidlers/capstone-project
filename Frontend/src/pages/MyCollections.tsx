import React, { useEffect, useState } from "react";
import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";

import { ethers } from "ethers";

const axios = require("axios");

interface Props {
  daoContract: ethers.Contract;
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
        const percents = await props.daoContract.getVotePercentages();
        setPercents(percents.map((percent: any) => percent / 100));
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
      <Gallery
        images={collections.map((item: any) => "https://ipfs.io/ipfs/" + item)}
        artistName="K"
        percent={percents[1]}
      />
    </ContentWrapper>
  );
}
