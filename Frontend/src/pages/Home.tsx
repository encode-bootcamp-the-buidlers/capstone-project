import React, {useEffect, useState} from "react";
import axios from "axios";
import ethers from "ethers";

export function Home() {

  //on mount inner funtion will be executed
  useEffect(()=>{

    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      //get CID of items of each collection

      //get current amount of votes for each collection

      //get issuer of each collection
    }
  }, [])
  return(
    <div>
      <img src="https://ipfs.infura.io/ipfs/QmRoLZm3kyDNjK7joNQepwVm56URE9kWSWXYzckNjXPvGx"></img>
    </div>
  );
}
