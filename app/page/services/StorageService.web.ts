const TOKEN_KEY = "userToken";
const USER_KEY = "userData";

const saveToken = async (token: string): Promise<void> => {
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = async (): Promise<string | null> => {
  return localStorage.getItem(TOKEN_KEY);
};

const removeToken = async (): Promise<void> => {
  localStorage.removeItem(TOKEN_KEY);
};

const saveUser = async (user: object): Promise<void> => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const getUser = async (): Promise<any | null> => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

const removeUser = async (): Promise<void> => {
  localStorage.removeItem(USER_KEY);
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