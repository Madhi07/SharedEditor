// utils/assetDB.js
import { openDB } from 'idb';

const DB_NAME = 'ASSET_DB';
const STORE_NAME = 'assets';
const DB_VERSION = undefined;

// Initialize or get the DB
async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

/**
 * Save any asset to IndexedDB
 * @param {string} key - unique key for the asset
 * @param {ArrayBuffer|Blob|string} data - asset data
 */
export async function saveAsset(key, data) {
    const db = await getDB();
    await db.put(STORE_NAME, data, key);
}

/**
 * Get asset from IndexedDB
 * @param {string} key
 * @returns {Promise<ArrayBuffer|Blob|string | undefined>}
 */
export async function getAsset(key) {
    const db = await getDB();
    return db.get(STORE_NAME, key);
}

/**
 * Remove asset from IndexedDB
 */
export async function removeAsset(key) {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
}

/**
 * Clear all assets
 */
export async function clearAssets() {
    const db = await getDB();
    await db.clear(STORE_NAME);
}
