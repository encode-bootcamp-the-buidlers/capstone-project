import React, { useEffect, useState} from "react";
import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";
import { collections } from "../utils/collections";

import { ethers } from "ethers";
import{ create } from "ipfs-http-client";

const axios = require('axios');

interface Props {
  daoContract: ethers.Contract;
}

export function Vote(props : Props) {

  //state variables
  const [proposals, setProposals] = useState<any[]>([])

  //effect on mount
  useEffect(() => {
    console.log("contract in vote", props.daoContract)
    //connect to Ballot smart contract

    //get collections
    const getProposedCollections = async () => {
      try {

        //get proposal data
        const proposal0 = await props.daoContract.proposals(0)
        const proposal1 = await props.daoContract.proposals(1)
        console.log("proposal0",proposal0)
        setProposals([proposal0, proposal1])

        //get CID of items of each collection
        const url = 'https://dweb.link/api/v0';
        const ipfs = create({ url });

        const links = [];
        for await (const link of ipfs.ls(proposal0.ipfsFolderCID)) {
          links.push(link);
        }
        console.log(links);

          //const proposedCollection0 = await axios.get("https://ipfs.infura.io/ipfs/"+proposal0.ipfsFolderCID)
          //console.log(proposedCollection0)
        //get current amount of votes for each collection
        //get issuer of each collection
      } catch (error) {
        console.log(error)
      }
    };
    getProposedCollections()
  }, []);
  return (
    <ContentWrapper>
      <Gallery
        images={collections[0].items.map(
          (item) => "https://ipfs.infura.io/ipfs/" + item
        )}
        artistName="T"
        voteAddress="1337"
      />
      <Gallery
        images={collections[1].items.map(
          (item) => "https://ipfs.infura.io/ipfs/" + item
        )}
        artistName="K"
        voteAddress="69"
      />
    </ContentWrapper>
  );
}
