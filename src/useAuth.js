import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.js";
import { isFirebaseConfigured } from "./firebaseConfig.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function register(email, password, nama) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (nama) await updateProfile(cred.user, { displayName: nama });
    return cred;
  }

  async function loginAsGuest() {
    return signInAnonymously(auth);
  }

  async function logout() {
    return signOut(auth);
  }

  return {
    user,
    loading,
    isOnline: isFirebaseConfigured,
    login,
    register,
    loginAsGuest,
    logout,
  };
}
