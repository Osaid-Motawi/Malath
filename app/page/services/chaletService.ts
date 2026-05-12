import {
  addDoc, collection, deleteDoc, doc,
  getDoc,
  getDocs,
  query, updateDoc, where,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";
import { addNotification } from "./notificationService";

export type ChaletStatus = "available" | "booked";
export type ChaletApprovalStatus = "pending" | "approved" | "rejected";
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

  status?: ChaletStatus;
  approvalStatus?: ChaletApprovalStatus;
}
export const getChalets = async (): Promise<Chalet[]> => {
  const q = query(collection(db, "chalets"), where("approvalStatus", "==", "approved"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Chalet[];
};

export const getMyChalets = async (): Promise<Chalet[]> => {
  const user = await StorageService.getUser();
  if (!user?.userId) return [];
  const q = query(collection(db, "chalets"), where("ownerId", "==", user.userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Chalet[];
};

export const getChaletById = async (chaletId: string): Promise<Chalet | null> => {
  const snapshot = await getDoc(doc(db, "chalets", chaletId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Chalet;
};

export const addChalet = async (
  chalet: Omit<Chalet, "id" | "ownerId" | "status">
): Promise<void> => {
  const user = await StorageService.getUser();
  if (!user?.userId) throw new Error("Not authenticated");

  await addDoc(collection(db, "chalets"), {
    ...chalet,
    ownerId: user.userId,
    status: "available",
    approvalStatus: "pending",
  });

  await addNotification(
    user.userId,
    `تم استلام طلب إضافة شاليه "${chalet.name}" بانتظار موافقة الإدارة`,
    "chalet_pending"
  );
};

export const updateChalet = async (
  chaletId: string,
  data: Partial<Omit<Chalet, "id" | "ownerId">>
): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), data);
};

export const updateChaletApproval = async (
  chaletId: string,
  approvalStatus: ChaletApprovalStatus,
  chalet: Pick<Chalet, "ownerId" | "name">
): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), { approvalStatus });

  if (!chalet.ownerId) return;

  const message = approvalStatus === "approved"
    ? `تم قبول شاليهك "${chalet.name}" وهو الآن متاح للحجز`
    : `تم رفض شاليهك "${chalet.name}"`;

  await addNotification(
    chalet.ownerId,
    message,
    approvalStatus === "approved" ? "chalet_approved" : "chalet_rejected"
  );
};

export const deleteChalet = async (chaletId: string): Promise<void> => {
  await deleteDoc(doc(db, "chalets", chaletId));
};