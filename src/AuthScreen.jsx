import React, { useState } from "react";

export default function AuthScreen({ auth, ping }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function friendlyError(err) {
    const code = err?.code || "";
    if (code.includes("invalid-email")) return "Format email tidak valid.";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
      return "Email atau kata sandi salah.";
    if (code.includes("email-already-in-use")) return "Email ini sudah terdaftar. Coba masuk saja.";
    if (code.includes("weak-password")) return "Kata sandi minimal 6 karakter.";
    return "Terjadi kesalahan. Coba lagi sebentar.";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan kata sandi wajib diisi."); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        await auth.login(email, password);
      } else {
        await auth.register(email, password, nama);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGuest() {
    setBusy(true);
    setError("");
    try {
      await auth.loginAsGuest();
      ping("Masuk sebagai tamu — data tersimpan di perangkat ini");
    } catch {
      setError("Gagal masuk sebagai tamu. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.logoBlock}>
        <img src="pak-aji.png" alt="Pak Aji" style={s.avatar} />
        <div style={s.script}>Sehat Bersama</div>
        <div style={s.bold}>Pak Aji</div>
      </div>

      {!auth.isOnline && (
        <div style={s.offlineNote}>
          ⚠️ Sync online belum aktif (Firebase belum dikonfigurasi). Data tetap tersimpan di perangkat ini.
        </div>
      )}

      <div style={s.card}>
        <div style={s.tabRow}>
          <button style={{ ...s.tabBtn, ...(mode === "login" ? s.tabActive : {}) }} onClick={() => setMode("login")}>Masuk</button>
          <button style={{ ...s.tabBtn, ...(mode === "register" ? s.tabActive : {}) }} onClick={() => setMode("register")}>Daftar</button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {mode === "register" && (
            <input style={s.input} placeholder="Nama kamu" value={nama} onChange={(e) => setNama(e.target.value)} />
          )}
          <input style={s.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoCapitalize="none" />
          <input style={s.input} type="password" placeholder="Kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p style={s.errorText}>{error}</p>}

          <button type="submit" style={s.submitBtn} disabled={busy}>
            {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Buat Akun"}
          </button>
        </form>

        <div style={s.dividerRow}><div style={s.dividerLine} /><span style={s.dividerText}>atau</span><div style={s.dividerLine} /></div>

        <button style={s.guestBtn} onClick={handleGuest} disabled={busy}>
          Lanjutkan sebagai Tamu
        </button>
        <p style={s.guestNote}>
          Sebagai tamu, data tetap tersimpan {auth.isOnline ? "otomatis ke akunmu (bisa dibuat permanen dengan daftar email kapan saja)" : "di perangkat ini"}.
        </p>
      </div>
    </div>
  );
}

const s = {
  wrap: { flex: 1, display: "flex", flexDirection: "column", padding: "40px 26px 30px", justifyContent: "center" },
  logoBlock: { textAlign: "center", marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", objectPosition: "top", border: "3px solid #fff", boxShadow: "0 8px 20px rgba(0,0,0,.12)", marginBottom: 10 },
  script: { fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: 20, color: "#b5121a", lineHeight: 1 },
  bold: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 28, color: "#d81f27", lineHeight: 1.1 },
  offlineNote: {
    background: "#fdf0d8", color: "#8a5a1f", fontSize: 10.5, lineHeight: 1.5, padding: "9px 12px",
    borderRadius: 12, marginBottom: 14, textAlign: "center",
  },
  card: { background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #f1e8dd", boxShadow: "0 8px 20px rgba(0,0,0,.05)" },
  tabRow: { display: "flex", background: "#fdf6ee", borderRadius: 12, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, padding: "9px 0", borderRadius: 9, border: "none", background: "transparent", color: "#8a7b70", fontWeight: 700, fontSize: 12.5, cursor: "pointer" },
  tabActive: { background: "#b5121a", color: "#fff", boxShadow: "0 4px 10px rgba(181,18,26,.25)" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    border: "1px solid #f1e8dd", borderRadius: 12, padding: "12px 14px", fontSize: 13,
    fontFamily: "'Poppins', sans-serif", color: "#2c1810", outline: "none", background: "#fdf6ee",
  },
  errorText: { fontSize: 11, color: "#d81f27", fontWeight: 500, margin: 0 },
  submitBtn: {
    marginTop: 4, background: "#b5121a", color: "#fff", border: "none", padding: 13, borderRadius: 12,
    fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 8px 18px rgba(181,18,26,.3)",
  },
  dividerRow: { display: "flex", alignItems: "center", gap: 10, margin: "18px 0 14px" },
  dividerLine: { flex: 1, height: 1, background: "#f1e8dd" },
  dividerText: { fontSize: 10.5, color: "#b3a795", fontWeight: 600 },
  guestBtn: {
    width: "100%", background: "#fdf6ee", color: "#2c1810", border: "1px solid #f1e8dd", padding: 12,
    borderRadius: 12, fontWeight: 700, fontSize: 12.5, cursor: "pointer",
  },
  guestNote: { fontSize: 10, color: "#8a7b70", textAlign: "center", marginTop: 10, lineHeight: 1.5 },
};
