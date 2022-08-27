import { ethers } from "ethers"
import { useContext, useEffect } from "react"
import { useNetwork, useSigner } from "wagmi"
import DaoContract from "../contracts/daoContract.json"
import StateContext from "../state/stateContext"

export default function useLoadContracts() {
  const { chain } = useNetwork()
  const { data: signer } = useSigner()

  const { setDaoContract } = useContext(StateContext)

  useEffect(() => {
    const connectToContracts = async () => {
      if (
        chain?.id &&
        // @ts-ignore
        chain.id.toString() !== process.env.REACT_APP_DEPLOYED_CHAIN_ID!
      ) {
        alert(
          "DAO got talent is in development! Please connect to rinkeby test network to access website."
        )
        return
      }

      if (!signer || !chain?.id) return

      if (!Object.keys(DaoContract).includes(chain.id.toString())) {
        alert(`No deployment found for Chain ${chain.name} // ${chain.id}.`)
        return
      }

      const daoContract = new ethers.Contract(
        (DaoContract as any)[chain.id.toString()].address,
        (DaoContract as any)[chain.id.toString()].abi,
        signer
      )

      setDaoContract(daoContract)
      console.log("Dao contract", daoContract)

      const totalSupply = await daoContract.totalSupply()
      console.log("totalSupply", totalSupply.toString())
    }

    connectToContracts()
  }, [chain?.id, chain?.name, setDaoContract, signer])
}
