import React, { useEffect, useState } from "react";
import { fetchCryptos } from "../api/coinApi";
import { Crypto } from "../utils/types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Flex,
  Text,
  Box,
  Input,
  TableContainer,
  Spinner,
} from "@chakra-ui/react";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import "./CryptoList.css";
import Error from "./Error";

const CryptoList: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]); // receive the cryptocurrency from the API
  const [loading, setLoading] = useState<boolean>(true); // check if it still loading
  const [error, setError] = useState<string | null>(null); // check if is there any error when trying to retrieve the data
  const [lastUpdated, setLastUpdated] = useState<string>(""); // last call to the api to retrieve the data
  const [sortBy, setSortBy] = useState<string | null>(null); // set the sort
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // set the sort direction ascendenting or descending
  const [searchTerm, setSearchTerm] = useState<string>(""); // get the keyword to search

  // Get the data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchCryptos();
      setCryptos(data);
      setLoading(false);
      setError(null);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching cryptos:", error);
      setError("Failed to fetch cryptos");
      setLoading(false);
    }
  };

  // To run the get data each 60 seconds, keeping the table updated
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Is the API still getting the data, display the spinner to provide some feedback to the user
  if (loading) {
    return (
      <Flex
        width={"100vw"}
        height={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Display the error page (component)
  if (error) return <Error />;

  // Format the number to be displayed in the table in PT-PT EUR € format
  const numberFormat = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  });

  // Sort the table by the selected column
  const sortedCryptos = cryptos.slice().sort((a, b) => {
    if (!sortBy) return 0;
    const compareA = a[sortBy as keyof Crypto];
    const compareB = b[sortBy as keyof Crypto];

    if (typeof compareA === "string") {
      // Check if the values are string, if yes, it will be sorted alphabetically, if not sort as a number.
      return sortDirection === "asc"
        ? compareA.localeCompare(compareB as string)
        : (compareB as string).localeCompare(compareA);
    } else {
      return sortDirection === "asc"
        ? (compareA as number) - (compareB as number)
        : (compareB as number) - (compareA as number);
    }
  });

  const handleSort = (column: string) => {
    // If the clicked column is the same as the clicked column, it will change the sort direction from ascending/descending or A-Z/Z-A
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the search has changed and change the value of the searchTerm variable
    setSearchTerm(event.target.value);
  };

  const filteredCryptos = sortedCryptos.filter((crypto) =>
    // Creates a new list of cryptos that match with the inserted keyword
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCrypto = (crypto: Crypto) => {
    const variationColor =
      // Check if the variation is positive or negative, and change the color of the arrow to green or red based on the variation
      crypto.price_change_percentage_24h >= 0 ? "green" : "red";
    const arrow =
      crypto.price_change_percentage_24h >= 0 ? (
        <BiSolidUpArrow style={{ color: "green" }} />
      ) : (
        <BiSolidDownArrow style={{ color: "red" }} />
      );

    return (
      <Tr key={crypto.id}>
        <Td>
          <Text>{crypto.market_cap_rank}</Text>
        </Td>
        <Td>
          <Flex alignItems="center">
            <Image src={crypto.image} alt={crypto.name} boxSize="25px" mr={2} />
            <Text>{crypto.name}</Text>
          </Flex>
        </Td>
        <Td>
          {crypto.current_price === 0
            ? crypto.current_price
            : crypto.current_price < 0.1
            ? `${crypto.current_price.toFixed(8).replace(".", ",")} €`
            : numberFormat.format(crypto.current_price)}
          {/* If the price is less than 0.1 display the number complete, otherwise would be display 0,00 €. And replace dots with comma,
                This logic is applied to every number variable in table (except % numbers) */}
        </Td>
        <Td>
          <Flex alignItems="center">
            {arrow}
            <Text ml={1} color={variationColor}>
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </Flex>
        </Td>
        <Td>
          {crypto.total_volume < 0.1
            ? `${numberFormat.format(crypto.total_volume).replace(".", ",")} €`
            : numberFormat.format(crypto.total_volume)}
        </Td>
        <Td>
          {crypto.market_cap < 0.1
            ? `${numberFormat.format(crypto.market_cap).replace(".", ",")} €`
            : numberFormat.format(crypto.market_cap)}
        </Td>
      </Tr>
    );
  };

  return (
    <>
      <Box mb={4}>
        <Text textAlign={"end"} fontSize={"0.8rem"} color="gray" margin={"1%"}>
          Last Updated: {lastUpdated}
        </Text>
      </Box>
      <TableContainer>
        <Input
          mb={4}
          type="text"
          placeholder="Search Crypto..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                onClick={() => handleSort("market_cap_rank")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text className="table-header">#</Text>
                  {sortBy === "market_cap_rank" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
              <Th onClick={() => handleSort("name")} cursor="pointer">
                <Flex alignItems="center">
                  <Text className="table-header">Name</Text>
                  {sortBy === "name" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
              <Th onClick={() => handleSort("current_price")} cursor="pointer">
                <Flex alignItems="center">
                  <Text className="table-header">Price</Text>
                  {sortBy === "current_price" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
              <Th
                onClick={() => handleSort("price_change_percentage_24h")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text className="table-header">24h %</Text>
                  {sortBy === "price_change_percentage_24h" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
              <Th onClick={() => handleSort("total_volume")} cursor="pointer">
                <Flex alignItems="center">
                  <Text className="table-header">Volume</Text>
                  {sortBy === "total_volume" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
              <Th onClick={() => handleSort("market_cap")} cursor="pointer">
                <Flex alignItems="center">
                  <Text className="table-header">Market Cap</Text>
                  {sortBy === "market_cap" && (
                    <>
                      {sortDirection === "asc" ? (
                        <BiSolidUpArrow style={{ marginLeft: "5px" }} />
                      ) : (
                        <BiSolidDownArrow style={{ marginLeft: "5px" }} />
                      )}
                    </>
                  )}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCryptos.map(renderCrypto)}{" "}
            {/* When the search box value is changed, a new list of cryptos is generated and used to render a new list os cryptos with the renderCryptos function */}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CryptoList;
