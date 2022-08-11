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

interface NFT {
  meta_data? : any
}
export function MyCollections(props:Props) {
  //state variables
  const [nftContract, setNftContract] = useState(new ethers.Contract(ethers.constants.AddressZero, []))
  const [nfts, setNfts] = useState<NFT[]>([])

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
      const owned_nfts = []
      for(var i = 0; i<balance; i++){
        const id = await nftContract.tokenOfOwnerByIndex(props.address, i) //get token id
        const meta_data = await nftContract.tokenURI(id) //get uri containing cid of ipfs file and other meta data
        owned_nfts.push({meta_data :  meta_data})

        // TODO get voteCount 
         //const proposal = await = props.daoContract.proposals(id)

        // TODO get issuer of collection
      }
      console.log("owned nfts", owned_nfts)
    }    

    
    
  }

  //on mount
  useEffect(() => {
    init() //initilize getting crucial data for starting page of MyCollection
  }, []);

  return (
    nfts ? 
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
      :
    <div>You do not own NFTs which one the voting!</div>
  );
}
