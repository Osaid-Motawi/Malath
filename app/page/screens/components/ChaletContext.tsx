import React, { createContext, useContext, useState, useEffect } from "react";
import { getChalets, Chalet } from "../../services/chaletService";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../../services/favoriteService";

interface ChaletContextType {
  chalets: Chalet[];
  favorites: string[];
  loading: boolean;
  toggleFavorite: (chaletId: string) => Promise<void>;
  isFavorite: (chaletId: string) => boolean;
}

const ChaletContext = createContext<ChaletContextType>({} as ChaletContextType);

export const ChaletProvider = ({ children }: { children: React.ReactNode }) => {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [chaletsData, favoritesData] = await Promise.all([
        getChalets(),
        getFavorites(),
      ]);
      setChalets(chaletsData);
      setFavorites(favoritesData);
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleFavorite = async (chaletId: string) => {
    if (isFavorite(chaletId)) {
      await removeFavorite(chaletId);
      setFavorites((prev) => prev.filter((id) => id !== chaletId));
    } else {
      await addFavorite(chaletId);
      setFavorites((prev) => [...prev, chaletId]);
    }
  };

  const isFavorite = (chaletId: string) => favorites.includes(chaletId);

  return (
    <ChaletContext.Provider
      value={{ chalets, favorites, loading, toggleFavorite, isFavorite }}
    >
      {children}
    </ChaletContext.Provider>
  );
};

export const useChalets = () => useContext(ChaletContext);