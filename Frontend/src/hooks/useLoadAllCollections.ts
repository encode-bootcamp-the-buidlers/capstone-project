import axios from "axios"
import { useContext, useEffect } from "react"
import StateContext from "../state/stateContext"

interface Props {}

export default function useLoadAllCollections(_props: Props) {
  const {
    daoContract,
    collections,
    setCollections,
    isCollectionsLoading,
    setIsCollectionsLoading,
  } = useContext(StateContext)

  useEffect(() => {
    //get collections
    const getCollections = async () => {
      if (!daoContract || collections.length > 0 || isCollectionsLoading) return

      //get CID of items of each collection
      //get current amount of votes for each collection
      //get issuer of each collection
      try {
        setIsCollectionsLoading(true)

        const collections = []
        const proposals = await daoContract.getAllProposals()

        for (const proposal of proposals) {
          const ipfsFolderCID = proposal.ipfsFolderCID

          const { data } = await axios.get(
            `https://dweb.link/api/v0/ls?arg=${ipfsFolderCID}`
          )

          const collection = data?.["Objects"]?.[0]?.["Links"] || []

          collections.push(collection)
        }

        setCollections(collections)
      } catch (error) {
        console.log(error)
      } finally {
        setIsCollectionsLoading(false)
      }
    }

    getCollections()
  }, [
    collections.length,
    daoContract,
    isCollectionsLoading,
    setCollections,
    setIsCollectionsLoading,
  ])
}
