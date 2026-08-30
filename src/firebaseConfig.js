// ============================================================
// KONFIGURASI FIREBASE — WAJIB DIISI SEBELUM APP BISA SYNC ONLINE
// ============================================================
//
// Cara mendapatkan config ini (gratis, ±5 menit):
// 1. Buka https://console.firebase.google.com
// 2. Klik "Add project" / "Tambah project", ikuti langkahnya
// 3. Di dashboard project, klik ikon web (</>) untuk "Add app"
// 4. Beri nama app, lalu Firebase akan menampilkan objek `firebaseConfig`
//    seperti di bawah ini — copy semua nilainya ke sini
// 5. Di menu kiri, buka "Build > Authentication" → tab "Sign-in method"
//    → aktifkan "Email/Password" dan "Anonymous"
// 6. Di menu kiri, buka "Build > Firestore Database" → "Create database"
//    → pilih mode "Start in test mode" (bisa diperketat nanti)
//
// Setelah semua nilai di bawah diisi, jalankan ulang `npm run dev`.

export const firebaseConfig = {
  apiKey: "AIzaSyAJVtRERA1GRhbKHOvKKT9sj-4k8gjVgSc",
  authDomain: "sehat-yuk-2f5e2.firebaseapp.com",
  projectId: "sehat-yuk-2f5e2",
  storageBucket: "sehat-yuk-2f5e2.firebasestorage.app",
  messagingSenderId: "702186559562",
  appId: "1:702186559562:web:dd78b90b2aea90d7bfaeb3",
};

// Deteksi otomatis apakah config sudah diisi atau masih placeholder.
// Selama belum diisi, app akan tetap jalan memakai localStorage saja
// (persis seperti sebelumnya) tanpa sync online — tidak akan error.
export const isFirebaseConfigured =
  !firebaseConfig.apiKey.startsWith("GANTI_DENGAN");
