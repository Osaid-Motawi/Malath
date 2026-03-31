import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../../FirebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export const loginUser = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerUser = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

// ─── جلب التوكن ───────────────────────────────────────────────────
export const getUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  const token = await user.getIdToken();
  return token;
};