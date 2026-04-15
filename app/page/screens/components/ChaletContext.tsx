import React, { createContext, useContext } from "react";
import { Chalet } from "../../services/chaletService";
import { useChalets } from "../../../../hooks/useChalets";

interface ChaletContextType {
  chalets: Chalet[];
  favorites: string[];
  loading: boolean;
  toggleFavorite: (chaletId: string) => Promise<void>;
  isFavorite: (chaletId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  clearFavorites: () => void;
  resetChaletState: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  filteredChalets: Chalet[];
}

const ChaletContext = createContext<ChaletContextType>({} as ChaletContextType);

export const ChaletProvider = ({ children }: { children: React.ReactNode }) => {
  const chaletData = useChalets();

  return (
    <ChaletContext.Provider value={chaletData}>
      {children}
    </ChaletContext.Provider>
  );
};

export const useChalet = () => useContext(ChaletContext);