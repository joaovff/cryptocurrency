import "./App.css";
import { ChakraProvider, extendTheme, ColorModeScript, Box, Text } from "@chakra-ui/react";
import CryptoList from "./components/CryptoList";
import Navbar from "./components/Navbar";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Navbar />
      <CryptoList />
    </ChakraProvider>
  );
}

export default App;
