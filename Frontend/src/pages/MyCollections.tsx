import React, { useEffect } from "react";

import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";
import { collections } from "../utils/collections";
import { ethers } from "ethers";

//import contracts
import NftContract from "../contracts/nftContract.json"

//types
interface Props {
  signer: any;
}

export function MyCollections(props:Props) {

  

  const connectToNFT = async () => {
    const nftContract = new ethers.Contract(NftContract.address, NftContract.abi, props.signer)
  }

  useEffect(() => {
    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
    };
  }, []);
  return (
    <ContentWrapper>
      <Gallery
        images={collections[0].items.map(
          (item) => "https://ipfs.io/ipfs/" + item
        )}
        artistName="T"
        percent={67}
      />
      <Gallery
        images={collections[1].items.map(
          (item) => "https://ipfs.io/ipfs/" + item
        )}
        artistName="K"
        percent={43}
      />
    </ContentWrapper>
  );
}
