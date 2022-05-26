import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Button,
  ModalFooter,
  VStack,
  Box,
  HStack,
  Heading,
} from "@chakra-ui/react";
import React from "react";

const HowToPlayModal = ({isOpen,onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stringify - Instrucciones</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          
          <VStack align={"left"} spacing="5">
            <HStack>
            <Box w="25px"/>
              <HStack spacing="3" w= "80%" h="80px" bgColor={"primary"} borderRadius="80px" p="2">
                <Box w="60px" h="60px" textAlign={"center"} bgColor={"secondary"} borderRadius="100%"><Heading mt="12px" color="whiteAlpha.900">?</Heading></Box>
                <Heading color="whiteAlpha.900">¿Cómo jugar?</Heading>
              </HStack>
            </HStack>

            <HStack>
              <Box w="0px"/>
              <HStack spacing="3" w= "90%" h="80px" bgColor={"terciary"} borderRadius="80px" p="2">
                <Box w="60px" h="60px" textAlign={"center"} bgColor={"primary"} borderRadius="100%"><Heading mt="12px" color="white">1</Heading></Box>
                <Text maxW="220px" fontSize={"md"} fontWeight="600" color="white">Deberás escribir 5 palabras que cumplan las condiciones de hoy</Text>
              </HStack>
            </HStack>

            <HStack>
              <Box w="40px"/>
              <HStack spacing="3" w= "90%" h="80px" bgColor={"terciary"} borderRadius="80px" p="2">
                <Box w="60px" h="60px" textAlign={"center"} bgColor={"primary"} borderRadius="100%"><Heading mt="12px" color="white">2</Heading></Box>
                <Text maxW="200px" fontSize={"md"} fontWeight="600" color="white">Tienes 30 segundos para cada introducir cada palabra</Text>
              </HStack>
            </HStack>

            <HStack>
              <Box w="0px"/>
              <HStack spacing="3" w= "90%" h="80px" bgColor={"terciary"} borderRadius="80px" p="2">
                <Box w="60px" h="60px" textAlign={"center"} bgColor={"primary"} borderRadius="100%"><Heading mt="12px" color="white">3</Heading></Box>
                <Text maxW="220px" fontSize={"md"} fontWeight="600" color="white">Ganarás más puntos si utilizas las letras mejor puntuadas</Text>
              </HStack>
            </HStack>

            <HStack>
              <Box w="25px"/>
              <HStack spacing="3" w= "90%" h="80px" bgColor={"terciary"} borderRadius="80px" p="2">
                <Box w="60px" h="60px" textAlign={"center"} bgColor={"primary"} borderRadius="100%"><Heading mt="12px" color="white">4</Heading></Box>
                <Text maxW="240px" fontSize={"md"} fontWeight="600" color="white">¡Se el más ingenioso para quedar en el podio de puntuaciones!</Text>
              </HStack>
            </HStack>


          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HowToPlayModal;
