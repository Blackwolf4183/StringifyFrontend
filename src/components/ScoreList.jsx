import { Heading, VStack, Box, Wrap, Spinner } from "@chakra-ui/react";
import React from "react";

const ScoreList = ({ alphabetScores }) => {
  return (
    <VStack spacing="5">
      <VStack>
        <Heading textAlign={"center"}>Puntuaciones</Heading>
        <Box w="80%" h="2px" bgColor="black" />
      </VStack>

      <Wrap justify={"center"} w="320px">
        {!alphabetScores ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#333D51"
            size="xl"
          />
        ) : (
          alphabetScores.map(letter => {
            return (
              <Heading
                key={letter.letra}
                fontSize={"2xl"}
                w="100px"
                color={
                  letter.puntuacion > 0 && letter.puntuacion < 6
                    ? "none"
                    : letter.puntuacion >= 6 && letter.puntuacion < 12
                    ? "yellow.500"
                    : "red.500"
                }
              >
                {letter.letra.toUpperCase()} = {letter.puntuacion}
              </Heading>
            );
          })
        )}
      </Wrap>
    </VStack>
  );
};

export default ScoreList;
