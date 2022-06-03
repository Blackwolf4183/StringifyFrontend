import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../context/app-context";
import axios from "axios";
//Custom components
import Clock from "./Clock";
import GameHeading from "./GameHeading";
import ScoreList from "./ScoreList";
//hooks
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router";

const Game = () => {
  //router
  const navigate = useNavigate();

  //context
  const appContext = useContext(AppContext);

  //puntuacion del usuario
  const [hasEndedGame, setHasEndedGame] = useState(false);

  const [alphabetScores, setAlphabetScores] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [currentRequirement, setCurrentRequirement] = useState({
    requirement: "Cargando condición...",
    requirementId: 1,
  });
  const [currentWord, setCurrentWord] = useState(null);
  const [wordList, setWordList] = useState([]); //array para palabras que el usuario va introduciendo
  const [inputError, setInputError] = useState(null);
  const inputRef = useRef();

  const [loadingCheckWordRequest, setloadingCheckWordRequest] = useState(false);

  //al inicio de todo
  useEffect(() => {
    getAlphabetScores();
    getRequirements();
  }, []);

  const restartCycle = (timeout) => {
    if (timeout) addEmptyWord();
    getNewRequirement();
    setCurrentWord(null);
    inputRef.current.value = "";

    if (requirements.length === 0) {
      console.log("Has terminado el juego");
      endGame();
    }
    setStopTimer(false); //desbloqueamos timer
    if (!timeout) {
      //sumamos un extra si has conseguido introducir la palabra antes de acabar el tiempo
      if (secondsLeft + 30 > 40) {
        setSecondsLeft(40);
      } else setSecondsLeft(secondsLeft + 30);
    }
    setInputError(null);
  };

  //para traer del servidor las puntuaciones de cada letra
  const getAlphabetScores = () => {
    axios
      .get("https://stringify-app.herokuapp.com/api/getalphabetscores")
      .then((response) => {
        //console.log(response.data);
        setAlphabetScores(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //para traer del servidor los requisitos
  const getRequirements = () => {
    axios
      .get("https://stringify-app.herokuapp.com/api/getrequirements")
      .then((response) => {
        //console.log(response.data);
        //ponemos ya el primer requisito aleatorio
        getNewRequirement(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getNewRequirement = (initialLoad) => {
    var modifiedRequirements = [];

    //si es la primera vez que cargamos la aplicacion
    if (initialLoad) {
      let rand = Math.floor(Math.random() * initialLoad.length);
      console.log("rand is: " + rand);
      console.log(initialLoad[rand]);
      setCurrentRequirement(initialLoad[rand]);

      for (let i = 0; i < initialLoad.length; i++) {
        if (i != rand) modifiedRequirements.push(initialLoad[i]);
      }
    } else {
      let rand = Math.floor(Math.random() * requirements.length);
      setCurrentRequirement(requirements[rand]);
      for (let i = 0; i < requirements.length; i++) {
        if (i != rand) modifiedRequirements.push(requirements[i]);
      }
    }

    setRequirements(modifiedRequirements);
    /* console.log("new requirements");
    console.log(modifiedRequirements); */
  };

  //palabra generica en caso de timeout
  const addEmptyWord = () => {
    setWordList((oldArray) => [
      ...oldArray,
      { word: "-", score: 0, correct: false },
    ]);
  };

  //timer

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [stopTimer, setStopTimer] = useState(false);

  //PARA EL TIMER
  useEffect(() => {
    if (!hasEndedGame) {
      // si llega a 0
      if (!secondsLeft) {
        setSecondsLeft(30);
        restartCycle(true);
      }

      const intervalId = setInterval(() => {
        if (!stopTimer) setSecondsLeft(secondsLeft - 1);
      }, 1000);

      // limpiamos el intervalo
      return () => clearInterval(intervalId);
    }
  }, [secondsLeft, stopTimer]);

  //comprobación de la palabra
  const checkWord = () => {
    //comprobar que sea una palabra válida de antemano (longitud y espacios)
    //petición al servidor para comprobar palabra y sumar puntuacion

    setloadingCheckWordRequest(true); //para evitar que le de a enviar sin que haya cargado

    if (!currentWord || currentWord.trim().length == 0) {
      //filtro inicial
      setInputError("¡Procura escribir una palabra!");
      setloadingCheckWordRequest(false);
    } else {
      let existsInArray = false;
      var i = 0;
      while (i < wordList.length && !existsInArray) {
        if (wordList[i].word === currentWord) {
          existsInArray = true;
        }
        i++;
      }

      if (existsInArray) {
        setInputError("¡Ya has escrito esa palabra!");
        setStopTimer(false);
        setloadingCheckWordRequest(false);
      } else {
        //comprobamos por servidor

        //paramos el temporizador mientras carga
        setStopTimer(true);

        axios
          .post("https://stringify-app.herokuapp.com/api/scoreword", {
            word: currentWord,
            requirementId: currentRequirement.id,
            time: secondsLeft,
          })
          .then((response) => {
            console.log(currentRequirement);
            //palabra no valida
            if (response.data == -1) {
              setCurrentWord(null);
              inputRef.current.value = "";
              console.log("La palabra no es valida");
              setInputError("La palabra escrita no existe");
              setStopTimer(false);
            } else if (response.data == -2) {
              setCurrentWord(null);
              inputRef.current.value = "";
              console.log("La condición no se cumple");
              setWordList((oldArray) => [
                ...oldArray,
                { word: currentWord, score: 0, correct: false },
              ]);
              restartCycle(false);
              setSecondsLeft(30);
            } else {
              //RESPUESTA CORRECTA
              setWordList((oldArray) => [
                ...oldArray,
                { word: currentWord, score: response.data, correct: true },
              ]);
              //llamamos a updateUserScore con lo que nos de el servidor
              updateUserScore(response.data);
              console.log("PUNTUACION: " + appContext.userScore);

              restartCycle(false);
            }
          })
          .catch((err) => {
            console.log("ha habido un error");
            setStopTimer(false);
          })
          .finally(() => {
            setloadingCheckWordRequest(false);
          });
      }
    }
  };

  const updateUserScore = (increment) => {
    appContext.updateUserScore(increment);
  };

  const endGame = () => {
    //mandamos puntuación final al servidor junto al username
    setStopTimer(true);

    console.log("LLEGA A END GAME");
    axios
      .post("https://stringify-app.herokuapp.com/api/saveuser", {
        nombre: appContext.username,
        score: appContext.userScore,
      })
      .then((response) => {
        console.log("Se ha guardado la puntuacion del usuario: ");
        console.log(response.data);
      })
      .finally(() => {
        setHasEndedGame(true);
      });

    //reseteamos parámetros del usuario
    
  };

  const handleUpdateWord = (e) => {
    setCurrentWord(e.target.value);
  };

  const enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      checkWord();
    }
  };

  return (
    <VStack spacing="20">
      <GameHeading disableScore={hasEndedGame} />

      <Grid w="100%" templateColumns="repeat(3, 1fr)" justify={"center"}>
        <ScoreList alphabetScores={alphabetScores} />
        <VStack spacing="10">
          <VStack spacing="0">
            <Heading textAlign={"center"}>Condición:</Heading>
            <Text
              fontSize={"2xl"}
              fontWeight="600"
              textDecor={"underline"}
              w="80%"
              textAlign={"center"}
            >
              {currentRequirement && currentRequirement.condicion}
            </Text>
          </VStack>

          <VStack align="left">
            {wordList.map((wordData) => {
              return wordData.word === "-" ? (
                <HStack key={wordData.word + wordData.score + Math.random()}>
                  <Heading color="red.500" fontSize={"2xl"}>
                    Timeout
                  </Heading>
                  <FontAwesomeIcon
                    style={{
                      marginLeft: "10px",
                      width: "25px",
                      height: "25px",
                      color: wordData.correct ? "green" : "red",
                    }}
                    icon={wordData.correct ? faCheck : faXmark}
                  />
                </HStack>
              ) : (
                <Text
                  key={wordData.word + wordData.score + Math.random()}
                  fontWeight={"600"}
                  fontSize="2xl"
                >
                  {wordData.word} -{">"} {wordData.score}
                  <FontAwesomeIcon
                    style={{
                      marginLeft: "10px",
                      width: "25px",
                      height: "25px",
                      color: wordData.correct ? "green" : "red",
                    }}
                    icon={wordData.correct ? faCheck : faXmark}
                  />
                </Text>
              );
            })}

            {wordList.length < 5 && (
              <Box
                textAlign={"center"}
                borderBottomWidth="2px"
                borderColor={"black"}
                p="2"
              />
            )}
          </VStack>

          <Input
            fontSize={"xl"}
            borderColor="#333D51"
            borderWidth={"2px"}
            color="black"
            placeholder="Introduce una palabra"
            w="50%"
            maxW="250px"
            minW="225px"
            fontWeight={"600"}
            onChange={handleUpdateWord}
            ref={inputRef}
            onKeyPress={enterPressed.bind(this)}
            disabled={hasEndedGame}
          />
          {!hasEndedGame ? (
            <Button
              onClick={checkWord}
              isLoading={loadingCheckWordRequest}
              colorScheme={"messenger"}
            >
              Enviar
            </Button>
          ) : (
            <Button
              colorScheme={"messenger"}
              onClick={() => {
                navigate("/scores");
                appContext.resetGame(); /* reseteamos los parámetros del juego */
              }}
            >
              Ir a puntuaciones
            </Button>
          )}

          <Text fontSize={"2xl"} fontWeight="600" color={"red.600"}>
            {inputError}
          </Text>
        </VStack>
        {/* Reloj */}
        <VStack spacing="20">
          <Clock seconds={secondsLeft} />
          <Heading>Puntuacion: {appContext.userScore}</Heading>
        </VStack>
      </Grid>
      
    </VStack>
  );
};

export default Game;
