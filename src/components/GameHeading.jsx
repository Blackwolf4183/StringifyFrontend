import React from "react";
import {
  VStack,
  IconButton,
  Box,
  Heading,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRankingStar,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import HowToPlayModal from "./HowToPlayModal";

const GameHeading = ({ disableScore }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HowToPlayModal isOpen={isOpen} onClose={onClose}/>
      <VStack>
        <HStack spacing="10" mt="5">
          <IconButton
            disabled={disableScore}
            onClick={() => navigate("/scores")}
          >
            <FontAwesomeIcon
              style={{ width: "25px", height: "25px" }}
              icon={faRankingStar}
            />
          </IconButton>
          <Heading userSelect={"none"} mt="5" onClick={() => navigate("/")} cursor="pointer">
            Stringify
          </Heading>
          <IconButton onClick={onOpen}>
            <FontAwesomeIcon
              style={{ width: "25px", height: "25px" }}
              icon={faCircleQuestion}
            />
          </IconButton>
        </HStack>
        <Box w="300px" h="2px" bgColor="black" />
      </VStack>
    </>
  );
};

export default GameHeading;
