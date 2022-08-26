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
} from "@chakra-ui/react"
import { useState } from "react"
import { ContentWrapper } from "../components/PageWrapper"

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

  return (
    <ContentWrapper>
      <Heading>Add Proposal</Heading>

      <FormControl mt={10}>
        <FormLabel>Collection Size</FormLabel>
        {/* <Input type="number" min={0} step={1} /> */}
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
          isInvalid={input.collectionSize}
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
          isInvalid={input.ipfsFolderCID}
        />
        <FormHelperText>
          Please label your collection 0.json, 1.json, ... inside the folder
        </FormHelperText>
      </FormControl>

      <Button colorScheme="teal">Submit</Button>
    </ContentWrapper>
  )
}
