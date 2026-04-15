import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../FirebaseConfig";

export interface Chalet {
  id: string;
  ownerId: string;
  name: string;
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
    photoA?: string; photoB?: string; photoC?: string; photoD?: string;
    photoE?: string; photoF?: string; photoG?: string; photoH?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  discount?: number;
  status?: "available" | "booked";
}

export const getChalets = async (): Promise<Chalet[]> => {
  const snapshot = await getDocs(collection(db, "chalets"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Chalet[];
};

export const getMyChalets = async (): Promise<Chalet[]> => {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, "chalets"), where("ownerId", "==", user.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Chalet[];
};

export const addChalet = async (chalet: Omit<Chalet, "id">): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  await addDoc(collection(db, "chalets"), {
    ...chalet,
    ownerId: user.uid,
    status: "available",
  });
};

export const updateChalet = async (
  chaletId: string,
  data: Partial<Omit<Chalet, "id">>
): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), data);
};

export const deleteChalet = async (chaletId: string): Promise<void> => {
  await deleteDoc(doc(db, "chalets", chaletId));
};