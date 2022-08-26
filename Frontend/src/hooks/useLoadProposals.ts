import { useContext, useEffect } from "react"
import StateContext from "../state/stateContext"

export default function useLoadProposals() {
  const {
    daoContract,
    proposals,
    setProposals,
    isProposalsLoading,
    setIsProposalsLoading,
  } = useContext(StateContext)

  useEffect(() => {
    async function loadProposals() {
      if (!daoContract || proposals.length > 0 || isProposalsLoading) return

      try {
        setIsProposalsLoading(true)

        const proposals = await daoContract.getAllProposals()
        console.log("proposals", proposals)

        setProposals(proposals)
      } catch (e: any) {
        console.error(e.message)
      } finally {
        setIsProposalsLoading(false)
      }
    }

    loadProposals()
  }, [
    daoContract,
    isProposalsLoading,
    proposals.length,
    setIsProposalsLoading,
    setProposals,
  ])
}
