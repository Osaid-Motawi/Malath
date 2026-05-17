import * as SQLite from 'expo-sqlite';
export const datab = SQLite.openDatabaseSync('chalets.db');
export const initDB = async () => {
  await datab.execAsync(`
    CREATE TABLE IF NOT EXISTS chalets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      location TEXT,
      price INTEGER,
      description TEXT 
    );
  `);
};