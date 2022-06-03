import { Heading, VStack, Text, Grid, Box, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GameHeading from "./GameHeading";
import { AppContext } from "../context/app-context";
import { useContext } from "react";
import axios from "axios";
import Footer from "./Footer";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);

const Scores = () => {
  const appContext = useContext(AppContext);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    axios
      .get("https://stringify-app.herokuapp.com/api/topusers")
      .then((response) => {
        setScores(response.data);
        console.log(response.data); /* TODO: REMOVE */
        setHasLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
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
              <MotionVStack
                transformOrigin="bottom"
                animate={{ scaleY: [0, 1] }}
                transition={{ duration: 0.8 }}
              >
                <Text fontWeight={"600"} fontSize="xl">
                  {scores[1] && scores[1].nombre}
                </Text>
                <Box borderRadius={"md"} w="80px" h="150px" bgColor="primary" />
              </MotionVStack>
              <MotionVStack
                transformOrigin="bottom"
                animate={{ scaleY: [0, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Text fontWeight={"600"} fontSize="xl">
                  {scores[0] && scores[0].nombre}
                </Text>
                <Box
                  borderRadius={"md"}
                  w="80px"
                  h="200px"
                  bgColor="secondary"
                />
              </MotionVStack>
              <MotionVStack
                transformOrigin="bottom"
                animate={{ scaleY: [0, 1] }}
                transition={{ duration: 1 }}
              >
                <Text fontWeight={"600"} fontSize="xl">
                  {scores[2] && scores[2].nombre}
                </Text>
                <Box borderRadius={"md"} w="80px" h="125px" bgColor="primary" />
              </MotionVStack>
            </Grid>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gridGap={"15px"}
              justify={"center"}
              pb={!hasLoaded ? null : "100px"}
            >
              <VStack spacing="0">
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

              <VStack spacing="0">
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

        {appContext.lastPlayed && appContext.lastPlayed !== 25 && (
          <VStack spacing="0" pb="20">
            <Heading>Vuelve a jugar en</Heading>
            <Heading>{Math.round(24 - appContext.lastPlayed)} h</Heading>
          </VStack>
        )}
      </VStack>
      {hasLoaded && <Footer />}
      
    </>
  );
};

export default Scores;
