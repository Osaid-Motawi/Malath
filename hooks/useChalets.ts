import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { Chalet } from "../app/page/services/chaletService";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../app/page/services/favoriteService";
import StorageService from "../app/page/services/StorageService";

export const useChalets = () => {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("الكل");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "chalets"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chalet[];

      setChalets(data);
    });

    return () => unsubscribe();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);

    try {
      const user = await StorageService.getUser();

      if (user?.userId) {
        const favs = await getFavorites();
        setFavorites(favs);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.log("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const resetChaletState = () => {
    setFavorites([]);
    setSelectedCity("الكل");
    setLoading(false);
  };

  const isFavorite = (chaletId: string) => {
    return favorites.includes(chaletId);
  };

  const toggleFavorite = async (chaletId: string) => {
    const user = await StorageService.getUser();

    if (!user?.userId) {
      console.log("No logged in user");
      return;
    }

    if (isFavorite(chaletId)) {
      await removeFavorite(chaletId);
      setFavorites((prev) => prev.filter((id) => id !== chaletId));
    } else {
      await addFavorite(chaletId);
      setFavorites((prev) => [...prev, chaletId]);
    }
  };

  const filteredChalets =
    selectedCity === "الكل" ? chalets : chalets.filter((c) => c.location === selectedCity);

  return {
    chalets,
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
    clearFavorites,
    resetChaletState,
    selectedCity,
    setSelectedCity,
    filteredChalets,
  };
};