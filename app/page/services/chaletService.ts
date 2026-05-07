import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";

export interface Chalet {
  id: string;
  ownerId: string;
  name: string;
  area?: string;
  location: string;
  price: number;
  rating?: number;
  image?: string;
  images: string[];
  capacity: number;
  description?: string;
  amenities?: {
    Kitchen?: boolean;
    Parking?: boolean;
    Pool?: boolean;
    WiFi?: boolean;
  };
  photo?: {
    photoA?: string;
    photoB?: string;
    photoC?: string;
    photoD?: string;
    photoE?: string;
    photoF?: string;
    photoG?: string;
    photoH?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  discount?: number;
  status?: "available" | "booked";
}

export const getChalets = async (): Promise<Chalet[]> => {
  const snapshot = await getDocs(collection(db, "chalets"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Chalet[];
};

export const getMyChalets = async (): Promise<Chalet[]> => {
  const user = await StorageService.getUser();
  if (!user?.userId) return [];

  const q = query(
    collection(db, "chalets"),
    where("ownerId", "==", user.userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Chalet[];
};

export const getChaletById = async (chaletId: string): Promise<Chalet | null> => {
  const snapshot = await getDoc(doc(db, "chalets", chaletId));

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Chalet;
};

export const addChalet = async (
  chalet: Omit<Chalet, "id" | "ownerId" | "status">
): Promise<void> => {
  const user = await StorageService.getUser();

  if (!user?.userId) {
    throw new Error("Not authenticated");
  }

  await addDoc(collection(db, "chalets"), {
    ...chalet,
    ownerId: user.userId,
    status: "available",
  });
};

export const updateChalet = async (
  chaletId: string,
  data: Partial<Omit<Chalet, "id" | "ownerId">>
): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), data);
};

export const deleteChalet = async (chaletId: string): Promise<void> => {
  await deleteDoc(doc(db, "chalets", chaletId));
};