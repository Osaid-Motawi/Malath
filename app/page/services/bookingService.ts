import {
<<<<<<< HEAD
  addDoc, collection, getDocs, query, where,
  Timestamp, doc, updateDoc,
=======
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  deleteDoc,
>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";


<<<<<<< HEAD
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
=======
export type BookingStatus = "pending" | "confirmed" | "rejected";
>>>>>>> 74d76326fea655e59bdb0f26434fb6c801b3bf4e

export interface Booking {
  id: string;
  userId: string;
  chaletId: string;
  chaletName: string;
  chaletImage: string;
  chaletPrice: number;
  checkIn: string;   // "YYYY-MM-DD"
  checkOut: string;  // "YYYY-MM-DD"
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
  return Math.max(
    0,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / msPerDay
    )
  );
}


export async function getBookedDates(chaletId: string): Promise<string[]> {
  const q = query(
    collection(db, "bookings"),
    where("chaletId", "==", chaletId),
    where("status", "in", ["pending", "confirmed"])
  );
  const snapshot = await getDocs(q);
  const bookedDays: string[] = [];

  snapshot.docs.forEach((d) => {
    const { checkIn, checkOut } = d.data() as Booking;
    
    const current = new Date(checkIn);
    const end = new Date(checkOut);
    while (current < end) {
      bookedDays.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  return bookedDays;
}


export async function hasConflict(
  chaletId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const bookedDates = await getBookedDates(chaletId);
  const current = new Date(checkIn);
  const end = new Date(checkOut);
  while (current < end) {
    const ds = current.toISOString().split("T")[0];
    if (bookedDates.includes(ds)) return true;
    current.setDate(current.getDate() + 1);
  }
  return false;
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
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", user.userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};


export const cancelBooking = async (bookingId: string): Promise<void> => {
  await updateBookingStatus(bookingId, "cancelled");
};