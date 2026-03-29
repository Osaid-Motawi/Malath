import { collection, getDocs, addDoc } from "firebase/firestore";import { db } from "../../../FirebaseConfig"; 
export interface Chalet {
  id: string;
  name: string;
  location: string;
  price: number;
images: string[];  capacity: number;
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