import { Heading, VStack, Text, Grid, Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GameHeading from "./GameHeading";
import { AppContext } from "../context/app-context";
import { useContext } from "react";
import axios from "axios";

const Scores = () => {
  const appContext = useContext(AppContext);

  const [scores, setScores] = useState(null);

  useEffect(() => {

    axios
      .get("http://localhost:8000/api/topusers")
      .then((response) => {
        setScores(response.data);
        console.log(response.data); /* TODO: REMOVE */
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  
  return (
    <VStack spacing="10">
      <GameHeading />
      <VStack>
        <Heading>Tu Puntuación De Hoy: {appContext.userScore}</Heading>
        <Text fontWeight={"600"} fontSize="xl">
          Ranking de puntuaciones
        </Text>
      </VStack>

      {!scores ? (
        <Spinner />
      ) : (
        <>
          <Grid
            templateColumns="repeat(3, 1fr)"
            alignItems={"end"}
            gridGap={"15px"}
            justify={"center"}
          >
            <VStack>
              <Text fontWeight={"600"} fontSize="xl">
                {scores[1] && scores[1].nombre}
              </Text>
              <Box borderRadius={"md"} w="80px" h="150px" bgColor="primary" />
            </VStack>
            <VStack>
              <Text fontWeight={"600"} fontSize="xl">
                {scores[0] && scores[0].nombre}
              </Text>
              <Box borderRadius={"md"} w="80px" h="200px" bgColor="secondary" />
            </VStack>
            <VStack>
              <Text fontWeight={"600"} fontSize="xl">
                {scores[2] && scores[2].nombre}
              </Text>
              <Box borderRadius={"md"} w="80px" h="125px" bgColor="primary" />
            </VStack>
          </Grid>

          <Grid
            templateColumns="repeat(2, 1fr)"
            gridGap={"15px"}
            justify={"center"}
          >
            <VStack>
              <Heading fontWeight={"600"} fontSize="2xl">
                Nombre
              </Heading>
              <Box w="100%" h="2px" bgColor={"primary"} />
              {scores.map((score, index) => {
                if (index < 10) {
                  return (
                    <Text fontWeight={"600"} fontSize="xl" key={score.id}>
                      {index + 1 + ". " + score.nombre}
                    </Text>
                  );
                }
              })}
            </VStack>

            <VStack>
              <Heading fontWeight={"600"} fontSize="2xl">
                Pts
              </Heading>
              <Box w="100%" h="2px" bgColor={"primary"} />
              {scores.map((score, index) => {
                if (index < 10) {
                  return (
                    <Text fontWeight={"600"} fontSize="xl" key={score.id}>
                      {score.score}
                    </Text>
                  );
                }
              })}
            </VStack>
          </Grid>
        </>
      )}

      {(appContext.lastPlayed  && appContext.lastPlayed !== 25) && (
        <VStack spacing="0" pb="10" >
          <Heading>Vuelve a jugar en</Heading>
          <Heading>{Math.round(24 - appContext.lastPlayed)} h</Heading>
        </VStack>
      )}
    </VStack>
  );
};

export default Scores;
