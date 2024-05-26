import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Badge,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { Crypto } from "../utils/types";
import { formatPrice } from "../utils/formatters";

interface CryptoCardProps {
  crypto: Crypto;
}

// Format the number to be displayed in the table in PT-PT EUR € format
const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const numberFormat = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  });

  const percentageFormat = (num: number) => `${num.toFixed(2)}%`;

  // Render the cryptocurrency information in a card into the side bar
  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={3}
        textAlign={"center"}
      >
        <Avatar size={"xl"} src={crypto.image} mb={4} pos={"relative"} />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {crypto.name}
        </Heading>
        <Text
          className="card-info-text"
          fontWeight={600}
          color={"gray.500"}
          mb={4}
        >
          {crypto.symbol.toUpperCase()}
        </Text>
        <Text
          className="card-info-text"
          textAlign={"center"}
          color={useColorModeValue("gray.700", "gray.400")}
          px={3}
        >
          {formatPrice(crypto.current_price)}
        </Text>
        <Text
          textAlign={"center"}
          /* Change the text color based in the number value: red for negative, green for positive numbers */
          color={
            crypto.price_change_percentage_24h >= 0 ? "#16c784" : "#ea3943"
          }
          px={3}
          className="card-info-text"
        >
          24h: {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
          {/* Add a +/- if the % number is positive or negative */}
          {percentageFormat(crypto.price_change_percentage_24h).replace(
            ".",
            ","
          )}
          <br />({`${formatPrice(crypto.atl)}`})
        </Text>

        <SimpleGrid columns={2} spacing={2} mt={4} fontSize={"0.9rem"}>
          <Text className="card-info-text">High 24h:</Text>
          <Text className="card-info-text">{formatPrice(crypto.high_24h)}</Text>
          <Text className="card-info-text">Low 24h:</Text>
          <Text className="card-info-text">{formatPrice(crypto.low_24h)} </Text>
          <Text className="card-info-text">Market Cap:</Text>
          <Text className="card-info-text">
            {formatPrice(crypto.market_cap)}
          </Text>
          <Text className="card-info-text">Total Volume:</Text>
          <Text className="card-info-text">
            {formatPrice(crypto.total_volume)}
          </Text>
          <Text className="card-info-text">Circulating Supply:</Text>
          <Text className="card-info-text">
            {crypto.circulating_supply.toLocaleString()}
          </Text>
          <Text className="card-info-text">ATH:</Text>
          <Text className="card-info-text">{formatPrice(crypto.ath)} </Text>
          <Text className="card-info-text">ATL:</Text>
          <Text className="card-info-text">{formatPrice(crypto.atl)} </Text>
        </SimpleGrid>
        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue("gray.50", "gray.800")}
            fontWeight={"400"}
          >
            #{crypto.market_cap_rank}
          </Badge>
        </Stack>
      </Box>
    </Center>
  );
};

export default CryptoCard;
