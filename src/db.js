// db.js
import Dexie from 'dexie';

export const dbDexie = new Dexie('imgsStore');
dbDexie.version(1).stores({
  imgs: '++id value', // Primary key and indexed props
});