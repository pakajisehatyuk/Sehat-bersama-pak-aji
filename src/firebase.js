import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./firebaseConfig.js";

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  // persistentLocalCache lets the app keep working offline and sync
  // automatically once the connection is back.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
  });
}

export { app, auth, db };
