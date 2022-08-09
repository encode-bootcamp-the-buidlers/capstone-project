import { Flex } from "@chakra-ui/react";
import React from "react";

export const ContentWrapper: React.FC<{ children: JSX.Element[] }> = ({
  children,
}) => {
  return (
    <Flex h="full" w="full">
      <Flex
        minW="4xl"
        bgColor="gray.100"
        borderRadius={14}
        p={6}
        flexDir="column"
        gap={12}
        overflow="auto"
        max-height="100vh"
        pb={12}
      >
        {children}
      </Flex>
    </Flex>
  );
};
