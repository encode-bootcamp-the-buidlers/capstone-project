import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Box,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { useSigner } from "wagmi"
import { ContentWrapper } from "../components/PageWrapper"
import StateContext from "../state/stateContext"

interface Props {}

export function AddProposal(_props: Props) {
  const [input, setInput] = useState<any>({
    collectionSize: "",
    ipfsFolderCID: "",
  })
  const [isError, setIsError] = useState({
    collectionSize: false,
    ipfsFolderCID: false,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { daoContract } = useContext(StateContext)

  const { data: signer } = useSigner()

  async function onSubmit() {
    if (!daoContract) return

    if (!input.collectionSize) {
      setIsError({ ...isError, collectionSize: true })
      return
    }
    if (!input.ipfsFolderCID) {
      setIsError({ ...isError, ipfsFolderCID: true })
      return
    }
    setIsError({ collectionSize: false, ipfsFolderCID: false })

    setIsSubmitting(true)
    await daoContract.addProposal(
      input.collectionSize,
      `${input.ipfsFolderCID}/` // needed so that the contract doesn't have to add the '/'
    )
    setInput({
      collectionSize: "",
      ipfsFolderCID: "",
    })
    setIsSubmitting(false)
  }

  return signer ? (
    <ContentWrapper>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Heading>Add Proposal</Heading>

        <FormControl mt={10}>
          <FormLabel>Collection Size</FormLabel>

          <NumberInput
            min={0}
            step={1}
            value={input.collectionSize}
            onChange={(value) =>
              setInput({
                ...input,
                collectionSize: value,
              })
            }
            isInvalid={isError.collectionSize}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            How many items does your collection have?
          </FormHelperText>

          <FormLabel mt={5}>IPFS Folder CID</FormLabel>
          <Input
            type="text"
            value={input.ipfsFolderCID}
            onChange={(e) =>
              setInput({
                ...input,
                ipfsFolderCID: e.target.value,
              })
            }
            isInvalid={isError.ipfsFolderCID}
          />
          <FormHelperText>
            Please label your collection 0.json, 1.json, ... inside the folder
          </FormHelperText>
        </FormControl>

        <Button
          colorScheme="teal"
          isDisabled={isSubmitting}
          onClick={() => onSubmit()}
          w="fit-content"
          marginTop="30px"
          px="30px"
          py="10px"
          borderRadius="md"
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </Box>
    </ContentWrapper>
  ) : (
    <div>Log in with your wallet</div>
  )
}
