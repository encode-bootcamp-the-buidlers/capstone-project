import axios from "axios"
import React, { useContext } from "react"
import StateContext from "../state/stateContext"

interface Props {}

export default function useLoadWinningCollection(_props: Props) {
  const {
    daoContract,

    proposals,

    isWinningCollectionsLoading,
    setIsWinningCollectionsLoading,

    winningProposalIndex,
    setWinningProposalIndex,
    winningCollection,
    setWinningCollection,
  } = useContext(StateContext)

  React.useEffect(() => {
    //connect to Ballot smart contract

    //get collections
    const getCollections = async () => {
      if (
        !daoContract ||
        proposals.length === 0 ||
        winningProposalIndex ||
        winningCollection ||
        isWinningCollectionsLoading
      )
        return

      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        setIsWinningCollectionsLoading(true)

        const winningProposalIndex = await daoContract.getWinningProposal()
        console.log("Winning Proposal Index", winningProposalIndex)

        setWinningProposalIndex(winningProposalIndex)
        // TODO: for now, we only have one winning collection

        const ipfsFolderCID =
          proposals[winningProposalIndex?.toNumber()].ipfsFolderCID

        const { data } = await axios.get(
          `https://dweb.link/api/v0/ls?arg=${ipfsFolderCID}`
        )

        const collection = data?.["Objects"]?.[0]?.["Links"] || []
        console.log("Winning collection", collection)

        setWinningCollection(winningCollection)
      } catch (error) {
        console.log(error)
      } finally {
        setIsWinningCollectionsLoading(false)
      }
    }

    getCollections()
  }, [
    daoContract,
    proposals,
    isWinningCollectionsLoading,
    setIsWinningCollectionsLoading,
    setWinningCollection,
    setWinningProposalIndex,
    winningCollection,
    winningProposalIndex,
  ])
}
