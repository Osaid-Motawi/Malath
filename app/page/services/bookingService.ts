import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../FirebaseConfig";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

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

// ─── حساب عدد الليالي ─────────────────────────────────────────────
export function calcNights(checkIn: string, checkOut: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    0,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / msPerDay
    )
  );
}

// ─── إضافة حجز جديد ───────────────────────────────────────────────
export const addBooking = async (data: NewBooking): Promise<string> => {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// ─── جلب حجوزات اليوزر الحالي ─────────────────────────────────────
export const getMyBookings = async (): Promise<Booking[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "bookings"),
    where("userId", "==", user.uid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
};

// ─── تحديث حالة الحجز ─────────────────────────────────────────────
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<void> => {
  await updateDoc(doc(db, "bookings", bookingId), { status });
};

// ─── إلغاء حجز ────────────────────────────────────────────────────
export const cancelBooking = async (bookingId: string): Promise<void> => {
  await updateBookingStatus(bookingId, "cancelled");
};