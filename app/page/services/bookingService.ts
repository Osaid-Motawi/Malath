// page/services/bookingService.ts
import {
    collection, addDoc, getDocs,
    query, where, Timestamp, doc, updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../FirebaseConfig";

// ─── Types ────────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

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
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export const addBooking = async (data: NewBooking): Promise<string> => {
    const docRef = await addDoc(collection(db, "Bookings"), {
        ...data,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

export const getMyBookings = async (): Promise<Booking[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(
        collection(db, "Bookings"),
        where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
    await updateDoc(doc(db, "Bookings", bookingId), { status: "cancelled" });
};

export const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus
): Promise<void> => {
    await updateDoc(doc(db, "Bookings", bookingId), { status });
};