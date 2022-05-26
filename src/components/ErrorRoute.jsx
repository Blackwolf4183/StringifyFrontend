import React from 'react'
import { Button, Heading, Image, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router';
import NotFound from '../assets/NotFound.svg';

const ErrorRoute = () => {
  const navigate = useNavigate();

  return (
    <VStack mt="15vh" spacing="20" textAlign={"center"}>     
        <Image w="30vw" minW={"400px"} src={NotFound}/>
        <Heading>Ups la página a la que intentas acceder <br/> no está disponible</Heading>
        <Button colorScheme={"messenger"} onClick={() => navigate("scores")}>Ver puntuaciones</Button>
    </VStack>
  )
}

export default ErrorRoute