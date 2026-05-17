import {
  addDoc, collection, getDocs, 
  query, Timestamp, updateDoc, where, doc,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";

export type NotificationType =
  | "favorite"
  | "chalet_pending"
  | "chalet_approved"
  | "chalet_rejected"
  | "booking_pending"
  | "booking_approved"
  | "booking_rejected";

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  read_status: boolean;
  created_at: Timestamp;
}

export const addNotification = async (
  userId: string,
  message: string,
  type: NotificationType
): Promise<void> => {
  await addDoc(collection(db, "notifications"), {
    user_id: userId,
    message,
    type,
    read_status: false,
    created_at: Timestamp.now(),
  });
};

export const getMyNotifications = async (): Promise<Notification[]> => {
  const user = await StorageService.getUser();
  if (!user?.userId) return [];

  const q = query(
    collection(db, "notifications"),
    where("user_id", "in", [user.userId, String(user.userId), Number(user.userId)])
  );

  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
  return results.sort((a, b) => b.created_at?.seconds - a.created_at?.seconds);
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, "notifications", notificationId), { read_status: true });
};

export const markAllAsRead = async (): Promise<void> => {
  const user = await StorageService.getUser();
  if (!user?.userId) return;

  const q = query(
    collection(db, "notifications"),
    where("user_id", "==", user.userId),
    where("read_status", "==", false)
  );

  const snapshot = await getDocs(q);
  snapshot.docs.forEach((d) =>
    updateDoc(doc(db, "notifications", d.id), { read_status: true })
  );
};