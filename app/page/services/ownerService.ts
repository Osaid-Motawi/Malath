import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";
import { Booking } from "./bookingService";
import { Chalet } from "./chaletService";

const isOwner = async () => {
  const user = await StorageService.getUser();
  return user?.role === "owner";
};

export const getOwnerPendingBookings = async (): Promise<Booking[]> => {
  if (!(await isOwner())) return [];

  const q = query(
    collection(db, "bookings"),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Booking[];
};

export const confirmBooking = async (bookingId: string): Promise<void> => {
  await updateDoc(doc(db, "bookings", bookingId), {
    status: "confirmed",
  });
};

export const rejectBooking = async (bookingId: string): Promise<void> => {
  await updateDoc(doc(db, "bookings", bookingId), {
    status: "rejected",
  });
};

export const getPendingChalets = async (): Promise<Chalet[]> => {
  if (!(await isOwner())) return [];

  const q = query(
    collection(db, "chalets"),
    where("approvalStatus", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Chalet[];
};

export const approveChalet = async (chaletId: string): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), {
    approvalStatus: "approved",
    status: "available",
  });
};

export const rejectChalet = async (chaletId: string): Promise<void> => {
  await updateDoc(doc(db, "chalets", chaletId), {
    approvalStatus: "rejected",
  });
};