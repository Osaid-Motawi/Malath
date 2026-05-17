import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import StorageService from "./StorageService";

const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const loginUser = async (email: string, password: string) => {
  const q = query(
    collection(db, "user"),
    where("email", "==", email),
    where("password", "==", password)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error("Invalid email or password");

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const user = {
    userId: userDoc.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  };

  const token = generateToken();
  await StorageService.saveUser(user);
  await StorageService.saveToken(token);

  return user;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const exists = await getDocs(
    query(collection(db, "user"), where("email", "==", email))
  );

  if (!exists.empty) throw new Error("Email already registered");

  const docRef = await addDoc(collection(db, "user"), {
    name,
    email,
    password,
    role: "user",
  });

  const user = { userId: docRef.id, name, email, role: "user" };
  const token = generateToken();

  await StorageService.saveUser(user);
  await StorageService.saveToken(token);

  return user;
};

export const logoutUser = async () => {
  await StorageService.removeToken();
  await StorageService.removeUser();
};

export const getUserToken = async (): Promise<string | null> => {
  return await StorageService.getToken();
};

export const updateUserProfile = async (name: string, email: string) => {
  const currentUser = await StorageService.getUser();

  if (!currentUser?.userId) {
    throw new Error("User not found");
  }

  await updateDoc(doc(db, "user", currentUser.userId), {
    name,
    email,
  });

  const updatedUser = {
    ...currentUser,
    name,
    email,
  };

  await StorageService.saveUser(updatedUser);

  return updatedUser;

  
};
export const checkEmailExists = async (
  email: string
) => {
  const q = query(
    collection(db, "user"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0];
};

export const resetPassword = async (
  email: string,
  newPassword: string
) => {
  const userDoc = await checkEmailExists(email);

  if (!userDoc) {
    throw new Error("User not found");
  }

  await updateDoc(
    doc(db, "user", userDoc.id),
    {
      password: newPassword,
    }
  );
};