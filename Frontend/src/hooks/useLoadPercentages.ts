import { useContext, useEffect } from "react"
import StateContext from "../state/stateContext"

interface Props {
  percents: any[]
  setPercents: any
}

export default function useLoadPercentages({ percents, setPercents }: Props) {
  const { daoContract } = useContext(StateContext)

  useEffect(() => {
    const getPercentages = async () => {
      // get percentages of each collection
      if (!daoContract || percents.length > 0) return

      try {
        const proposals = await daoContract.getAllProposals()
        // get the total vote count
        const totalVoteCount = await daoContract.getTotalVotes()

        const votePercents = proposals.map((proposal: any) => {
          if (totalVoteCount.toString() === "0") return 0

          return (proposal.voteCount / +totalVoteCount) * 100
        })
        console.log("votePercents", votePercents)

        setPercents(votePercents)
      } catch (error) {
        console.log(error)
      }
    }

    getPercentages()
  }, [daoContract, percents.length, setPercents])
}
