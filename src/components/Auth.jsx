import {
  Image,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/app-context";
import Logo from "../assets/Logo.svg";
import axios from "axios";
import GameHeading from "./GameHeading";
import Footer from "./Footer";
import { motion } from "framer-motion";

const MotionImg = motion(Image);

const Auth = () => {
  //router
  const navigate = useNavigate();

  //context
  const appContext = useContext(AppContext);

  const [username, setUsername] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const validateUsername = () => {
    setIsLoading(true);
    //hacer petición con axios para ver si el usuario existe en la base de datos
    if (username && username.trim().length > 0) {
      //Primero comprobamos si existe el usuario
      axios
        .post("http://localhost:8000/api/userexists", { nombre: username })
        .then((response) => {
          if (response.data == true) {
            setErrorMsg("¡Ya existe un usuario con ese nombre!");
            setIsLoading(false);
          } else {
            //si no existe procedemos al "preguardado"
            axios
              .post("http://localhost:8000/api/saveuser", { nombre: username })
              .then((response) => {
                console.log("Preguardado usuario...");
                console.log(response.data);
                appContext.updateUsername(username);
                navigate("main");
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setErrorMsg("Ha ocurrido algún problema creando tu usuario");
        });
    } else {
      setErrorMsg("Nombre de usuario no válido");
    }
  };

  return (
    <>
      <Flex w="100%" h="100vh" justifyContent={"center"} minH="700px">
        <VStack spacing="20">
          <GameHeading />
          <MotionImg
            animate={{ scale: [0, 1] }}
            transition={{ duration: 0.5 }}
            userSelect={"none"}
            draggable={false}
            src={Logo}
            maxW="150px"
          />
          <VStack spacing="5">
            <VStack
              spacing="5"
              w="300px"
              h="200px"
              p="25px"
              textAlign="center"
              borderRadius={"md"}
              borderWidth="2px"
              borderColor={"#333D51"}
            >
              <Heading color="#333D51" fontSize={"2xl"}>
                Introduce tu nombre:
              </Heading>
              <Input
                maxLength={25}
                userSelect={"none"}
                fontWeight="600"
                color="#333D51"
                onChange={handleUsernameChange}
                placeholder="Nombre de usuario"
                borderWidth={"2px"}
              />
              <Button isLoading={isLoading} onClick={validateUsername}>
                Continuar
              </Button>
            </VStack>
            <Text fontSize={"lg"} fontWeight="600" color={"red.400"}>
              {errorMsg}
            </Text>
          </VStack>
        </VStack>
      </Flex>
      <Footer />
    </>
  );
};

export default Auth;
