import axios from "axios";
import React, { useContext } from "react";
import StateContext from "../state/stateContext";

interface Props {
  collection: any[];
  setCollection: any;
  isCollectionsLoading: boolean;
  setIsCollectionsLoading: any;
  winningProposalIndex: any;
  setwinningProposalIndex: any;
}

export default function useLoadWinningCollection({
  collection,
  setCollection,
  isCollectionsLoading,
  setIsCollectionsLoading,
  winningProposalIndex,
  setwinningProposalIndex,
}: Props) {
  const { daoContract } = useContext(StateContext);

  React.useEffect(() => {
    //connect to DAO smart contract

    //get collections
    const getCollections = async () => {
      if (!daoContract || collection || isCollectionsLoading) return;

      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        setIsCollectionsLoading(true);

        const proposals = await daoContract.getAllProposals();
        const winningProposal = await daoContract.getWinningProposal();

        setwinningProposalIndex(winningProposal);
        // TODO: for now, we only have one winning collection

        const ipfsFolderCID = proposals[winningProposal].ipfsFolderCID;

        const { data } = await axios.get(
          `https://dweb.link/api/v0/ls?arg=${ipfsFolderCID}`
        );

        const collection = data?.["Objects"]?.[0]?.["Links"] || [];
        console.log("Winning collection", collection);

        setCollection(collection);
      } catch (error) {
        console.log(error);
      } finally {
        setIsCollectionsLoading(false);
      }
    };

    getCollections();
  }, [
    collection,
    daoContract,
    isCollectionsLoading,
    setCollection,
    setIsCollectionsLoading,
    setwinningProposalIndex,
    winningProposalIndex,
  ]);
}
