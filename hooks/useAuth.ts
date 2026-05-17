import { useState } from "react";
import { router } from "expo-router";
import { loginUser, logoutUser, registerUser, resetPassword } from "../app/page/services/authService";
import { useChalet } from "../app/page/screens/components/ChaletContext";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { resetChaletState, refreshFavorites } = useChalet();

  const login = async (email: string, password: string) => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return false;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return false;
    }

    setLoading(true);

    try {
      await loginUser(email.trim(), password);
      await refreshFavorites();
      router.replace("/(tabs)");
      return true;
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await registerUser(fullName, email.trim(), password);
      await refreshFavorites();
      router.replace("/(tabs)");
      return true;
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await logoutUser();
      resetChaletState();
      router.replace("/");
      return true;
    } catch (e: any) {
      setError("Logout failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  setError("");

  if (password.length < 8) {
    setError(
      "Password must be at least 8 characters"
    );
    return false;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return false;
  }

  setLoading(true);

  try {
    await resetPassword(email, password);

    return true;
  } catch (e: any) {
    setError(
      e.message || "Reset password failed"
    );

    return false;
  } finally {
    setLoading(false);
  }
};

  return {
    loading,
    error,
    setError,
    login,
    register,
    logout,
    resetUserPassword,
  };
};