import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";
const USER_KEY = "userData";

const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

const saveUser = async (user: object): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

const getUser = async (): Promise<any | null> => {
  const data = await SecureStore.getItemAsync(USER_KEY);
  return data ? JSON.parse(data) : null;
};

const removeUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

const StorageService = {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
};

export default StorageService;