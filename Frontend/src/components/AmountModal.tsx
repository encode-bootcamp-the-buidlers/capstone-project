import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";

function AmountModal({
  onClose,
  isOpen,
  confirmationAction,
}: {
  onClose: () => void;
  isOpen: boolean;
  confirmationAction: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setAmount("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select the amount of tokens to vote with</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box mb={2}>Governance Token Amount</Box>
            <Input
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                confirmationAction(Number(amount));
                onClose();
                setAmount("");
              }}
            >
              Vote
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AmountModal;
