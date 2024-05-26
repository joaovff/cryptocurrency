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
  IconButton,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import { IoStar } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import "./CryptoList.css";
import Error from "./Error";
import Sidebar from "./Sidebar";
import { formatPrice } from "../utils/formatters";

const CryptoList: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]); // receive the cryptocurrencies data from the API
  const [loading, setLoading] = useState<boolean>(true); // check if it still loading
  const [error, setError] = useState<string | null>(null); // check if is there any error when trying to retrieve the data
  const [lastUpdated, setLastUpdated] = useState<string>(""); // last date and time we colected data from the api
  const [sortBy, setSortBy] = useState<string | null>(null); // set the sort
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // set the sort direction ascendenting or descending
  const [searchTerm, setSearchTerm] = useState<string>(""); // get the keyword to search
  const [favorites, setFavorites] = useState<Crypto[]>([]); // get the favorites and store it into an array
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // control sidebar visibility

  // get the data from the API
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

  useEffect(() => {
    // get data each 60 seconds, keeping the table updated
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Display the error component in case of error
  if (error) return <Error />;

  const sortedCryptos = cryptos.slice().sort((a, b) => {
    if (!sortBy) return 0;
    const compareA = a[sortBy as keyof Crypto];
    const compareB = b[sortBy as keyof Crypto];

    // Check if the values are string, if yes, it will be sorted alphabetically, if not sorted as a number
    if (typeof compareA === "string") {
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

  const toggleFavorite = (id: string) => {
    // Check if the crypto is already in the favorites list, if it is, remove it from the list, otherwise add it to the favorites list
    const index = favorites.findIndex((crypto) => crypto.id === id);
    if (index === -1) {
      const favoriteCrypto = cryptos.find((crypto) => crypto.id === id);
      if (favoriteCrypto) {
        setFavorites([...favorites, favoriteCrypto]);
      }
    } else {
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(index, 1);
      setFavorites(updatedFavorites);
    }
  };

  const filteredCryptos = sortedCryptos.filter((crypto) =>
    // Creates a new list of cryptos that match with the inserted keyword
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCrypto = (crypto: Crypto) => {
    // Check if the variation is positive or negative, and change the color of the arrow to green or red based on the variation
    const variationColor =
      crypto.price_change_percentage_24h >= 0 ? "#16c784" : "#ea3943";
    const arrow =
      crypto.price_change_percentage_24h >= 0 ? (
        <BiSolidUpArrow style={{ color: "#16c784" }} />
      ) : (
        <BiSolidDownArrow style={{ color: "#ea3943" }} />
      );

    return (
      <Tr key={crypto.id}>
        <Td className="star-table">
          <IconButton
            background={"transparent"}
            aria-label="Add to favorites"
            icon={<IoStar />}
            color={
              favorites.some((favorite) => favorite.id === crypto.id)
                ? "yellow.400"
                : "gray.400"
            }
            _hover={{ background: "transparent" }}
            onClick={() => toggleFavorite(crypto.id)}
          />
        </Td>
        <Td>
          <Text>{crypto.market_cap_rank}</Text>
        </Td>
        <Td>
          <Flex alignItems="center">
            <Image
              src={crypto.image}
              alt={crypto.name}
              boxSize="25px"
              mr={"3%"}
            />
            <Text>
              {crypto.name}{" "}
              <Text ml={1} as="span" color="gray.500" fontWeight="bold">
                {crypto.symbol.toUpperCase()}
              </Text>
            </Text>
          </Flex>
        </Td>
        <Td>{formatPrice(crypto.current_price)}</Td>
        <Td>
          <Flex alignItems="center">
            {arrow}
            <Text ml={1} color={variationColor}>
              {crypto.price_change_percentage_24h.toFixed(2).replace(".", ",")}%
            </Text>
          </Flex>
        </Td>
        <Td>
          {crypto.total_volume < 0.1
            ? `${crypto.total_volume.toFixed(8).replace(".", ",")} €`
            : formatPrice(crypto.total_volume)}
        </Td>
        <Td>
          {crypto.market_cap < 0.1
            ? `${crypto.market_cap.toFixed(8).replace(".", ",")} €`
            : formatPrice(crypto.market_cap)}
        </Td>
      </Tr>
    );
  };

  return (
    <>
      <Box>
        <Flex justify="space-between" align="center">
          <Text
            textAlign={"end"}
            fontSize={"0.9rem"}
            width={"100%"}
            padding={"1%"}
            color="gray"
          >
            Last Update: {lastUpdated}
          </Text>
        </Flex>
      </Box>
      <TableContainer>
        <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
          <InputGroup width={"60vw"} className="search-group">
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="#718096" />}
              mr={4}
              ml={1}
            />
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              color={"#718096"}
              focusBorderColor="#577B8D"
            />
          </InputGroup>
        </Flex>

        <Table size="sm" mt={5}>
          <Thead>
            <Tr>
              <Th cursor="default" className="star-table"></Th>
              <Th
                onClick={() => handleSort("market_cap_rank")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text className="table-header-hash">#</Text>
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
              <Th
                className="table-header"
                onClick={() => handleSort("name")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text>Name</Text>
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
              <Th
                className="table-header"
                onClick={() => handleSort("current_price")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text>Price</Text>
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
                className="table-header"
                onClick={() => handleSort("price_change_percentage_24h")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text>24h %</Text>
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
              <Th
                className="table-header"
                onClick={() => handleSort("total_volume")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text>Volume</Text>
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
              <Th
                className="table-header"
                onClick={() => handleSort("market_cap")}
                cursor="pointer"
              >
                <Flex alignItems="center">
                  <Text>Market Cap</Text>
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
          <Tbody>{filteredCryptos.map(renderCrypto)}</Tbody>
        </Table>
      </TableContainer>
      <IconButton
        aria-label="Open sidebar"
        icon={<IoStar color={"gray.400"} />}
        onClick={() => setIsSidebarOpen(true)}
        size="lg"
        position="fixed"
        bottom="4"
        right="4"
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        favorites={favorites}
      />
    </>
  );
};

export default CryptoList;
