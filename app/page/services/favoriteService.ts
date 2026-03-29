import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../FirebaseConfig"; 
export const getFavorites = async (): Promise<string[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const q = query(
    collection(db, "favorites"),
    where("userId", "==", userId) // ← فلتر حسب اليوزر
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().chaletId as string);
};

export const addFavorite = async (chaletId: string): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  await addDoc(collection(db, "favorites"), {
    chaletId,
    userId, 
  });
};

export const removeFavorite = async (chaletId: string): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const q = query(
    collection(db, "favorites"),
    where("chaletId", "==", chaletId),
    where("userId", "==", userId) 
  );
  const snapshot = await getDocs(q);
  snapshot.docs.forEach((d) => deleteDoc(doc(db, "favorites", d.id)));
};