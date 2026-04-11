import React, { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import { Chalet } from "../../services/chaletService";
import { getFavorites, addFavorite, removeFavorite } from "../../services/favoriteService";
import StorageService from "../../services/StorageService";

interface ChaletContextType {
  chalets: Chalet[];
  favorites: string[];
  loading: boolean;
  toggleFavorite: (chaletId: string) => Promise<void>;
  isFavorite: (chaletId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  filteredChalets: Chalet[];
}

const ChaletContext = createContext<ChaletContextType>({} as ChaletContextType);

export const ChaletProvider = ({ children }: { children: React.ReactNode }) => {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("الكل");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chalets"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Chalet[];
      setChalets(data);
    });
    return () => unsubscribe();
  }, []);

  const loadFavorites = async () => {
    const user = await StorageService.getUser();
    if (user?.userId) {
      const favs = await getFavorites();
      setFavorites(favs);
    } else {
      setFavorites([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const filteredChalets = selectedCity === "الكل"
    ? chalets
    : chalets.filter(c => c.location === selectedCity);

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
    <ChaletContext.Provider value={{
      chalets, favorites, loading,
      toggleFavorite, isFavorite, refreshFavorites,
      selectedCity, setSelectedCity, filteredChalets
    }}>
      {children}
    </ChaletContext.Provider>
  );
};

export const useChalets = () => useContext(ChaletContext);