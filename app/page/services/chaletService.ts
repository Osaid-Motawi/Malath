import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
export interface Chalet {
  id: string;
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
    photoA?: string;
    photoB?: string;
    photoC?: string;
    photoD?: string;
    photoE?: string;
    photoF?: string;
    photoG?: string;
    photoH?: string;
  }
  bedrooms?: number;
  bathrooms?: number;
  discount?: number;
}

export const getChalets = async (): Promise<Chalet[]> => {
  const snapshot = await getDocs(collection(db, "chalets")); 
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Chalet[];
};
export const addChalet = async (chalet: Omit<Chalet, "id">): Promise<void> => {
  await addDoc(collection(db, "chalets"), chalet);
};