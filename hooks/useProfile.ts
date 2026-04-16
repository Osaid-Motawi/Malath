import { useCallback, useState } from "react";
import StorageService from "@/app/page/services/StorageService";

type UserProfile = {
  userId: string;
  name: string;
  email: string;
  role?: string;
} | null;

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await StorageService.getUser();
      setUser(currentUser);
    } catch (error) {
      console.log("Error loading user profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    loadUser,
  };
};