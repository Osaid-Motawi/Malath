import { collection, addDoc, deleteDoc, getDocs, query, where, doc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig"; 
import StorageService from "./StorageService"; 

export const getFavorites = async (): Promise<string[]> => {
  const userId = await StorageService.getUser().then((u) => u?.userId);
  if (!userId) return [];

  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().chaletId as string);
};

export const addFavorite = async (chaletId: string): Promise<void> => {
  const userId = await StorageService.getUser().then((u) => u?.userId);
  if (!userId) return;

  await addDoc(collection(db, "favorites"), { chaletId, userId });
};

export const removeFavorite = async (chaletId: string): Promise<void> => {
  const userId = await StorageService.getUser().then((u) => u?.userId);
  if (!userId) return;

  const q = query(
    collection(db, "favorites"),
    where("chaletId", "==", chaletId),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  snapshot.docs.forEach((d) => deleteDoc(doc(db, "favorites", d.id)));
};