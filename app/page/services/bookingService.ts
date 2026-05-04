import {
  addDoc, collection, getDocs, query, where,
  Timestamp, doc, updateDoc,  deleteDoc,

} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService"; 

export type BookingStatus = "pending" | "confirmed" | "rejected";
export interface Booking {
  id: string;
  userId: string;
  chaletId: string;
  chaletName: string;
  chaletImage: string;
  chaletPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  notes: string;
  totalPrice: number;
  nights: number;
  status: BookingStatus;
  createdAt: Timestamp;
}

export type NewBooking = Omit<Booking, "id" | "createdAt">;

export function calcNights(checkIn: string, checkOut: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / msPerDay
  ));
}

export const addBooking = async (data: NewBooking): Promise<string> => {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const user = await StorageService.getUser();
  if (!user?.userId) return [];

  const q = query(collection(db, "bookings"), where("userId", "==", user.userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
  await updateDoc(doc(db, "bookings", bookingId), { status });
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  await deleteDoc(doc(db, "bookings", bookingId));
};