import React, { useEffect, useState } from "react";

import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";
import { collections } from "../utils/collections";
import { ethers, Signer } from "ethers";

//import contracts
import NftContract from "../contracts/nftContract.json"

//types
interface Props {
  address : string;
  signer: any;
}

export function MyCollections(props:Props) {
  //state variables
  const [nftContract, setNftContract] = useState(new ethers.Contract(ethers.constants.AddressZero, []))

  //connects to NFTToken smart contract and gets all data about nfts owned by logged in user
  const connectToNftContract = async () => {
    const nftContract = new ethers.Contract(NftContract.address, NftContract.abi, props.signer)
    setNftContract(nftContract)

    //check out balance of current user
    const balance = await nftContract.balanceOf(props.address)
    console.log("balance", balance.toNumber())
    if(balance.toNumber() === 0){
      alert("You do not own any items of collections which have won!")
    }else{
      //get data of nfts owned by current user
      const cids = []
      for(var i = 0; i<balance; i++){
        const id = await nftContract.tokenOfOwnerByIndex(props.address, i) //get token id
        const uri = await nftContract.tokenURI(id) //get uri containing cid of ipfs file
        cids.push(uri)
      }
      console.log("nfts",cids)
    }    
  }

  useEffect(() => {
    //connect to Ballot smart contract
    connectToNftContract()
    
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
