import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'db.json');

/**
 * Read the entire database from the JSON file
 */
export function readDB() {
  try {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { projects: [], clips: [], notes: [] };
  }
}

/**
 * Write the entire database to the JSON file
 */
export function writeDB(data) {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

/**
 * Get all items from a collection
 */
export function getAll(collection) {
  const db = readDB();
  return db[collection] || [];
}

/**
 * Get a single item by ID from a collection
 */
export function getById(collection, id) {
  const db = readDB();
  const items = db[collection] || [];
  return items.find(item => item.id === id);
}

/**
 * Create a new item in a collection
 */
export function create(collection, item) {
  const db = readDB();
  if (!db[collection]) {
    db[collection] = [];
  }
  db[collection].push(item);
  writeDB(db);
  return item;
}

/**
 * Update an item in a collection
 */
export function update(collection, id, updatedItem) {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  items[index] = updatedItem;
  db[collection] = items;
  writeDB(db);
  return updatedItem;
}

/**
 * Delete an item from a collection
 */
export function remove(collection, id) {
  const db = readDB();
  const items = db[collection] || [];
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }
  
  items.splice(index, 1);
  db[collection] = items;
  writeDB(db);
  return true;
}
