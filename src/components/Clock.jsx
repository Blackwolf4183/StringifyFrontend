import React from "react";
import {
  Heading,
  VStack,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

const Clock = ({ seconds }) => {
  return (
    <VStack>
      <CircularProgress
        value={(seconds / 30) * 100}
        size="120px"
        thickness="4px"
        color={
          seconds < 30
            ? seconds < 15
              ? seconds < 10
                ? "red.400"
                : "orange"
              : "#333D51"
            : "green.400"
        }
      >
        <CircularProgressLabel>
          <Heading>{seconds}</Heading>
        </CircularProgressLabel>
      </CircularProgress>
    </VStack>
  );
};

export default Clock;
