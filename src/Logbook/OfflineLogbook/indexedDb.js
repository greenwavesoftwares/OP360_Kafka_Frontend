import { getCurrentUser } from "../../UserModuleUpdated/helper";

const DB_NAME = "OfflineJobDB";
const STORE_NAME = "jobActivities";
const DB_VERSION = 1;

// Open DB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id", // composite key
        });

        store.createIndex("jobId", "jobId", { unique: false });
        store.createIndex("activityId", "activityId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Create composite key
const createKey = (jobId, activityId) => `${jobId}_${activityId}`;


// ✅ SAVE DATA
export const saveData = async (jobId, activityId, obj, errorMsg,error=false) => {
  if(!jobId || !activityId) return;
  console.log('SaveData called in Indexed Db')
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  // console.log('Save Data called in js : ',jobId,activityId,obj,error,refresh)
  // debugger;
  const data = {
    id: createKey(jobId, activityId),
    jobId,
    activityId,
    payload: obj,
    // files: blobFileList,
    savedAt: obj.transactionTimestamp || new Date().toISOString(),
    errorMsg: errorMsg || 'Unknown Error',
    errorBy:getCurrentUser() || 'Unknown User',
    error:error
  };

  store.put(data);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const saveGridData = async (jobId, activityId,logbook) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const data = {
    id: createKey(jobId, `${activityId}_ws`),
    jobId,
    activityId,
    payload: logbook,
    // files: blobFileList,
    savedAt: new Date().toISOString(),
  };

  store.put(data);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};


// ✅ GET DATA
export const getData = async (jobId, activityId) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  const request = store.get(createKey(jobId, activityId));

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};


// ✅ DELETE DATA
export const deleteData = async (jobId, activityId) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  store.delete(createKey(jobId, activityId));

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};