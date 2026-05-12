import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

let db: SQLite.SQLiteDatabase | null = null;

if (Platform.OS !== "web") {
  db = SQLite.openDatabaseSync("profile_image.db");
}

export const initProfileImageDb = () => {
  if (Platform.OS === "web" || !db) return;

  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile_image (
      id INTEGER PRIMARY KEY NOT NULL,
      imageUri TEXT
    );
  `);
};

export const saveProfileImage = (imageUri: string) => {
  if (Platform.OS === "web" || !db) return;

  db.runSync(
    "INSERT OR REPLACE INTO profile_image (id, imageUri) VALUES (1, ?);",
    [imageUri]
  );
};

export const getProfileImage = (): string | null => {
  if (Platform.OS === "web" || !db) return null;

  const row = db.getFirstSync<{ imageUri: string }>(
    "SELECT imageUri FROM profile_image WHERE id = 1;"
  );

  return row?.imageUri ?? null;
};