import React, { useEffect, useState } from "react";

import { Gallery } from "../components/Gallery";
import { ContentWrapper } from "../components/PageWrapper";
import { collections } from "../utils/collections";
import { ethers} from "ethers";

//import contracts
import NftContract from "../contracts/nftContract.json"

//types
interface Props {
  daoContract : ethers.Contract;
  address : string;
  signer: any;
}

export function MyCollections(props:Props) {
  //state variables
  const [nftContract, setNftContract] = useState(new ethers.Contract(ethers.constants.AddressZero, []))

  //initializes the first view of page 
  const init = async () => {

    //connects to NFTToken smart contract
    const nftContract = new ethers.Contract(NftContract.address, NftContract.abi, props.signer)
    setNftContract(nftContract)

    //check out balance of current user
    const balance = await nftContract.balanceOf(props.address)
    console.log("balance", balance.toNumber())
    if(balance.toNumber() === 0){
      alert("You do not own any items of collections which have won!")
    }else{
      //get meta data of nfts owned by current user + voteCount for each collection the user partially owns and has won during voting
      const meta = []
      for(var i = 0; i<balance; i++){
        const id = await nftContract.tokenOfOwnerByIndex(props.address, i) //get token id
        const uri = await nftContract.tokenURI(id) //get uri containing cid of ipfs file and other meta data
        meta.push(uri)

        // TODO get voteCount 
         //const proposal = await = props.daoContract.proposals(id)
      }
      console.log("nfts", meta)
    }    

    
    
  }

  useEffect(() => {
    
    init()

    //get nfts owned by logged in user which won the voting on platform

    

    //get collections
    const getCollections = async () => {
      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
    };
  }, []);

  //functions
  const getVoteResult = async () => {
    try {
      
    } catch (error) {
      console.log(error)
    }
  }
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
