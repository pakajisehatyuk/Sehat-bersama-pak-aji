# Sehat Bersama Pak Aji 🍲

Aplikasi mobile web untuk diet & masakan sehat khas Madura, dibuat pakai React + Vite.

## Fitur

- **Login & Daftar Akun** — email/password, atau masuk sebagai Tamu
- **Sync Cloud** — data ikut ke HP/browser manapun selama login dengan akun yang sama
- **Onboarding** — perkenalan swipeable dengan Pak Aji
- **Beranda** — ringkasan harian, resep populer, jadwal diet
- **Kalkulator Gizi** — hitung BMR, TDEE, target kalori, BMI, dan makronutrien
- **Jadwal Diet** — checklist menu harian per hari dengan progress kalori
- **Menu Diet** — katalog menu dengan pencarian & filter kategori
- **Belanja Sehat** — daftar belanja dengan kalkulasi harga otomatis
- **Artikel & Tips** — bacaan seputar diet, nutrisi, dan olahraga
- **Resep Sehat** — resep lengkap dengan bahan, langkah, dan porsi yang bisa diatur
- **Profil** — data diri, progress berat badan, dan status membership

Semua halaman sudah terhubung — klik menu di Beranda langsung berpindah halaman beneran.

## Cara Menjalankan (mode lokal, tanpa setup apapun)

Pastikan [Node.js](https://nodejs.org) (versi 18 ke atas) sudah terpasang.

```bash
# 1. Masuk ke folder project
cd sehat-bersama-pak-aji

# 2. Install dependencies
npm install

# 3. Jalankan mode development
npm run dev
```

Buka browser ke alamat yang muncul di terminal, biasanya `http://localhost:5173`.

**Tanpa setup apapun, app langsung jalan** — layar login otomatis dilewati dan data tersimpan di `localStorage` perangkat itu saja (sama seperti sebelumnya). Ini cocok untuk coba-coba atau kalau memang cuma dipakai di satu HP/browser.

## Mengaktifkan Sync Cloud + Login (opsional, ±5 menit)

Kalau mau datanya ikut ke HP manapun (login lalu semua data langsung muncul), aktifkan Firebase:

1. Buka [console.firebase.google.com](https://console.firebase.google.com), buat project baru (gratis)
2. Di dashboard project, klik ikon web `</>` untuk mendaftarkan app baru, lalu copy objek `firebaseConfig` yang muncul
3. Buka `src/firebaseConfig.js` di project ini, tempel nilai-nilainya menggantikan tulisan `"GANTI_DENGAN_..."`
4. Di menu kiri Firebase Console, buka **Build → Authentication → Sign-in method**, aktifkan **Email/Password** dan **Anonymous**
5. Di menu kiri, buka **Build → Firestore Database → Create database**, pilih mode **Start in test mode**
6. Jalankan ulang `npm run dev` — sekarang akan muncul layar Masuk/Daftar, dan data otomatis tersimpan ke cloud

Selama `src/firebaseConfig.js` belum diisi, aplikasi otomatis mendeteksi ini dan berjalan di mode lokal saja tanpa error.

## Build untuk Produksi

```bash
npm run build
```

Hasil build akan ada di folder `dist/`, siap di-deploy ke Vercel, Netlify, atau hosting statis lainnya.

## Struktur Project

```
sehat-bersama-pak-aji/
├── public/
│   └── pak-aji.png          ← foto Pak Aji
├── src/
│   ├── App.jsx               ← seluruh aplikasi (semua 9 halaman + navigasi)
│   ├── AuthScreen.jsx         ← layar Masuk / Daftar / Tamu
│   ├── firebase.js            ← inisialisasi Firebase
│   ├── firebaseConfig.js      ← ⚠️ isi config Firebase Anda di sini
│   ├── useAuth.js             ← hook status login
│   ├── usePersist.jsx         ← hook penyimpanan data (local + cloud sync)
│   └── main.jsx                ← entry point React
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Penyimpanan Data

- **Tanpa Firebase dikonfigurasi:** semua data (jadwal diet, belanja, resep & artikel disimpan, profil, dll) tersimpan otomatis ke `localStorage` perangkat itu saja.
- **Dengan Firebase dikonfigurasi + sudah login:** data yang sama tersimpan ke `localStorage` (untuk akses instan/offline) **dan** ke Firestore secara real-time (untuk sync antar perangkat). Kalau koneksi internet putus, perubahan tetap tersimpan lokal dan otomatis terkirim begitu online lagi.
- Akun **Tamu** (Anonymous) tetap punya UID unik di Firebase, jadi datanya tersinkron ke cloud juga — hanya saja untuk login di HP lain dengan data yang sama, disarankan daftar pakai email.
- Ada tombol **"Reset Semua Data"** di halaman Profil untuk mulai ulang dari awal (menghapus data lokal maupun cloud untuk akun tersebut).
- Kalau browser dibuka dalam mode privat/incognito, `localStorage` tidak akan tersimpan setelah tab ditutup — ini keterbatasan browser, bukan bug aplikasi.

## Catatan

- Foto resep & bahan masih memakai gambar contoh dari Unsplash — bisa diganti dengan foto asli.
- Aturan keamanan Firestore ("test mode") di atas terbuka untuk siapapun yang login. Untuk penggunaan jangka panjang/publik, sebaiknya batasi akses lewat **Firestore → Rules** supaya tiap pengguna hanya bisa baca/tulis dokumennya sendiri, misalnya:
  ```
  match /users/{uid} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
  ```
