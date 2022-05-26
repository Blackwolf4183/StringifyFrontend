import { HStack,Text } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <HStack justify={"center"} textAlign="center" borderTop="1px solid black" w="100%" h="55px" bottom={"0"} position="absolute">
        <Text fontWeight={"600"} pt="2" fontSize="xl">Proyecto Ing Software 2ºD - g4 MM2 - UMA</Text>
    </HStack>
  )
}

export default Footer