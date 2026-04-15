import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {
  async saveToken(token: string) {
    localStorage.setItem("token", token);
  },
  async getToken() {
    return localStorage.getItem("token");
  },
  async removeToken() {
    localStorage.removeItem("token"); 
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