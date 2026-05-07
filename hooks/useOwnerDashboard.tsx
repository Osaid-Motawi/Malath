import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import { Booking } from "../app/page/services/bookingService";
import { Chalet } from "../app/page/services/chaletService";

import {
  approveChalet,
  confirmBooking,
  getOwnerPendingBookings,
  getPendingChalets,
  rejectBooking,
  rejectChalet,
} from "../app/page/services/ownerService";

import StorageService from "../app/page/services/StorageService";

export const useOwnerDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    const user = await StorageService.getUser();

    if (user?.role !== "owner") {
      Alert.alert("غير مسموح", "هذه الصفحة خاصة بالمالك فقط");
      router.back();
      return;
    }

    const [pendingBookings, pendingChalets] = await Promise.all([
      getOwnerPendingBookings(),
      getPendingChalets(),
    ]);

    setBookings(pendingBookings);
    setChalets(pendingChalets);

    setLoading(false);
  };

  const handleBookingAction = async (
    id: string,
    action: "accept" | "reject"
  ) => {
    action === "accept"
      ? await confirmBooking(id)
      : await rejectBooking(id);

    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleChaletAction = async (
    id: string,
    action: "accept" | "reject"
  ) => {
    action === "accept"
      ? await approveChalet(id)
      : await rejectChalet(id);

    setChalets((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    bookings,
    chalets,
    loading,
    loadDashboard,
    handleBookingAction,
    handleChaletAction,
  };
};