import { Box } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import StateContext from "../state/stateContext"

function VotingOverview() {
  const { daoContract } = useContext(StateContext)

  const [currentWinningProposal, setCurrentWinningProposal] = useState("")

  // useEffect(() => {
  //   async function loadDAOInfo() {
  //     if (daoContract && !currentWinningProposal) {
  //       console.dir(daoContract)
  //       const winningProposal = await daoContract.getWinningProposal()
  //       console.log("Current winning proposal:", winningProposal.toString())
  //       setCurrentWinningProposal(winningProposal.toString())
  //     }
  //   }

  //   loadDAOInfo()
  // }, [daoContract, currentWinningProposal])

  return <Box>Current winning proposal: {currentWinningProposal}</Box>
}

export default VotingOverview
