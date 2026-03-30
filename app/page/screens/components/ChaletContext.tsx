import React, { createContext, useContext, useState, useEffect } from "react";
import { getChalets, Chalet } from "../../services/chaletService";
import { getFavorites, addFavorite, removeFavorite } from "../../services/favoriteService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../FirebaseConfig";

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
    getChalets().then(setChalets);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const favs = await getFavorites();
        setFavorites(favs);
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });
    return () => unsub();
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
    <ChaletContext.Provider value={{ chalets, favorites, loading, toggleFavorite, isFavorite }}>
      {children}
    </ChaletContext.Provider>
  );
};

export const useChalets = () => useContext(ChaletContext);