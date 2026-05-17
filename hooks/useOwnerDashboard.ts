import { Alert } from "react-native";
import { router } from "expo-router";
import {useMutation, useQuery,useQueryClient,} from "@tanstack/react-query";
import { approveChalet, confirmBooking,getOwnerPendingBookings,getPendingChalets,rejectBooking,rejectChalet,} from "../app/page/services/ownerService";
import StorageService from "../app/page/services/StorageService";

export const useOwnerDashboard = () => {

  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ["owner-bookings"],
    queryFn: getOwnerPendingBookings,
  });

  const chaletsQuery = useQuery({
    queryKey: ["pending-chalets"],
    queryFn: getPendingChalets,
  });

  const bookingMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "accept" | "reject";
    }) => {
      if (action === "accept") {
        await confirmBooking(id);
      } else {
        await rejectBooking(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner-bookings"],
      });
    },
  });

  const chaletMutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "accept" | "reject";
    }) => {
      if (action === "accept") {
        await approveChalet(id);
      } else {
        await rejectChalet(id);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-chalets"],
      });
    },
  });

  const checkOwner = async () => {
  const user = await StorageService.getUser();

    if (user?.role !== "owner") {
      Alert.alert("غير مسموح","هذه الصفحة خاصة بالمالك فقط");
      router.back();
    }
  };

  return {
    bookings: bookingsQuery.data || [],
    chalets: chaletsQuery.data || [],
    loading:
      bookingsQuery.isLoading ||
      chaletsQuery.isLoading,
    handleBookingAction: (id: string,action: "accept" | "reject") => {
      bookingMutation.mutate({ id, action });
    },
    handleChaletAction: (id: string,action: "accept" | "reject") => {
      chaletMutation.mutate({ id, action });
    },
    checkOwner,
  };
};