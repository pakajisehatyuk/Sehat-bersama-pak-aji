import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { isFirebaseConfigured } from "./firebaseConfig.js";

const STORAGE_PREFIX = "pakaji_";
const LOCAL_BLOB_KEY = STORAGE_PREFIX + "data_v1";

function readLocalBlob() {
  try {
    const raw = localStorage.getItem(LOCAL_BLOB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalBlob(blob) {
  try {
    localStorage.setItem(LOCAL_BLOB_KEY, JSON.stringify(blob));
  } catch {
    // storage unavailable (private mode etc.) — app keeps working in-memory
  }
}

const PersistContext = createContext(null);

/**
 * Wrap the app with this once you know the current uid (or null for
 * logged-out/local-only mode). All usePersistentState() calls anywhere
 * in the tree read/write through this single provider.
 */
export function PersistProvider({ uid, children }) {
  const [data, setData] = useState(readLocalBlob);
  // One debounce timer PER KEY, so rapid changes to different keys
  // (e.g. checking several boxes quickly) don't cancel each other's
  // cloud write — only same-key spam gets debounced.
  const writeTimers = useRef({});

  // Subscribe to the user's cloud document when logged in + Firebase is set up.
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return;
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(ref, (snap) => {
      // The cloud document is the full picture, not a partial patch —
      // replace local state with it instead of merging. Merging meant a
      // key removed on the server (e.g. by Reset) could never disappear
      // locally, since spreading {} over the old state changes nothing.
      const remote = snap.exists() ? snap.data() : {};
      setData(remote);
      writeLocalBlob(remote);
    });
    return unsub;
  }, [uid]);

  function setKey(key, value) {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      writeLocalBlob(next);
      return next;
    });

    if (uid && isFirebaseConfigured) {
      clearTimeout(writeTimers.current[key]);
      writeTimers.current[key] = setTimeout(() => {
        setDoc(doc(db, "users", uid), { [key]: value }, { merge: true }).catch(() => {
          // offline — persistentLocalCache queues this automatically and
          // Firestore will retry once the connection is back.
        });
      }, 400);
    }
  }

  /**
   * Reset everything — clears in-memory state immediately (so the UI
   * updates instantly, no reload race), then clears localStorage and
   * the cloud document to match.
   */
  async function resetAll() {
    Object.values(writeTimers.current).forEach(clearTimeout);
    writeTimers.current = {};
    setData({});
    writeLocalBlob({});
    if (uid && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "users", uid), {}, { merge: false });
      } catch {
        // offline — local reset still applies; cloud clears once back online
      }
    }
  }

  return (
    <PersistContext.Provider value={{ data, setKey, resetAll }}>{children}</PersistContext.Provider>
  );
}

export function usePersistentState(key, initialValue) {
  const ctx = useContext(PersistContext);
  if (!ctx) {
    throw new Error("usePersistentState must be used inside <PersistProvider>");
  }
  const value = ctx.data[key] !== undefined ? ctx.data[key] : initialValue;
  const setValue = (updater) => {
    const next = typeof updater === "function" ? updater(value) : updater;
    ctx.setKey(key, next);
  };
  return [value, setValue];
}

/** Returns a function that resets all persisted data (local + cloud). */
export function usePersistReset() {
  const ctx = useContext(PersistContext);
  if (!ctx) {
    throw new Error("usePersistReset must be used inside <PersistProvider>");
  }
  return ctx.resetAll;
}
