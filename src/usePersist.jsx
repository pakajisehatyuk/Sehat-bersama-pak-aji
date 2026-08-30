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
  const writeTimer = useRef(null);
  const applyingRemote = useRef(false);

  // Subscribe to the user's cloud document when logged in + Firebase is set up.
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return;
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        applyingRemote.current = true;
        setData((prev) => {
          const merged = { ...prev, ...snap.data() };
          writeLocalBlob(merged);
          return merged;
        });
      }
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
      clearTimeout(writeTimer.current);
      writeTimer.current = setTimeout(() => {
        setDoc(doc(db, "users", uid), { [key]: value }, { merge: true }).catch(() => {
          // offline — persistentLocalCache queues this automatically and
          // Firestore will retry once the connection is back.
        });
      }, 400);
    }
  }

  return (
    <PersistContext.Provider value={{ data, setKey }}>{children}</PersistContext.Provider>
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

export function clearAllPersistedData(uid) {
  writeLocalBlob({});
  if (uid && isFirebaseConfigured) {
    setDoc(doc(db, "users", uid), {}, { merge: false }).catch(() => {});
  }
}
