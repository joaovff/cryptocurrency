import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Crypto } from "../utils/types";
import CryptoCard from "./CryptoCard";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Crypto[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, favorites }) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"sm"}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Favorite Cryptocurrencies</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              {favorites.length === 0 ? (
                /* If no cryptocurrency added to the favorite, returns the following message */
                <Text>No cryptocurrencies added to favorites.</Text>
              ) : (
                favorites.map((crypto) => (
                  <CryptoCard key={crypto.id} crypto={crypto} />
                ))
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Sidebar;
