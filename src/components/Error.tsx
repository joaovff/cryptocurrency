import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const Error: React.FC = () => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // This value is used to display how many time is missing to next automatic update (the auto update is defined to run each 60s)
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"red.500"}
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
          mt={15}
        >
          <CloseIcon boxSize={"20px"} color={"white"} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Something went wrong and cryptocurrencies cannot be displayed
      </Heading>
      <Text color={"gray.500"}>
        Please try again later or wait, the page will automatically refresh in{" "}
        {countdown} seconds.
      </Text>
    </Box>
  );
};

export default Error;
