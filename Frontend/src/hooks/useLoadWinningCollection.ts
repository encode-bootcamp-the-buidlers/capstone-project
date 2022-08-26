import axios from "axios"
import React, { useContext } from "react"
import StateContext from "../state/stateContext"

interface Props {}

export default function useLoadWinningCollection(_props: Props) {
  const {
    daoContract,

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
        winningCollection ||
        !winningProposalIndex ||
        isWinningCollectionsLoading
      )
        return

      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        setIsWinningCollectionsLoading(true)

        const proposals = await daoContract.getAllProposals()
        const winningProposal = await daoContract.getWinningProposal()

        setWinningProposalIndex(winningProposal)
        // TODO: for now, we only have one winning collection

        const ipfsFolderCID = proposals[winningProposalIndex].ipfsFolderCID

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
    isWinningCollectionsLoading,
    setIsWinningCollectionsLoading,
    setWinningCollection,
    setWinningProposalIndex,
    winningCollection,
    winningProposalIndex,
  ])
}
