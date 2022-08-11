import React, { useEffect, useState } from "react";
import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";

import { ethers } from "ethers";

const axios = require("axios");

interface Props {
  daoContract: ethers.Contract;
}

export function Vote(props: Props) {
  //state variables
  const [proposals, setProposals] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);

  //effect on mount
  useEffect(() => {
    console.log("contract in vote", props.daoContract);
    //connect to Ballot smart contract

    //get collections
    const getProposedCollections = async () => {
      try {
        //get proposal data
        const proposals = await props.daoContract.getAllProposals();
        setProposals(proposals);

        // get collection from ipfs and store it in galleries array
        interface Gallery {
          index: number;
          items?: string[];
        }
        const galleries = [];
        for (const proposal of proposals) {
          // access ipfs folder of proposal
          const collection = await axios.get(
            "https://dweb.link/api/v0/ls?arg=" + proposal.ipfsFolderCID
          );

          // final gallery object containing all information
          const gallery: Gallery = {
            index: proposal["index"].toNumber(),
          };

          // get CID of files in ipfs folder and store it in gaery object
          const cids = [];
          for (const item of collection["data"]["Objects"][0]["Links"]) {
            if (item["Name"].includes("png")) {
              cids.push(item["Hash"]);
            }
          }
          gallery.items = cids;
          galleries.push(gallery);
        }
        setGalleries(galleries);
        console.log("galleries", galleries);
      } catch (error) {
        console.log(error);
      }
    };
    getProposedCollections();
  }, []);
  return galleries ? (
    <ContentWrapper>
      {galleries.map((gallery, idx) => (
        <Gallery
          key={idx}
          images={gallery.items.map(
            //before: https://ipfs.io/ipfs/
            (item: any) => "https://ipfs.io/ipfs/" + item
          )}
          artistName={"collection nr. " + gallery.index}
          daoContract={props.daoContract}
          proposalIndex={idx}
        />
      ))}
    </ContentWrapper>
  ) : (
    <div>No proposals</div>
  );
  /*
  <Gallery
        images={collections[0].items.map(
          (item) => "https://ipfs.io/ipfs/" + item
        )}
        artistName="T"
        voteAddress="1337"
      />
      <Gallery
        images={collections[1].items.map(
          (item) => "https://ipfs.io/ipfs/" + item
        )}
        artistName="K"
        voteAddress="69"
      />
  */
}
