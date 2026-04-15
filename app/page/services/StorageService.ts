import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const StorageService = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync("token", token);
  },
  async getToken() {
    return await SecureStore.getItemAsync("token");
  },
  async removeToken() {
    await SecureStore.deleteItemAsync("token");
  },
  async saveUser(user: any) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  },
  async getUser() {
    const data = await AsyncStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  },
  async removeUser() {
    await AsyncStorage.removeItem("user");
  },

  async clearAsyncStorage() {
    await AsyncStorage.clear();
  }
};

export default StorageService;