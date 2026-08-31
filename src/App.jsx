import React, { useState, useMemo, useRef } from "react";
import { usePersistentState, PersistProvider, clearAllPersistedData } from "./usePersist.jsx";
import { useAuth } from "./useAuth.js";
import AuthScreen from "./AuthScreen.jsx";

/* ============================================================
   SHARED SHELL: StatusBar, BottomNav, Toast
============================================================ */

function StatusBar({ dark = true }) {
  const color = dark ? "#2c1810" : "#2c1810";
  return (
    <div style={shared.statusbar}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="17" height="11" viewBox="0 0 17 11">
          <rect x="0" y="7" width="3" height="4" fill={color} />
          <rect x="4.5" y="5" width="3" height="6" fill={color} />
          <rect x="9" y="3" width="3" height="8" fill={color} />
          <rect x="13.5" y="0" width="3" height="11" fill={color} />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12">
          <rect x="1" y="1" width="20" height="10" rx="2.5" stroke={color} fill="none" />
          <rect x="2.5" y="2.5" width="16" height="7" rx="1.3" fill="#d81f27" />
          <rect x="22" y="4" width="1.6" height="4" rx="0.8" fill={color} />
        </svg>
      </div>
    </div>
  );
}

const NAV_TABS = [
  { key: "beranda", icon: "🏠", label: "Beranda" },
  { key: "resep", icon: "📖", label: "Resep" },
  { key: "profil-tab", icon: "👑", label: "Premium" },
  { key: "notif", icon: "🔔", label: "Notifikasi" },
  { key: "profil", icon: "👤", label: "Profil" },
];

function BottomNav({ active, onNavigate }) {
  return (
    <div style={shared.bottomnav}>
      {NAV_TABS.map((n) =>
        n.key === "profil-tab" ? (
          <button key={n.key} style={shared.navItemCenter} onClick={() => onNavigate("profil")}>
            <div style={shared.dotActive}>{n.icon}</div>
            <span style={{ ...shared.navLabel, color: "#b5121a", marginTop: -2 }}>{n.label}</span>
          </button>
        ) : (
          <button key={n.key} style={shared.navItem} onClick={() => onNavigate(n.key)}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span
              style={{
                ...shared.navLabel,
                color: active === n.key ? "#b5121a" : "#8a7b70",
                fontWeight: active === n.key ? 700 : 600,
              }}
            >
              {n.label}
            </span>
          </button>
        )
      )}
    </div>
  );
}

/* ============================================================
   1. ONBOARDING
============================================================ */

const SLIDES = [
  { title: "Resep Madura, Gaya Sehat", desc: "Temukan resep sehat khas Madura bersama Pak Aji dan jalani hidup lebih berkualitas setiap hari." },
  { title: "Menu Diet Sesuai Targetmu", desc: "Pak Aji bantu susun menu diet harian yang pas dengan kebutuhan kalori dan tujuanmu." },
  { title: "Pantau Progres Setiap Hari", desc: "Catat kalori, cek jadwal makan, dan lihat perkembangan dietmu langsung dari satu tempat." },
];

function OnboardingScreen({ onFinish }) {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef(null);
  const isLast = slide === SLIDES.length - 1;

  function goTo(i) { setSlide(Math.max(0, Math.min(SLIDES.length - 1, i))); }
  function handleNext() { isLast ? onFinish() : goTo(slide + 1); }
  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goTo(slide - 1);
    else if (delta < -50) goTo(slide + 1);
    touchStartX.current = null;
  }

  return (
    <>
      <svg style={{ ...sOnboard.leaf, top: 108, right: 14, width: 34 }} viewBox="0 0 24 24" fill="#3a7d44">
        <path d="M12 2C7 2 3 6 3 11c0 5.5 4.5 9 9 11 4.5-2 9-5.5 9-11 0-5-4-9-9-9zm0 3c2.8 0 5 2.2 5 5 0 3.3-2.5 5.7-5 7-2.5-1.3-5-3.7-5-7 0-2.8 2.2-5 5-5z" />
      </svg>
      <svg style={{ ...sOnboard.leaf, top: 210, left: 20, width: 22 }} viewBox="0 0 24 24" fill="#d81f27"><circle cx="12" cy="13" r="9" /></svg>
      <svg style={{ ...sOnboard.leaf, top: 400, right: 6, width: 24 }} viewBox="0 0 24 24" fill="#d81f27"><circle cx="12" cy="13" r="9" /></svg>

      <div style={{ padding: "10px 30px 0", zIndex: 5 }}>
        <div style={sOnboard.script}>Sehat Bersama</div>
        <div style={sOnboard.bold}>Pak Aji</div>
        <div style={sOnboard.pillBtn}>Masakan Sehat, Hidup Hebat</div>
      </div>

      <div style={{ flex: 1, position: "relative", marginTop: 6 }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img src="pak-aji.png" alt="Pak Aji" style={sOnboard.portrait} />
      </div>

      <div key={slide} style={{ ...sOnboard.caption, animation: "fadeUp .35s ease" }}>
        <h3 style={sOnboard.captionTitle}>{SLIDES[slide].title}</h3>
        <p style={sOnboard.captionDesc}>{SLIDES[slide].desc}</p>
      </div>

      <div style={sOnboard.dotsRow}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ ...sOnboard.dot, width: i === slide ? 20 : 7, borderRadius: i === slide ? 5 : "50%", background: i === slide ? "#fff" : "rgba(255,255,255,.4)" }} />
        ))}
      </div>

      <button style={sOnboard.cta} onClick={handleNext}>{isLast ? "Mulai Sekarang" : "Lanjut"}</button>
      {!isLast && <button style={sOnboard.skip} onClick={() => goTo(SLIDES.length - 1)}>Lewati</button>}
    </>
  );
}

const sOnboard = {
  leaf: { position: "absolute", opacity: 0.85, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.15))" },
  script: { fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: 30, color: "#b5121a", lineHeight: 1 },
  bold: { fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 44, color: "#d81f27", lineHeight: 1.05, marginTop: 2 },
  pillBtn: { display: "inline-block", marginTop: 14, background: "#b5121a", color: "#fff", fontWeight: 600, fontSize: 13.5, padding: "10px 20px", borderRadius: 30, boxShadow: "0 6px 14px rgba(181,18,26,.35)" },
  portrait: { position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 320, zIndex: 3, filter: "drop-shadow(0 20px 20px rgba(0,0,0,.2))", userSelect: "none", pointerEvents: "none" },
  caption: { position: "relative", zIndex: 6, textAlign: "center", color: "#fff", padding: "0 34px" },
  captionTitle: { fontSize: 19, fontWeight: 700, marginBottom: 6 },
  captionDesc: { fontSize: 12.5, lineHeight: 1.55, opacity: 0.92, fontWeight: 400 },
  dotsRow: { display: "flex", gap: 6, justifyContent: "center", margin: "16px 0 14px", position: "relative", zIndex: 6 },
  dot: { height: 7, border: "none", padding: 0, cursor: "pointer" },
  cta: { margin: "0 30px 14px", background: "#fff", color: "#b5121a", textAlign: "center", padding: 15, borderRadius: 30, fontWeight: 700, fontSize: 15, position: "relative", zIndex: 6, boxShadow: "0 8px 20px rgba(0,0,0,.15)", border: "none", cursor: "pointer" },
  skip: { background: "transparent", border: "none", color: "rgba(255,255,255,.85)", fontSize: 12.5, fontWeight: 600, marginBottom: 22, cursor: "pointer", zIndex: 6 },
};

/* ============================================================
   2. BERANDA
============================================================ */

const MENU = [
  { icon: "🥗", label: "Resep Sehat", bg: "#fde3e0", to: "resep" },
  { icon: "🍃", label: "Menu Diet", bg: "#e2f2e0", to: "menu" },
  { icon: "📅", label: "Jadwal Diet", bg: "#fde3e0", to: "jadwal" },
  { icon: "⚖️", label: "Kalkulator Gizi", bg: "#fde9d4", to: "kalkulator" },
  { icon: "🧺", label: "Belanja Sehat", bg: "#e2f2e0", to: "belanja" },
  { icon: "📖", label: "Artikel & Tips", bg: "#f6e6cf", to: "artikel" },
];

const RECIPES_HOME = [
  { name: "Soto Ayam Khas Madura", tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=220&fit=crop" },
  { name: "Pecel Madura Sehat", tag: "Tinggi Serat", tagColor: "green", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=220&fit=crop" },
  { name: "Ikan Bakar Bumbu Rujak", tag: "Tinggi Protein", tagColor: "red", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=220&fit=crop" },
];

const TOTAL_KKAL_HOME = 1600;
const TERPAKAI_HOME = 320;

function BerandaScreen({ onNavigate, ping }) {
  const [bookmarks, setBookmarks] = usePersistentState("beranda_bookmarks", {});
  const sisaKkal = TOTAL_KKAL_HOME - TERPAKAI_HOME;
  const pct = Math.min(100, (TERPAKAI_HOME / TOTAL_KKAL_HOME) * 100);

  return (
    <>
      <div style={sBeranda.hero}>
        <div style={sBeranda.eyebrow}>Halo, Sahabat Sehat!</div>
        <h1 style={sBeranda.h1}>Selamat Datang<br />Bersama Pak Aji</h1>
        <p style={sBeranda.quote}>"Sehat bukan tujuan, tapi gaya hidup yang kita pilih setiap hari."</p>
        <img src="pak-aji.png" alt="Pak Aji" style={sBeranda.portrait} />
      </div>

      <button style={sBeranda.premiumBanner} onClick={() => onNavigate("profil")}>
        <div style={sBeranda.crown}>👑</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <h4 style={sBeranda.bannerTitle}>Premium Member</h4>
          <p style={sBeranda.bannerDesc}>Nikmati semua fitur eksklusif untuk hidup lebih sehat</p>
          <span style={sBeranda.linkPillLight}>Lihat Keuntungan &nbsp;›</span>
        </div>
      </button>

      <div style={sBeranda.grid6}>
        {MENU.map((m) => (
          <button key={m.label} style={sBeranda.gridItem} onClick={() => onNavigate(m.to)}>
            <div style={{ ...sBeranda.iconCirc, background: m.bg }}>{m.icon}</div>
            <span style={sBeranda.gridLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      <div style={sBeranda.sectionHead}>
        <h3 style={sBeranda.sectionTitle}>Resep Populer</h3>
        <button style={sBeranda.linkBtn} onClick={() => onNavigate("resep")}>Lihat Semua</button>
      </div>
      <div style={sBeranda.recipesRow}>
        {RECIPES_HOME.map((r) => (
          <div key={r.name} style={sBeranda.recipeCard}>
            <div style={{ ...sBeranda.thumb, backgroundImage: `url(${r.img})` }}>
              <button style={sBeranda.bookmarkBtn} onClick={() => setBookmarks((b) => ({ ...b, [r.name]: !b[r.name] }))}>
                {bookmarks[r.name] ? "🔖" : "📑"}
              </button>
            </div>
            <div style={sBeranda.recipeName}>{r.name}</div>
            <span style={{ ...sBeranda.tag, background: r.tagColor === "red" ? "#fde3e0" : "#e2f2e0", color: r.tagColor === "red" ? "#d81f27" : "#3a7d44" }}>{r.tag}</span>
          </div>
        ))}
      </div>

      <div style={sBeranda.sectionHead}>
        <h3 style={sBeranda.sectionTitle}>Jadwal Diet Hari Ini</h3>
        <button style={sBeranda.linkBtn} onClick={() => onNavigate("jadwal")}>Lihat Semua</button>
      </div>
      <div style={sBeranda.jadwalCard}>
        <div style={sBeranda.jadwalTop}>
          <img src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=120&h=120&fit=crop" alt="Sarapan" style={sBeranda.jadwalImg} />
          <div style={{ flex: 1 }}>
            <h5 style={sBeranda.jadwalName}>Sarapan</h5>
            <p style={sBeranda.jadwalDesc}>Bubur Oat Madura + Buah Naga</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={sBeranda.jadwalKkal}>{TERPAKAI_HOME} kkal</b>
            <small style={sBeranda.jadwalSmall}>Estimasi</small>
          </div>
        </div>
        <div style={sBeranda.bar}><i style={{ ...sBeranda.barFill, width: `${pct}%` }} /></div>
        <div style={sBeranda.kalRow}>
          <span>Kalori Tersisa</span>
          <span><b style={{ color: "#b5121a" }}>{sisaKkal.toLocaleString("id-ID")}</b> / {TOTAL_KKAL_HOME.toLocaleString("id-ID")} kkal</span>
        </div>
      </div>

      <button style={sBeranda.upgradeBanner} onClick={() => onNavigate("profil")}>
        <div style={{ flex: 1, textAlign: "left" }}>
          <h4 style={sBeranda.bannerTitle}>Upgrade ke Premium</h4>
          <p style={sBeranda.bannerDesc}>Dapatkan akses ke semua resep, menu diet eksklusif, dan fitur lengkap!</p>
          <span style={sBeranda.linkPillWhite}>Upgrade Sekarang ›</span>
        </div>
        <div style={sBeranda.bowl}>🍲</div>
      </button>

      <div style={sBeranda.sectionHead}><h3 style={sBeranda.sectionTitle}>Tips Hari Ini</h3></div>
      <div style={sBeranda.tipsCard}>
        <div style={{ fontSize: 26 }}>🥛</div>
        <p style={sBeranda.tipsText}>Minum air putih minimal 8 gelas sehari untuk menjaga metabolisme tubuh.</p>
      </div>
    </>
  );
}

const sBeranda = {
  hero: { background: "linear-gradient(180deg,#f7ece0 0%, #f7ece0 55%, #fdf6ee 100%)", padding: "6px 24px 0", position: "relative" },
  eyebrow: { color: "#b5121a", fontWeight: 700, fontSize: 14, marginTop: 6 },
  h1: { fontSize: 23, fontWeight: 800, color: "#2c1810", lineHeight: 1.25, marginTop: 2 },
  quote: { fontSize: 12, fontStyle: "italic", color: "#8a7b70", marginTop: 8, maxWidth: 180, lineHeight: 1.5 },
  portrait: { position: "absolute", top: 2, right: 6, width: 168, filter: "drop-shadow(0 12px 14px rgba(0,0,0,.18))", userSelect: "none" },
  premiumBanner: { margin: "14px 22px 0", background: "linear-gradient(120deg, #d81f27, #7a0e13)", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, color: "#fff", boxShadow: "0 10px 20px rgba(181,18,26,.25)", border: "none", width: "calc(100% - 44px)", cursor: "pointer", textAlign: "left" },
  crown: { width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  bannerTitle: { fontSize: 14.5, fontWeight: 700, marginBottom: 3 },
  bannerDesc: { fontSize: 11, opacity: 0.9, lineHeight: 1.4 },
  linkPillLight: { marginTop: 8, display: "inline-block", background: "rgba(255,255,255,.22)", fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20 },
  linkPillWhite: { marginTop: 8, display: "inline-block", background: "#fff", color: "#b5121a", fontSize: 10.5, fontWeight: 700, padding: "5px 12px", borderRadius: 20 },
  grid6: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "16px 20px 4px" },
  gridItem: { background: "#fff", borderRadius: 16, padding: "14px 6px 10px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,.05)", border: "1px solid #f1e8dd", cursor: "pointer" },
  iconCirc: { width: 38, height: 38, margin: "0 auto 8px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  gridLabel: { fontSize: 11.5, fontWeight: 600, color: "#2c1810" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "18px 22px 10px" },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#2c1810" },
  linkBtn: { fontSize: 11.5, color: "#b5121a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" },
  recipesRow: { display: "flex", gap: 12, padding: "0 22px", overflowX: "auto" },
  recipeCard: { minWidth: 118, flexShrink: 0 },
  thumb: { width: 118, height: 90, borderRadius: 14, backgroundSize: "cover", backgroundPosition: "center", position: "relative", marginBottom: 6 },
  bookmarkBtn: { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" },
  recipeName: { fontSize: 12, fontWeight: 600, color: "#2c1810", lineHeight: 1.3 },
  tag: { display: "inline-block", marginTop: 4, fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 8 },
  jadwalCard: { margin: "12px 22px 0", background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 4px 10px rgba(0,0,0,.05)", border: "1px solid #f1e8dd" },
  jadwalTop: { display: "flex", gap: 12, alignItems: "center" },
  jadwalImg: { width: 52, height: 52, borderRadius: 12, objectFit: "cover" },
  jadwalName: { fontSize: 13.5, fontWeight: 700, color: "#2c1810" },
  jadwalDesc: { fontSize: 11, color: "#8a7b70", marginTop: 2 },
  jadwalKkal: { fontSize: 13, color: "#b5121a", display: "block" },
  jadwalSmall: { display: "block", fontSize: 9.5, color: "#8a7b70" },
  bar: { height: 5, background: "#f1e8dd", borderRadius: 4, marginTop: 10, overflow: "hidden" },
  barFill: { display: "block", height: "100%", background: "#b5121a", borderRadius: 4, transition: "width .4s ease" },
  kalRow: { display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10.5, color: "#8a7b70" },
  upgradeBanner: { margin: "16px 22px 0", background: "linear-gradient(120deg, #b5121a, #7a0e13)", borderRadius: 18, padding: 16, display: "flex", alignItems: "center", color: "#fff", boxShadow: "0 10px 20px rgba(181,18,26,.22)", border: "none", width: "calc(100% - 44px)", cursor: "pointer" },
  bowl: { width: 54, height: 54, borderRadius: 14, background: "rgba(255,255,255,.13)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginLeft: 8, flexShrink: 0 },
  tipsCard: { margin: "16px 22px 24px", background: "#f2e6d6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 },
  tipsText: { fontSize: 11.5, color: "#2c1810", lineHeight: 1.5, fontWeight: 500 },
};

/* ============================================================
   Shared sub-page header
============================================================ */
function SubHeader({ title, onBack, right }) {
  return (
    <div style={shared.header}>
      <button style={shared.backBtn} onClick={onBack}>‹</button>
      <h2 style={shared.headerTitle}>{title}</h2>
      <div style={{ width: 34, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

/* ============================================================
   3. KALKULATOR GIZI
============================================================ */

function KalkulatorScreen({ onBack }) {
  const [gender, setGender] = usePersistentState("kalkulator_gender", "pria");
  const [age, setAge] = usePersistentState("kalkulator_age", 30);
  const [height, setHeight] = usePersistentState("kalkulator_height", 165);
  const [weight, setWeight] = usePersistentState("kalkulator_weight", 70);
  const [activity, setActivity] = usePersistentState("kalkulator_activity", "sedang");
  const [goal, setGoal] = usePersistentState("kalkulator_goal", "turun");

  const ACTIVITY = {
    santai: { label: "Jarang Olahraga", mult: 1.2 },
    ringan: { label: "Olahraga Ringan (1-3x/mgg)", mult: 1.375 },
    sedang: { label: "Olahraga Sedang (3-5x/mgg)", mult: 1.55 },
    berat: { label: "Olahraga Berat (6-7x/mgg)", mult: 1.725 },
  };
  const GOAL = {
    turun: { label: "Turun Berat Badan", delta: -500 },
    jaga: { label: "Jaga Berat Badan", delta: 0 },
    naik: { label: "Naik Berat Badan", delta: 500 },
  };

  const result = useMemo(() => {
    const h = Number(height), w = Number(weight), a = Number(age);
    const bmr = gender === "pria" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY[activity].mult;
    const target = tdee + GOAL[goal].delta;
    const bmi = w / ((h / 100) * (h / 100));
    let bmiCat = "Normal", bmiColor = "#3a7d44";
    if (bmi < 18.5) { bmiCat = "Kurus"; bmiColor = "#d89b1f"; }
    else if (bmi >= 25 && bmi < 30) { bmiCat = "Gemuk"; bmiColor = "#d89b1f"; }
    else if (bmi >= 30) { bmiCat = "Obesitas"; bmiColor = "#d81f27"; }
    return {
      bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target), bmi: bmi.toFixed(1), bmiCat, bmiColor,
      protein: Math.round((target * 0.3) / 4), carb: Math.round((target * 0.4) / 4), fat: Math.round((target * 0.3) / 9),
    };
  }, [gender, age, height, weight, activity, goal]);

  return (
    <>
      <SubHeader title="Kalkulator Gizi" onBack={onBack} />
      <div style={sKal.resultCard}>
        <p style={sKal.resultLabel}>Kebutuhan Kalori Harianmu</p>
        <h1 style={sKal.resultNum}>{result.target.toLocaleString("id-ID")}</h1>
        <p style={sKal.resultUnit}>kkal / hari</p>
        <div style={sKal.resultDivider} />
        <div style={sKal.resultRow}>
          <div style={sKal.resultCol}><span style={sKal.resultColLabel}>BMR</span><b style={sKal.resultColVal}>{result.bmr.toLocaleString("id-ID")}</b></div>
          <div style={sKal.resultCol}><span style={sKal.resultColLabel}>TDEE</span><b style={sKal.resultColVal}>{result.tdee.toLocaleString("id-ID")}</b></div>
          <div style={sKal.resultCol}><span style={sKal.resultColLabel}>BMI</span><b style={{ ...sKal.resultColVal, color: "#fff" }}>{result.bmi}</b></div>
        </div>
      </div>
      <div style={{ ...sKal.bmiPill, background: result.bmiColor + "22", color: result.bmiColor }}>Kategori BMI: <b>{result.bmiCat}</b></div>

      <div style={sKal.sectionHead}><h3 style={sKal.sectionTitle}>Target Makronutrien</h3></div>
      <div style={sKal.macroRow}>
        <div style={sKal.macroCard}><div style={{ ...sKal.macroDot, background: "#d81f27" }} /><b style={sKal.macroVal}>{result.protein}g</b><span style={sKal.macroLabel}>Protein</span></div>
        <div style={sKal.macroCard}><div style={{ ...sKal.macroDot, background: "#d89b1f" }} /><b style={sKal.macroVal}>{result.carb}g</b><span style={sKal.macroLabel}>Karbo</span></div>
        <div style={sKal.macroCard}><div style={{ ...sKal.macroDot, background: "#3a7d44" }} /><b style={sKal.macroVal}>{result.fat}g</b><span style={sKal.macroLabel}>Lemak</span></div>
      </div>

      <div style={sKal.sectionHead}><h3 style={sKal.sectionTitle}>Data Dirimu</h3></div>
      <div style={sKal.formCard}>
        <label style={sKal.label}>Jenis Kelamin</label>
        <div style={sKal.toggleRow}>
          <button style={{ ...sKal.toggleBtn, ...(gender === "pria" ? sKal.toggleActive : {}) }} onClick={() => setGender("pria")}>Pria</button>
          <button style={{ ...sKal.toggleBtn, ...(gender === "wanita" ? sKal.toggleActive : {}) }} onClick={() => setGender("wanita")}>Wanita</button>
        </div>
        <label style={sKal.label}>Usia: <b style={{ color: "#b5121a" }}>{age} tahun</b></label>
        <input type="range" min="10" max="80" value={age} onChange={(e) => setAge(e.target.value)} style={sKal.range} />
        <label style={sKal.label}>Tinggi Badan: <b style={{ color: "#b5121a" }}>{height} cm</b></label>
        <input type="range" min="120" max="210" value={height} onChange={(e) => setHeight(e.target.value)} style={sKal.range} />
        <label style={sKal.label}>Berat Badan: <b style={{ color: "#b5121a" }}>{weight} kg</b></label>
        <input type="range" min="30" max="150" value={weight} onChange={(e) => setWeight(e.target.value)} style={sKal.range} />
        <label style={sKal.label}>Tingkat Aktivitas</label>
        <select style={sKal.select} value={activity} onChange={(e) => setActivity(e.target.value)}>
          {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <label style={sKal.label}>Tujuan</label>
        <div style={sKal.goalRow}>
          {Object.entries(GOAL).map(([k, v]) => (
            <button key={k} style={{ ...sKal.goalBtn, ...(goal === k ? sKal.goalActive : {}) }} onClick={() => setGoal(k)}>{v.label}</button>
          ))}
        </div>
      </div>

      <div style={sKal.tipsCard}>
        <div style={{ fontSize: 22 }}>💡</div>
        <p style={sKal.tipsText}>Angka ini estimasi awal. Untuk hasil paling akurat, konsultasikan dengan ahli gizi terkait kondisi kesehatanmu.</p>
      </div>
    </>
  );
}

const sKal = {
  resultCard: { background: "linear-gradient(135deg, #d81f27, #7a0e13)", borderRadius: 22, padding: "22px 22px 18px", textAlign: "center", color: "#fff", boxShadow: "0 12px 24px rgba(181,18,26,.3)", margin: "8px 22px 0" },
  resultLabel: { fontSize: 12, opacity: 0.85, fontWeight: 500 },
  resultNum: { fontSize: 42, fontWeight: 800, marginTop: 4, lineHeight: 1 },
  resultUnit: { fontSize: 12, opacity: 0.85, marginTop: 2 },
  resultDivider: { height: 1, background: "rgba(255,255,255,.2)", margin: "16px 0 12px" },
  resultRow: { display: "flex", justifyContent: "space-around" },
  resultCol: { display: "flex", flexDirection: "column", gap: 3 },
  resultColLabel: { fontSize: 10, opacity: 0.8 },
  resultColVal: { fontSize: 15, fontWeight: 700 },
  bmiPill: { margin: "12px 22px 0", textAlign: "center", fontSize: 12.5, fontWeight: 600, padding: "9px 14px", borderRadius: 12 },
  sectionHead: { padding: "18px 22px 10px" },
  sectionTitle: { fontSize: 15.5, fontWeight: 700, color: "#2c1810" },
  macroRow: { display: "flex", gap: 10, padding: "0 22px" },
  macroCard: { flex: 1, background: "#fff", borderRadius: 14, padding: "14px 8px", textAlign: "center", border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  macroDot: { width: 8, height: 8, borderRadius: "50%", margin: "0 auto 8px" },
  macroVal: { fontSize: 16, color: "#2c1810", display: "block" },
  macroLabel: { fontSize: 10.5, color: "#8a7b70" },
  formCard: { margin: "0 22px", background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#2c1810", marginBottom: 8, marginTop: 16 },
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 0", borderRadius: 12, border: "1px solid #f1e8dd", background: "#fdf6ee", color: "#8a7b70", fontWeight: 600, fontSize: 12.5, cursor: "pointer" },
  toggleActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a" },
  range: { width: "100%" },
  select: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #f1e8dd", background: "#fdf6ee", color: "#2c1810", fontSize: 12.5, fontWeight: 500, fontFamily: "'Poppins', sans-serif" },
  goalRow: { display: "flex", flexDirection: "column", gap: 8 },
  goalBtn: { padding: "10px 12px", borderRadius: 12, border: "1px solid #f1e8dd", background: "#fdf6ee", color: "#8a7b70", fontWeight: 600, fontSize: 12.5, textAlign: "left", cursor: "pointer" },
  goalActive: { background: "#fde3e0", color: "#b5121a", border: "1px solid #d81f27" },
  tipsCard: { margin: "16px 22px 24px", background: "#f2e6d6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 },
  tipsText: { fontSize: 11.5, color: "#2c1810", lineHeight: 1.5, fontWeight: 500 },
};

/* ============================================================
   4. JADWAL DIET
============================================================ */

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DEFAULT_MEALS = [
  { id: 1, waktu: "07:00", tipe: "Sarapan", nama: "Bubur Oat Madura + Buah Naga", kkal: 320, img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=120&h=120&fit=crop", done: true },
  { id: 2, waktu: "10:00", tipe: "Snack Pagi", nama: "Segenggam Kacang Almond", kkal: 120, img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=120&h=120&fit=crop", done: true },
  { id: 3, waktu: "12:30", tipe: "Makan Siang", nama: "Pecel Madura Sehat + Tahu", kkal: 420, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop", done: false },
  { id: 4, waktu: "16:00", tipe: "Snack Sore", nama: "Jus Buah Naga Tanpa Gula", kkal: 90, img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=120&h=120&fit=crop", done: false },
  { id: 5, waktu: "19:00", tipe: "Makan Malam", nama: "Ikan Bakar Bumbu Rujak + Lalapan", kkal: 380, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=120&h=120&fit=crop", done: false },
];
const TARGET_KKAL_JADWAL = 1600;

function JadwalScreen({ onBack, ping }) {
  const [activeDay, setActiveDay] = usePersistentState("jadwal_activeDay", 2);
  const [meals, setMeals] = usePersistentState("jadwal_meals", DEFAULT_MEALS);

  const totalKkal = useMemo(() => meals.reduce((s, m) => s + m.kkal, 0), [meals]);
  const doneKkal = useMemo(() => meals.filter((m) => m.done).reduce((s, m) => s + m.kkal, 0), [meals]);
  const sisaKkal = Math.max(0, TARGET_KKAL_JADWAL - doneKkal);
  const pct = Math.min(100, (doneKkal / TARGET_KKAL_JADWAL) * 100);

  function toggleDone(id) {
    setMeals((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const updated = { ...m, done: !m.done };
      ping(updated.done ? `${m.tipe} ditandai selesai ✅` : `${m.tipe} dibatalkan`);
      return updated;
    }));
  }

  return (
    <>
      <SubHeader title="Jadwal Diet" onBack={onBack} right={
        <button style={sJadwal.addBtn} onClick={() => ping("Fitur tambah menu segera hadir 🚧")}>+</button>
      } />
      <div style={sJadwal.daysRow}>
        {DAYS.map((d, i) => (
          <button key={d} onClick={() => setActiveDay(i)} style={{ ...sJadwal.dayBtn, ...(i === activeDay ? sJadwal.dayActive : {}) }}>{d}</button>
        ))}
      </div>

      <div style={{ padding: "0 22px" }}>
        <div style={sJadwal.progressCard}>
          <div style={sJadwal.progressTop}>
            <div>
              <p style={sJadwal.progressLabel}>Kalori Terpakai</p>
              <h2 style={sJadwal.progressNum}>{doneKkal.toLocaleString("id-ID")}<span style={sJadwal.progressTarget}> / {TARGET_KKAL_JADWAL.toLocaleString("id-ID")} kkal</span></h2>
            </div>
            <div style={sJadwal.ringWrap}>
              <svg width="58" height="58" viewBox="0 0 58 58">
                <circle cx="29" cy="29" r="24" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="6" />
                <circle cx="29" cy="29" r="24" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * (1 - pct / 100)} strokeLinecap="round" transform="rotate(-90 29 29)" style={{ transition: "stroke-dashoffset .4s ease" }} />
              </svg>
              <span style={sJadwal.ringText}>{Math.round(pct)}%</span>
            </div>
          </div>
          <div style={sJadwal.progressBottom}>
            <span>Sisa: <b>{sisaKkal.toLocaleString("id-ID")} kkal</b></span>
            <span>Total Menu: <b>{totalKkal.toLocaleString("id-ID")} kkal</b></span>
          </div>
        </div>

        <div style={sJadwal.sectionHead}>
          <h3 style={sJadwal.sectionTitle}>Menu Hari Ini</h3>
          <span style={sJadwal.countPill}>{meals.filter((m) => m.done).length}/{meals.length} selesai</span>
        </div>

        <div style={sJadwal.timeline}>
          {meals.map((m, idx) => (
            <div key={m.id} style={sJadwal.timelineRow}>
              <div style={sJadwal.timeCol}>
                <span style={sJadwal.timeText}>{m.waktu}</span>
                <div style={sJadwal.timelineLine}>
                  <div style={{ ...sJadwal.timelineDot, ...(m.done ? sJadwal.timelineDotDone : {}) }} />
                  {idx < meals.length - 1 && <div style={sJadwal.timelineBar} />}
                </div>
              </div>
              <div style={{ ...sJadwal.mealCard, ...(m.done ? sJadwal.mealCardDone : {}) }}>
                <img src={m.img} alt={m.nama} style={sJadwal.mealImg} />
                <div style={{ flex: 1 }}>
                  <span style={sJadwal.mealTipe}>{m.tipe}</span>
                  <h5 style={{ ...sJadwal.mealName, ...(m.done ? { textDecoration: "line-through", opacity: 0.5 } : {}) }}>{m.nama}</h5>
                  <span style={sJadwal.mealKkal}>{m.kkal} kkal</span>
                </div>
                <button onClick={() => toggleDone(m.id)} style={{ ...sJadwal.checkBtn, ...(m.done ? sJadwal.checkBtnDone : {}) }}>{m.done ? "✓" : ""}</button>
              </div>
            </div>
          ))}
        </div>

        <div style={sJadwal.tipsCard}>
          <div style={{ fontSize: 22 }}>🔥</div>
          <p style={sJadwal.tipsText}>Coret menu setelah dimakan biar Pak Aji bisa pantau progres kalorimu hari ini.</p>
        </div>
      </div>
    </>
  );
}

const sJadwal = {
  addBtn: { width: 34, height: 34, borderRadius: "50%", background: "#b5121a", border: "none", fontSize: 18, color: "#fff", cursor: "pointer", fontWeight: 700, boxShadow: "0 4px 10px rgba(181,18,26,.3)" },
  daysRow: { display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" },
  dayBtn: { minWidth: 42, padding: "9px 0", borderRadius: 12, border: "1px solid #f1e8dd", background: "#fff", color: "#8a7b70", fontWeight: 700, fontSize: 12.5, cursor: "pointer" },
  dayActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a", boxShadow: "0 4px 10px rgba(181,18,26,.25)" },
  progressCard: { background: "linear-gradient(135deg, #d81f27, #7a0e13)", borderRadius: 20, padding: 18, color: "#fff", boxShadow: "0 12px 24px rgba(181,18,26,.28)" },
  progressTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { fontSize: 11.5, opacity: 0.85 },
  progressNum: { fontSize: 24, fontWeight: 800, marginTop: 2 },
  progressTarget: { fontSize: 12, fontWeight: 500, opacity: 0.8 },
  ringWrap: { position: "relative", width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center" },
  ringText: { position: "absolute", fontSize: 11, fontWeight: 700 },
  progressBottom: { display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.2)", fontSize: 11, opacity: 0.9 },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0 12px" },
  sectionTitle: { fontSize: 15.5, fontWeight: 700, color: "#2c1810" },
  countPill: { fontSize: 10.5, fontWeight: 700, color: "#b5121a", background: "#fde3e0", padding: "4px 10px", borderRadius: 10 },
  timeline: { display: "flex", flexDirection: "column" },
  timelineRow: { display: "flex", gap: 10 },
  timeCol: { display: "flex", flexDirection: "column", alignItems: "center", width: 44, flexShrink: 0 },
  timeText: { fontSize: 10, fontWeight: 700, color: "#8a7b70", marginBottom: 6 },
  timelineLine: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1 },
  timelineDot: { width: 10, height: 10, borderRadius: "50%", background: "#f1e8dd", border: "2px solid #d8c9b8", flexShrink: 0 },
  timelineDotDone: { background: "#3a7d44", border: "2px solid #3a7d44" },
  timelineBar: { width: 2, flex: 1, background: "#f1e8dd", marginTop: 2, minHeight: 26 },
  mealCard: { flex: 1, background: "#fff", borderRadius: 16, padding: 10, marginBottom: 14, display: "flex", alignItems: "center", gap: 10, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  mealCardDone: { background: "#f7f5f0" },
  mealImg: { width: 46, height: 46, borderRadius: 12, objectFit: "cover", flexShrink: 0 },
  mealTipe: { fontSize: 10, fontWeight: 700, color: "#b5121a", textTransform: "uppercase", letterSpacing: 0.3 },
  mealName: { fontSize: 12.5, fontWeight: 600, color: "#2c1810", marginTop: 2, lineHeight: 1.3 },
  mealKkal: { fontSize: 10.5, color: "#8a7b70", marginTop: 2, display: "block" },
  checkBtn: { width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #d8c9b8", background: "#fff", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0 },
  checkBtnDone: { background: "#3a7d44", border: "1.5px solid #3a7d44" },
  tipsCard: { marginTop: 8, marginBottom: 20, background: "#f2e6d6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 },
  tipsText: { fontSize: 11.5, color: "#2c1810", lineHeight: 1.5, fontWeight: 500 },
};

/* ============================================================
   5. MENU DIET
============================================================ */

const CATEGORIES_MENU = ["Semua", "Sarapan", "Makan Siang", "Makan Malam", "Snack"];
const POPULAR_SEARCHES = ["ikan bakar", "rendah kalori", "protein", "sarapan", "kacang"];
const MENUS = [
  { id: 1, nama: "Bubur Oat Madura + Buah Naga", kategori: "Sarapan", kkal: 320, protein: 9, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&h=220&fit=crop" },
  { id: 2, nama: "Roti Gandum Isi Telur & Alpukat", kategori: "Sarapan", kkal: 280, protein: 14, tag: "Tinggi Protein", tagColor: "red", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=220&fit=crop" },
  { id: 3, nama: "Pecel Madura Sehat", kategori: "Makan Siang", kkal: 420, protein: 16, tag: "Tinggi Serat", tagColor: "green", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=220&fit=crop" },
  { id: 4, nama: "Soto Ayam Khas Madura", kategori: "Makan Siang", kkal: 310, protein: 22, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=220&fit=crop" },
  { id: 5, nama: "Ikan Bakar Bumbu Rujak + Lalapan", kategori: "Makan Malam", kkal: 380, protein: 28, tag: "Tinggi Protein", tagColor: "red", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=220&fit=crop" },
  { id: 6, nama: "Sup Bening Sayur & Tahu", kategori: "Makan Malam", kkal: 210, protein: 12, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=220&fit=crop" },
  { id: 7, nama: "Jus Buah Naga Tanpa Gula", kategori: "Snack", kkal: 90, protein: 2, tag: "Segar", tagColor: "green", img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300&h=220&fit=crop" },
  { id: 8, nama: "Segenggam Kacang Almond", kategori: "Snack", kkal: 120, protein: 5, tag: "Mengenyangkan", tagColor: "green", img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&h=220&fit=crop" },
];

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx), match = text.slice(idx, idx + query.length), after = text.slice(idx + query.length);
  return (<>{before}<mark style={{ background: "#fde3e0", color: "#b5121a", borderRadius: 3, padding: "0 1px" }}>{match}</mark>{after}</>);
}

function MenuScreen({ onBack, ping }) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = usePersistentState("menu_saved", {});
  const [added, setAdded] = usePersistentState("menu_added", {});
  const [recent, setRecent] = usePersistentState("menu_recent", []);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => MENUS.filter((m) => {
    const matchCat = category === "Semua" || m.kategori === category;
    const matchQuery = m.nama.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  }), [category, query]);

  function commitSearch(term) {
    const t = term.trim();
    setQuery(t);
    if (t) setRecent((r) => [t, ...r.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5));
  }
  function toggleSave(id, nama) {
    setSaved((s) => { const next = { ...s, [id]: !s[id] }; ping(next[id] ? `${nama} disimpan 🔖` : "Dihapus dari simpanan"); return next; });
  }
  function addToJadwal(id, nama) { setAdded((a) => ({ ...a, [id]: true })); ping(`${nama} ditambahkan ke Jadwal Diet ✅`); }

  return (
    <>
      <SubHeader title="Menu Diet" onBack={onBack} />
      <div style={sMenu.searchOuter}>
        <div style={{ ...sMenu.searchWrap, ...(searchFocused ? sMenu.searchWrapFocus : {}) }}>
          <span style={{ fontSize: 13 }}>🔍</span>
          <input style={sMenu.searchInput} placeholder="Cari menu sehat..." value={query}
            onChange={(e) => setQuery(e.target.value)} onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
            onKeyDown={(e) => e.key === "Enter" && commitSearch(query)} />
          {query && <button style={sMenu.clearBtn} onClick={() => setQuery("")}>✕</button>}
        </div>
        {searchFocused && !query && (
          <div style={sMenu.suggestBox}>
            {recent.length > 0 && (
              <>
                <span style={sMenu.suggestLabel}>Pencarian Terakhir</span>
                <div style={sMenu.chipRow}>{recent.map((r) => <button key={r} style={sMenu.chip} onClick={() => commitSearch(r)}>🕘 {r}</button>)}</div>
              </>
            )}
            <span style={sMenu.suggestLabel}>Pencarian Populer</span>
            <div style={sMenu.chipRow}>{POPULAR_SEARCHES.map((s) => <button key={s} style={sMenu.chip} onClick={() => commitSearch(s)}>{s}</button>)}</div>
          </div>
        )}
      </div>

      <div style={sMenu.catRow}>
        {CATEGORIES_MENU.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ ...sMenu.catBtn, ...(category === c ? sMenu.catActive : {}) }}>{c}</button>
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>
        <p style={sMenu.resultCount}>{filtered.length} menu ditemukan</p>
        {filtered.length === 0 && <div style={sMenu.emptyState}><div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div><p style={{ fontSize: 12.5, color: "#8a7b70" }}>Menu tidak ditemukan, coba kata kunci lain.</p></div>}
        {filtered.map((m) => (
          <div key={m.id} style={sMenu.menuCard}>
            <div style={{ ...sMenu.menuThumb, backgroundImage: `url(${m.img})` }}>
              <button style={sMenu.bookmarkBtn} onClick={() => toggleSave(m.id, m.nama)}>{saved[m.id] ? "🔖" : "📑"}</button>
            </div>
            <div style={sMenu.menuInfo}>
              <span style={{ ...sMenu.tag, background: m.tagColor === "red" ? "#fde3e0" : "#e2f2e0", color: m.tagColor === "red" ? "#d81f27" : "#3a7d44" }}>{m.tag}</span>
              <h5 style={sMenu.menuName}>{highlightMatch(m.nama, query)}</h5>
              <div style={sMenu.menuMeta}><span>🔥 {m.kkal} kkal</span><span>💪 {m.protein}g protein</span></div>
              <button style={{ ...sMenu.addBtn, ...(added[m.id] ? sMenu.addBtnDone : {}) }} onClick={() => addToJadwal(m.id, m.nama)} disabled={added[m.id]}>
                {added[m.id] ? "✓ Ditambahkan" : "+ Tambah ke Jadwal"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const sMenu = {
  searchOuter: { position: "relative", margin: "0 20px 12px", zIndex: 15 },
  searchWrap: { background: "#fff", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #f1e8dd" },
  searchWrapFocus: { border: "1px solid #d81f27", boxShadow: "0 0 0 3px rgba(216,31,39,.1)" },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 12.5, fontFamily: "'Poppins', sans-serif", background: "transparent", color: "#2c1810" },
  clearBtn: { border: "none", background: "#f1e8dd", color: "#8a7b70", width: 18, height: 18, borderRadius: "50%", fontSize: 10, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  suggestBox: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 14, border: "1px solid #f1e8dd", boxShadow: "0 10px 24px rgba(0,0,0,.1)", padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  suggestLabel: { fontSize: 10, fontWeight: 700, color: "#8a7b70", textTransform: "uppercase", letterSpacing: 0.3, marginTop: 4 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 2 },
  chip: { background: "#fdf6ee", border: "1px solid #f1e8dd", color: "#2c1810", fontSize: 11, fontWeight: 500, padding: "6px 11px", borderRadius: 20, cursor: "pointer" },
  catRow: { display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" },
  catBtn: { padding: "8px 14px", borderRadius: 20, border: "1px solid #f1e8dd", background: "#fff", color: "#8a7b70", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  catActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a" },
  resultCount: { fontSize: 11, color: "#8a7b70", marginBottom: 10, fontWeight: 500 },
  emptyState: { textAlign: "center", padding: "40px 0" },
  menuCard: { display: "flex", gap: 12, background: "#fff", borderRadius: 16, padding: 10, marginBottom: 12, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  menuThumb: { width: 92, height: 92, borderRadius: 12, backgroundSize: "cover", backgroundPosition: "center", position: "relative", flexShrink: 0 },
  bookmarkBtn: { position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" },
  menuInfo: { flex: 1, display: "flex", flexDirection: "column" },
  tag: { alignSelf: "flex-start", fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 8 },
  menuName: { fontSize: 12.5, fontWeight: 700, color: "#2c1810", marginTop: 5, lineHeight: 1.3 },
  menuMeta: { display: "flex", gap: 10, fontSize: 10.5, color: "#8a7b70", marginTop: 5 },
  addBtn: { alignSelf: "flex-start", marginTop: 8, background: "#fde3e0", color: "#b5121a", border: "none", fontSize: 10.5, fontWeight: 700, padding: "6px 12px", borderRadius: 20, cursor: "pointer" },
  addBtnDone: { background: "#e2f2e0", color: "#3a7d44", cursor: "default" },
};

/* ============================================================
   6. BELANJA SEHAT
============================================================ */

const CATEGORIES_BELANJA = ["Semua", "Sayur & Buah", "Protein", "Bumbu Dapur", "Lainnya"];
const DEFAULT_ITEMS = [
  { id: 1, nama: "Buah Naga", kategori: "Sayur & Buah", qty: "2 buah", harga: 18000, icon: "🐉", checked: true },
  { id: 2, nama: "Kacang Panjang", kategori: "Sayur & Buah", qty: "250 g", harga: 5000, icon: "🥬", checked: false },
  { id: 3, nama: "Tomat", kategori: "Sayur & Buah", qty: "300 g", harga: 6000, icon: "🍅", checked: false },
  { id: 4, nama: "Ikan Tongkol", kategori: "Protein", qty: "500 g", harga: 25000, icon: "🐟", checked: false },
  { id: 5, nama: "Telur Ayam", kategori: "Protein", qty: "1 kg", harga: 28000, icon: "🥚", checked: true },
  { id: 6, nama: "Tahu Putih", kategori: "Protein", qty: "5 potong", harga: 6000, icon: "🧊", checked: false },
  { id: 7, nama: "Petis Madura", kategori: "Bumbu Dapur", qty: "1 bungkus", harga: 8000, icon: "🫙", checked: false },
  { id: 8, nama: "Kacang Tanah", kategori: "Bumbu Dapur", qty: "250 g", harga: 7000, icon: "🥜", checked: false },
  { id: 9, nama: "Oat Instan", kategori: "Lainnya", qty: "1 pack", harga: 22000, icon: "🥣", checked: false },
];

function BelanjaScreen({ onBack, ping }) {
  const [items, setItems] = usePersistentState("belanja_items", DEFAULT_ITEMS);
  const [category, setCategory] = useState("Semua");
  const [newItem, setNewItem] = useState("");

  const filtered = useMemo(() => items.filter((i) => category === "Semua" || i.kategori === category), [items, category]);
  const totalHarga = useMemo(() => items.reduce((s, i) => s + i.harga, 0), [items]);
  const checkedCount = items.filter((i) => i.checked).length;
  const checkedHarga = items.filter((i) => i.checked).reduce((s, i) => s + i.harga, 0);
  const pct = items.length ? (checkedCount / items.length) * 100 : 0;

  function toggleItem(id) { setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))); }
  function removeItem(id, nama) { setItems((prev) => prev.filter((i) => i.id !== id)); ping(`${nama} dihapus dari daftar`); }
  function addItem() {
    const nama = newItem.trim();
    if (!nama) return;
    setItems((prev) => [{ id: Date.now(), nama, kategori: "Lainnya", qty: "1 item", harga: 0, icon: "🛒", checked: false }, ...prev]);
    setNewItem("");
    ping(`${nama} ditambahkan ke daftar 🛒`);
  }
  function formatRp(n) { return "Rp" + n.toLocaleString("id-ID"); }

  return (
    <>
      <SubHeader title="Belanja Sehat" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={sBelanja.summaryCard}>
          <div style={sBelanja.summaryTop}>
            <div>
              <p style={sBelanja.summaryLabel}>Total Belanja</p>
              <h2 style={sBelanja.summaryNum}>{formatRp(totalHarga)}</h2>
            </div>
            <div style={sBelanja.ringWrap}>
              <svg width="54" height="54" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="6" />
                <circle cx="27" cy="27" r="22" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - pct / 100)} strokeLinecap="round" transform="rotate(-90 27 27)" style={{ transition: "stroke-dashoffset .4s ease" }} />
              </svg>
              <span style={sBelanja.ringText}>{checkedCount}/{items.length}</span>
            </div>
          </div>
          <div style={sBelanja.summaryBottom}><span>Sudah dibeli: <b>{formatRp(checkedHarga)}</b></span></div>
        </div>

        <div style={sBelanja.addRow}>
          <input style={sBelanja.addInput} placeholder="Tambah bahan belanja..." value={newItem}
            onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} />
          <button style={sBelanja.addSubmit} onClick={addItem}>+</button>
        </div>

        <div style={sBelanja.catRow}>
          {CATEGORIES_BELANJA.map((c) => (
            <button key={c} onClick={() => setCategory(c)} style={{ ...sBelanja.catBtn, ...(category === c ? sBelanja.catActive : {}) }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 && <div style={sBelanja.emptyState}><div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div><p style={{ fontSize: 12.5, color: "#8a7b70" }}>Belum ada bahan di kategori ini.</p></div>}

        {filtered.map((i) => (
          <div key={i.id} style={{ ...sBelanja.itemCard, ...(i.checked ? sBelanja.itemCardDone : {}) }}>
            <button onClick={() => toggleItem(i.id)} style={{ ...sBelanja.checkBtn, ...(i.checked ? sBelanja.checkBtnDone : {}) }}>{i.checked ? "✓" : ""}</button>
            <div style={sBelanja.itemIcon}>{i.icon}</div>
            <div style={{ flex: 1 }}>
              <h5 style={{ ...sBelanja.itemName, ...(i.checked ? { textDecoration: "line-through", opacity: 0.5 } : {}) }}>{i.nama}</h5>
              <span style={sBelanja.itemQty}>{i.qty}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={sBelanja.itemHarga}>{i.harga > 0 ? formatRp(i.harga) : "-"}</b>
              <button style={sBelanja.deleteBtn} onClick={() => removeItem(i.id, i.nama)}>🗑</button>
            </div>
          </div>
        ))}

        <div style={sBelanja.tipsCard}>
          <div style={{ fontSize: 22 }}>🧺</div>
          <p style={sBelanja.tipsText}>Utamakan bahan segar khas Madura di pasar terdekat untuk hasil masakan yang lebih sehat.</p>
        </div>
      </div>
    </>
  );
}

const sBelanja = {
  summaryCard: { background: "linear-gradient(135deg, #d81f27, #7a0e13)", borderRadius: 20, padding: 16, color: "#fff", boxShadow: "0 12px 24px rgba(181,18,26,.28)", marginTop: 8 },
  summaryTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 11, opacity: 0.85 },
  summaryNum: { fontSize: 21, fontWeight: 800, marginTop: 2 },
  ringWrap: { position: "relative", width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center" },
  ringText: { position: "absolute", fontSize: 10.5, fontWeight: 700 },
  summaryBottom: { marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.2)", fontSize: 11, opacity: 0.9 },
  addRow: { display: "flex", gap: 8, margin: "12px 0" },
  addInput: { flex: 1, border: "1px solid #f1e8dd", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#2c1810", outline: "none" },
  addSubmit: { width: 40, borderRadius: 12, border: "none", background: "#b5121a", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 10px rgba(181,18,26,.3)" },
  catRow: { display: "flex", gap: 8, paddingBottom: 12, overflowX: "auto" },
  catBtn: { padding: "8px 14px", borderRadius: 20, border: "1px solid #f1e8dd", background: "#fff", color: "#8a7b70", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  catActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a" },
  emptyState: { textAlign: "center", padding: "40px 0" },
  itemCard: { display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: 10, marginBottom: 10, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  itemCardDone: { background: "#f7f5f0" },
  checkBtn: { width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #d8c9b8", background: "#fff", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", flexShrink: 0 },
  checkBtnDone: { background: "#3a7d44", border: "1.5px solid #3a7d44" },
  itemIcon: { width: 36, height: 36, borderRadius: 10, background: "#f7ece0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 },
  itemName: { fontSize: 12.5, fontWeight: 700, color: "#2c1810" },
  itemQty: { fontSize: 10.5, color: "#8a7b70", marginTop: 2, display: "block" },
  itemHarga: { fontSize: 11.5, color: "#b5121a", display: "block" },
  deleteBtn: { border: "none", background: "none", fontSize: 11, cursor: "pointer", marginTop: 4, opacity: 0.55 },
  tipsCard: { marginTop: 8, marginBottom: 20, background: "#f2e6d6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 },
  tipsText: { fontSize: 11.5, color: "#2c1810", lineHeight: 1.5, fontWeight: 500 },
};

/* ============================================================
   7. ARTIKEL & TIPS
============================================================ */

const CATEGORIES_ARTIKEL = ["Semua", "Diet", "Nutrisi", "Olahraga", "Resep Sehat"];
const ARTICLES = [
  { id: 1, kategori: "Diet", judul: "5 Kesalahan Umum Saat Diet yang Bikin Berat Badan Susah Turun", ringkas: "Banyak yang gagal diet bukan karena kurang usaha, tapi karena kesalahan kecil yang berulang.", isi: "Melewatkan sarapan justru membuat tubuh menyimpan lebih banyak lemak karena metabolisme melambat. Kurang minum air putih sering disalahartikan sebagai rasa lapar, padahal tubuh hanya butuh cairan. Terlalu fokus pada angka timbangan tanpa memperhatikan komposisi tubuh juga bisa membuat semangat diet cepat padam. Terakhir, tidur kurang dari 6 jam per hari terbukti meningkatkan hormon rasa lapar (ghrelin) sehingga porsi makan jadi tidak terkontrol.", waktuBaca: "4 menit", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=260&fit=crop" },
  { id: 2, kategori: "Nutrisi", judul: "Kenapa Protein Penting Saat Menurunkan Berat Badan?", ringkas: "Protein bukan cuma buat otot — ini kunci diet yang berhasil dan tidak gampang lapar.", isi: "Protein membutuhkan energi lebih banyak untuk dicerna dibanding karbohidrat atau lemak, sehingga membantu membakar kalori lebih efektif. Selain itu, protein memberikan rasa kenyang lebih lama sehingga mengurangi keinginan ngemil berlebihan. Sumber protein sehat khas Madura seperti ikan tongkol, tahu, dan telur bisa jadi pilihan murah dan mudah didapat sehari-hari.", waktuBaca: "3 menit", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=260&fit=crop" },
  { id: 3, kategori: "Olahraga", judul: "Olahraga 15 Menit di Rumah, Efektifkah untuk Diet?", ringkas: "Tidak perlu ke gym — konsistensi lebih penting daripada durasi olahraga yang lama.", isi: "Latihan interval singkat seperti jalan cepat di tempat, naik-turun tangga, atau squat selama 15 menit terbukti efektif meningkatkan metabolisme selama beberapa jam setelahnya. Kuncinya adalah rutin dilakukan minimal 4-5 kali seminggu, bukan sekali dalam waktu lama namun jarang.", waktuBaca: "3 menit", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=260&fit=crop" },
  { id: 4, kategori: "Resep Sehat", judul: "Rahasia Bumbu Madura yang Tetap Sehat Tanpa Kurangi Rasa", ringkas: "Pak Aji bagi trik supaya masakan khas Madura tetap gurih tapi rendah kalori.", isi: "Gunakan petis secukupnya dan tambahkan perasan jeruk nipis untuk memperkuat rasa tanpa menambah garam berlebih. Ganti santan kental dengan santan encer atau susu rendah lemak untuk masakan berkuah. Rempah seperti kunyit, jahe, dan serai juga menambah cita rasa sekaligus punya manfaat anti-inflamasi alami.", waktuBaca: "5 menit", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=260&fit=crop" },
  { id: 5, kategori: "Nutrisi", judul: "Berapa Banyak Air Putih yang Sebenarnya Kamu Butuhkan?", ringkas: "Patokan '8 gelas sehari' ternyata tidak berlaku sama untuk semua orang.", isi: "Kebutuhan cairan harian sebenarnya bergantung pada berat badan, aktivitas fisik, dan cuaca. Sebagai patokan kasar, kalikan berat badan (kg) dengan 30-35 ml untuk memperkirakan kebutuhan cairan harian dalam mililiter. Minum segelas air putih sebelum makan juga terbukti membantu mengontrol porsi makan.", waktuBaca: "2 menit", img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=260&fit=crop" },
  { id: 6, kategori: "Diet", judul: "Mengenal Defisit Kalori: Dasar dari Semua Metode Diet", ringkas: "Apapun nama dietnya, prinsip dasarnya selalu sama: kalori masuk lebih sedikit dari kalori keluar.", isi: "Defisit kalori sekitar 300-500 kkal per hari dari kebutuhan normal dianggap aman dan berkelanjutan untuk menurunkan berat badan sekitar 0,5 kg per minggu. Defisit yang terlalu besar justru berisiko menurunkan massa otot dan memperlambat metabolisme jangka panjang, jadi lebih baik pelan tapi konsisten.", waktuBaca: "4 menit", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=260&fit=crop" },
];

function ArtikelScreen({ onBack, ping }) {
  const [category, setCategory] = useState("Semua");
  const [openId, setOpenId] = useState(null);
  const [saved, setSaved] = usePersistentState("artikel_saved", {});

  const filtered = useMemo(() => ARTICLES.filter((a) => category === "Semua" || a.kategori === category), [category]);

  function toggleSave(id) { setSaved((s) => { const next = { ...s, [id]: !s[id] }; ping(next[id] ? "Artikel disimpan 🔖" : "Dihapus dari simpanan"); return next; }); }

  return (
    <>
      <SubHeader title="Artikel & Tips" onBack={onBack} />
      <div style={sArtikel.catRow}>
        {CATEGORIES_ARTIKEL.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ ...sArtikel.catBtn, ...(category === c ? sArtikel.catActive : {}) }}>{c}</button>
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={sArtikel.tipsCard}>
          <div style={{ fontSize: 22 }}>💡</div>
          <p style={sArtikel.tipsText}>Minum air putih minimal 8 gelas sehari untuk menjaga metabolisme tubuh.</p>
        </div>
        <p style={sArtikel.resultCount}>{filtered.length} artikel</p>

        {filtered.map((a) => {
          const isOpen = openId === a.id;
          return (
            <div key={a.id} style={sArtikel.articleCard}>
              <button style={sArtikel.articleHeader} onClick={() => setOpenId(isOpen ? null : a.id)}>
                <div style={{ ...sArtikel.thumb, backgroundImage: `url(${a.img})` }} />
                <div style={sArtikel.articleInfo}>
                  <span style={sArtikel.catTag}>{a.kategori}</span>
                  <h5 style={sArtikel.articleTitle}>{a.judul}</h5>
                  <div style={sArtikel.metaRow}>
                    <span>⏱ {a.waktuBaca}</span>
                    <span style={{ marginLeft: "auto", fontSize: 14, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>⌄</span>
                  </div>
                </div>
              </button>
              {!isOpen && <p style={sArtikel.ringkas}>{a.ringkas}</p>}
              {isOpen && (
                <div style={sArtikel.articleBody}>
                  <p style={sArtikel.bodyText}>{a.isi}</p>
                  <button style={sArtikel.saveBtn} onClick={() => toggleSave(a.id)}>{saved[a.id] ? "🔖 Tersimpan" : "📑 Simpan Artikel"}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const sArtikel = {
  catRow: { display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" },
  catBtn: { padding: "8px 14px", borderRadius: 20, border: "1px solid #f1e8dd", background: "#fff", color: "#8a7b70", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  catActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a" },
  tipsCard: { background: "#f2e6d6", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: 4 },
  tipsText: { fontSize: 11.5, color: "#2c1810", lineHeight: 1.5, fontWeight: 500 },
  resultCount: { fontSize: 11, color: "#8a7b70", marginBottom: 10, fontWeight: 500 },
  articleCard: { background: "#fff", borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  articleHeader: { display: "flex", gap: 10, background: "none", border: "none", padding: 0, width: "100%", textAlign: "left", cursor: "pointer" },
  thumb: { width: 76, height: 76, borderRadius: 12, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 },
  articleInfo: { flex: 1, minWidth: 0 },
  catTag: { fontSize: 9.5, fontWeight: 700, color: "#b5121a", background: "#fde3e0", padding: "2px 7px", borderRadius: 8, display: "inline-block" },
  articleTitle: { fontSize: 12.5, fontWeight: 700, color: "#2c1810", marginTop: 5, lineHeight: 1.35 },
  metaRow: { display: "flex", alignItems: "center", fontSize: 10, color: "#8a7b70", marginTop: 6 },
  ringkas: { fontSize: 11, color: "#8a7b70", lineHeight: 1.5, marginTop: 8, paddingLeft: 86 },
  articleBody: { marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1e8dd" },
  bodyText: { fontSize: 12, color: "#2c1810", lineHeight: 1.65 },
  saveBtn: { marginTop: 12, background: "#fde3e0", color: "#b5121a", border: "none", fontSize: 11, fontWeight: 700, padding: "8px 14px", borderRadius: 20, cursor: "pointer" },
};

/* ============================================================
   8. RESEP SEHAT
============================================================ */

const CATEGORIES_RESEP = ["Semua", "Sarapan", "Makan Siang", "Makan Malam", "Camilan", "Sambal"];
const RECIPES = [
  { id: 1, nama: "Soto Ayam Khas Madura", kategori: "Makan Siang", kkal: 310, waktu: "35 menit", porsi: 2, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop",
    bahan: ["300 g dada ayam, rebus & suwir", "1 liter kaldu ayam", "2 batang serai, memarkan", "3 lembar daun jeruk", "2 cm kunyit, bakar sebentar", "3 siung bawang putih", "5 butir bawang merah", "Garam & merica secukupnya", "Tauge, soun, dan seledri untuk pelengkap"],
    langkah: ["Haluskan bawang putih, bawang merah, dan kunyit.", "Tumis bumbu halus bersama serai dan daun jeruk hingga harum.", "Masukkan bumbu tumis ke dalam kaldu ayam, masak dengan api kecil selama 15 menit.", "Tambahkan garam dan merica sesuai selera, koreksi rasa.", "Sajikan kuah panas dengan suwiran ayam, tauge, soun, dan taburan seledri."] },
  { id: 2, nama: "Pecel Madura Sehat", kategori: "Makan Siang", kkal: 420, waktu: "25 menit", porsi: 2, tag: "Tinggi Serat", tagColor: "green", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop",
    bahan: ["1 ikat kangkung, rebus", "100 g tauge, rebus", "1 buah kacang panjang, rebus & potong", "100 g kacang tanah goreng", "2 buah cabai merah (sesuai selera)", "1 siung bawang putih", "1 sdm gula merah", "Garam & air asam jawa secukupnya"],
    langkah: ["Haluskan kacang tanah goreng bersama bawang putih dan cabai.", "Tambahkan gula merah, garam, dan air asam jawa, uleg hingga rata.", "Seduh bumbu kacang dengan sedikit air panas hingga kekentalan pas.", "Tata sayuran rebus di piring, siram dengan sambal pecel.", "Sajikan bersama kerupuk atau rempeyek sebagai pelengkap."] },
  { id: 3, nama: "Ikan Bakar Bumbu Rujak", kategori: "Makan Malam", kkal: 380, waktu: "40 menit", porsi: 2, tag: "Tinggi Protein", tagColor: "red", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=280&fit=crop",
    bahan: ["2 ekor ikan tongkol, bersihkan", "5 buah cabai merah besar", "3 siung bawang merah", "2 siung bawang putih", "2 cm terasi bakar", "1 sdm gula merah", "Air jeruk nipis secukupnya", "Garam secukupnya"],
    langkah: ["Lumuri ikan dengan air jeruk nipis dan garam, diamkan 15 menit.", "Haluskan cabai, bawang merah, bawang putih, dan terasi.", "Tumis bumbu halus dengan sedikit minyak hingga matang, tambahkan gula merah.", "Lumuri ikan dengan setengah bumbu, bakar sambil sesekali diolesi bumbu.", "Bakar hingga matang dan sedikit kecokelatan, sajikan dengan sisa bumbu sebagai olesan."] },
  { id: 4, nama: "Bubur Oat Madura + Buah Naga", kategori: "Sarapan", kkal: 320, waktu: "15 menit", porsi: 1, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=280&fit=crop",
    bahan: ["50 g oat instan", "200 ml susu rendah lemak atau air", "1/2 buah naga, potong dadu", "1 sdt madu (opsional)", "Sejumput kayu manis bubuk"],
    langkah: ["Masak oat dengan susu atau air sambil diaduk hingga mengental.", "Tuang ke mangkuk, biarkan sedikit hangat.", "Tata potongan buah naga di atasnya.", "Tambahkan madu dan taburan kayu manis sebelum disajikan."] },
  { id: 5, nama: "Sup Bening Sayur & Tahu", kategori: "Makan Malam", kkal: 210, waktu: "20 menit", porsi: 2, tag: "Rendah Kalori", tagColor: "red", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=280&fit=crop",
    bahan: ["5 potong tahu putih, potong dadu", "1 buah wortel, iris", "1 ikat sawi hijau", "2 siung bawang putih, cincang", "1 batang daun bawang", "700 ml air", "Garam & merica secukupnya"],
    langkah: ["Tumis bawang putih hingga harum, tuang air, didihkan.", "Masukkan wortel, masak hingga agak empuk.", "Tambahkan tahu, garam, dan merica, masak 5 menit.", "Masukkan sawi hijau dan daun bawang, masak sebentar hingga layu.", "Angkat dan sajikan selagi hangat."] },
  { id: 6, nama: "Segenggam Kacang Almond Panggang", kategori: "Camilan", kkal: 120, waktu: "10 menit", porsi: 1, tag: "Mengenyangkan", tagColor: "green", img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=280&fit=crop",
    bahan: ["30 g kacang almond mentah", "Sejumput garam laut (opsional)"],
    langkah: ["Panaskan wajan anti lengket tanpa minyak.", "Sangrai kacang almond dengan api kecil sambil terus diaduk.", "Angkat setelah harum dan sedikit kecokelatan, taburi garam laut tipis.", "Dinginkan sebelum disimpan dalam wadah kedap udara."] },
  { id: 7, nama: "Sambal Kecap", kategori: "Sambal", kkal: 90, waktu: "10 menit", porsi: 4, tag: "Cocolan Pedas", tagColor: "red", img: "sambal/sambal-kecap.jpg",
    bahan: ["5 sdm kecap manis", "5-7 buah cabai rawit, iris tipis (sesuai selera)", "2 siung bawang merah, iris tipis", "1 siung bawang putih, iris halus (opsional)", "1 buah tomat kecil, potong dadu", "1 sdt air jeruk limau atau jeruk nipis", "Sejumput garam (opsional)"],
    langkah: ["Siapkan mangkuk kecil, masukkan kecap manis sebagai bahan utama.", "Tambahkan cabai rawit, bawang merah, dan bawang putih.", "Masukkan potongan tomat.", "Beri perasan jeruk limau agar lebih segar.", "Aduk rata, koreksi rasa, sambal kecap siap disajikan."] },
  { id: 8, nama: "Sambal Rampai Pedas Asem Seger", kategori: "Sambal", kkal: 25, waktu: "15 menit", porsi: 3, tag: "Segar & Asam", tagColor: "green", img: "sambal/sambal-rampai.jpg",
    bahan: ["20 buah cabai rawit merah kecil", "1 sdt terasi bakar", "6-8 buah tomat rampai", "Garam, gula, micin secukupnya", "Perasan jeruk nipis secukupnya"],
    langkah: ["Ulek cabai mentah, lalu tambahkan terasi, garam, gula, dan micin, ulek kasar.", "Tambahkan tomat rampai 6-8 buah, ulek kasar saja.", "Kalau mau lebih asam dan becek, tambahkan lagi tomat rampai, cicipi sampai sesuai selera.", "Tambahkan perasan jeruk nipis untuk rasa yang lebih segar."] },
  { id: 9, nama: "Sambal Matah Segar Pedas", kategori: "Sambal", kkal: 110, waktu: "20 menit", porsi: 4, tag: "Pedas Wangi", tagColor: "red", img: "sambal/sambal-matah.jpg",
    bahan: ["10 butir bawang merah, iris tipis", "5 siung bawang putih, iris tipis", "10 buah cabai rawit merah (sesuai selera pedas)", "3 batang serai, ambil bagian putih, iris halus", "5 lembar daun jeruk, buang tulang daun, iris tipis", "1/2 sdt garam", "1/2 sdt gula pasir", "1 buah jeruk limau", "100 ml minyak goreng panas"],
    langkah: ["Iris tipis bawang merah, bawang putih, serai, cabai, dan daun jeruk.", "Campur semua bahan iris ke dalam wadah, tambahkan garam, gula, dan air jeruk limau.", "Panaskan minyak goreng hingga benar-benar panas, tuang sedikit demi sedikit ke campuran bahan — ini yang bikin aroma khasnya keluar.", "Aduk rata semua bahan, koreksi rasa. Tambah irisan cabai kalau ingin lebih pedas.", "Sambal matah siap disajikan bersama nasi hangat, ayam goreng, ikan bakar, atau tempe goreng."] },
  { id: 10, nama: "Sambal Ijo Padang", kategori: "Sambal", kkal: 40, waktu: "25 menit", porsi: 4, tag: "Khas Padang", tagColor: "green", img: "sambal/sambal-ijo.jpg",
    bahan: ["15 buah cabai keriting hijau", "15 buah cabai rawit hijau", "3 siung bawang merah", "2 siung bawang putih", "1 buah tomat hijau ukuran sedang", "2 lembar daun salam", "3 lembar daun jeruk", "1 batang serai"],
    langkah: ["Bersihkan semua bahan.", "Didihkan air, rebus sebentar cabai, bawang, dan tomat, angkat lalu ulek kasar.", "Tumis bahan yang sudah diulek, tambahkan daun jeruk, daun salam, dan serai.", "Bumbui dengan garam dan penyedap, koreksi rasa.", "Angkat dan siap dihidangkan."] },
  { id: 11, nama: "Sambal Bawang", kategori: "Sambal", kkal: 60, waktu: "20 menit", porsi: 5, tag: "Awet & Tahan Lama", tagColor: "red", img: "sambal/sambal-bawang.jpg",
    bahan: ["100 g bawang merah", "100 g bawang putih", "250 g cabai rawit merah (sesuaikan selera)", "1 sdt garam", "1/2 sdt kaldu jamur", "1 sdm gula"],
    langkah: ["Kukus semua cabai dan bawang sampai empuk.", "Ulek kasar sampai pecah saja.", "Tambahkan garam, gula, dan kaldu bubuk.", "Tumis di minyak panas untuk sambal yang awet dan tahan lama — atau cukup siram minyak panas saja kalau untuk sekali makan (tanpa ditumis)."] },
  { id: 12, nama: "Sambal Terasi", kategori: "Sambal", kkal: 50, waktu: "25 menit", porsi: 5, tag: "Klasik Gurih", tagColor: "green", img: "sambal/sambal-terasi.jpg",
    bahan: ["20 buah cabai merah keriting", "20 buah cabai rawit", "6 siung bawang merah", "4 siung bawang putih", "1 buah terasi, digoreng", "6 buah tomat kecil", "1 buah gula merah", "1 sdt gula putih", "1 sdm peres garam"],
    langkah: ["Goreng cabai merah, cabai rawit, bawang merah, dan bawang putih sampai agak layu.", "Angkat, lalu ulek bersama gula, garam, dan terasi goreng.", "Goreng tomat sampai layu dengan api kecil (jangan sampai gosong karena memengaruhi rasa).", "Tambahkan tomat goreng ke dalam ulekan, ulek lagi tapi jangan terlalu halus.", "Sambal siap dihidangkan."] },
  { id: 13, nama: "Sambal Pecak", kategori: "Sambal", kkal: 35, waktu: "15 menit", porsi: 3, tag: "Sederhana", tagColor: "green", img: "sambal/sambal-pecak.jpg",
    bahan: ["Cabai merah secukupnya", "Cabai hijau secukupnya", "2 buah tomat", "Bawang merah secukupnya", "Bawang putih secukupnya", "Gula, garam, dan micin secukupnya"],
    langkah: ["Ulek cabai merah dan cabai hijau, tambahkan gula, garam, dan micin.", "Potong tomat, ulek bersama cabai.", "Potong dan goreng bawang, masukkan ke sambal, ulek sebentar.", "Sambal pecak siap disantap."] },
];


function ResepScreen({ onBack, ping }) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [openRecipe, setOpenRecipe] = useState(null);
  const [saved, setSaved] = usePersistentState("resep_saved", {});
  const [servingsOverride, setServingsOverride] = usePersistentState("resep_servings", {});

  const filtered = useMemo(() => RECIPES.filter((r) => {
    const matchCat = category === "Semua" || r.kategori === category;
    const matchQuery = r.nama.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  }), [category, query]);

  function toggleSave(id, nama) { setSaved((s) => { const next = { ...s, [id]: !s[id] }; ping(next[id] ? `${nama} disimpan 🔖` : "Dihapus dari simpanan"); return next; }); }
  function getServings(r) { return servingsOverride[r.id] ?? r.porsi; }
  function changeServings(r, delta) {
    setServingsOverride((s) => { const current = s[r.id] ?? r.porsi; return { ...s, [r.id]: Math.max(1, Math.min(8, current + delta)) }; });
  }

  if (openRecipe) {
    return (
      <div style={{ padding: 0 }}>
        <div style={{ ...sResep.detailHero, backgroundImage: `url(${openRecipe.img})` }}>
          <button style={sResep.floatBack} onClick={() => setOpenRecipe(null)}>‹</button>
          <button style={sResep.floatSave} onClick={() => toggleSave(openRecipe.id, openRecipe.nama)}>{saved[openRecipe.id] ? "🔖" : "📑"}</button>
        </div>
        <div style={sResep.detailBody}>
          <span style={{ ...sResep.tag, background: openRecipe.tagColor === "red" ? "#fde3e0" : "#e2f2e0", color: openRecipe.tagColor === "red" ? "#d81f27" : "#3a7d44" }}>{openRecipe.tag}</span>
          <h2 style={sResep.detailTitle}>{openRecipe.nama}</h2>
          <div style={sResep.statRow}>
            <div style={sResep.statItem}><b style={sResep.statVal}>{openRecipe.kkal}</b><span style={sResep.statLabel}>kkal</span></div>
            <div style={sResep.statItem}><b style={sResep.statVal}>{openRecipe.waktu}</b><span style={sResep.statLabel}>waktu</span></div>
            <div style={sResep.statItem}>
              <div style={sResep.servingCtrl}>
                <button style={sResep.servingBtn} onClick={() => changeServings(openRecipe, -1)}>−</button>
                <b style={sResep.statVal}>{getServings(openRecipe)}</b>
                <button style={sResep.servingBtn} onClick={() => changeServings(openRecipe, 1)}>+</button>
              </div>
              <span style={sResep.statLabel}>porsi</span>
            </div>
          </div>
          <h3 style={sResep.sectionTitle}>Bahan-bahan</h3>
          <ul style={sResep.ingList}>{openRecipe.bahan.map((b, i) => <li key={i} style={sResep.ingItem}><span style={sResep.ingDot} />{b}</li>)}</ul>
          <h3 style={sResep.sectionTitle}>Cara Membuat</h3>
          <ol style={sResep.stepList}>{openRecipe.langkah.map((s, i) => <li key={i} style={sResep.stepItem}><span style={sResep.stepNum}>{i + 1}</span><span style={sResep.stepText}>{s}</span></li>)}</ol>
          <button style={sResep.jadwalBtn} onClick={() => ping(`${openRecipe.nama} ditambahkan ke Jadwal Diet ✅`)}>+ Tambah ke Jadwal Diet</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubHeader title="Resep Sehat" onBack={onBack} />
      <div style={sResep.searchWrap}>
        <span style={{ fontSize: 13 }}>🔍</span>
        <input style={sResep.searchInput} placeholder="Cari resep..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div style={sResep.catRow}>
        {CATEGORIES_RESEP.map((c) => (
          <button key={c} onClick={() => setCategory(c)} style={{ ...sResep.catBtn, ...(category === c ? sResep.catActive : {}) }}>{c}</button>
        ))}
      </div>
      <div style={{ padding: "0 20px" }}>
        <p style={sResep.resultCount}>{filtered.length} resep ditemukan</p>
        <div style={sResep.grid}>
          {filtered.map((r) => (
            <button key={r.id} style={sResep.card} onClick={() => setOpenRecipe(r)}>
              <div style={{ ...sResep.cardThumb, backgroundImage: `url(${r.img})` }}>
                <span style={{ ...sResep.tag, background: r.tagColor === "red" ? "#fde3e0" : "#e2f2e0", color: r.tagColor === "red" ? "#d81f27" : "#3a7d44" }}>{r.tag}</span>
                <span style={sResep.bookmarkDot}>{saved[r.id] ? "🔖" : ""}</span>
              </div>
              <div style={sResep.cardBody}>
                <h5 style={sResep.cardName}>{r.nama}</h5>
                <div style={sResep.cardMeta}><span>🔥 {r.kkal} kkal</span><span>⏱ {r.waktu}</span></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const sResep = {
  searchWrap: { margin: "0 20px 12px", background: "#fff", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #f1e8dd" },
  searchInput: { border: "none", outline: "none", flex: 1, fontSize: 12.5, fontFamily: "'Poppins', sans-serif", background: "transparent", color: "#2c1810" },
  catRow: { display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" },
  catBtn: { padding: "8px 14px", borderRadius: 20, border: "1px solid #f1e8dd", background: "#fff", color: "#8a7b70", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" },
  catActive: { background: "#b5121a", color: "#fff", border: "1px solid #b5121a" },
  resultCount: { fontSize: 11, color: "#8a7b70", marginBottom: 10, fontWeight: 500 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)", padding: 0, cursor: "pointer", textAlign: "left" },
  cardThumb: { height: 90, backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 6 },
  tag: { fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 7 },
  bookmarkDot: { fontSize: 13 },
  cardBody: { padding: 10 },
  cardName: { fontSize: 12, fontWeight: 700, color: "#2c1810", lineHeight: 1.3, minHeight: 30 },
  cardMeta: { display: "flex", gap: 8, fontSize: 9.5, color: "#8a7b70", marginTop: 6, flexWrap: "wrap" },
  detailHero: { height: 240, backgroundSize: "cover", backgroundPosition: "center", position: "relative" },
  floatBack: { position: "absolute", top: 16, left: 18, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 20, color: "#2c1810", cursor: "pointer" },
  floatSave: { position: "absolute", top: 16, right: 18, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.9)", border: "none", fontSize: 15, cursor: "pointer" },
  detailBody: { padding: "18px 22px 30px", marginTop: -18, background: "#fdf6ee", borderRadius: "18px 18px 0 0", position: "relative" },
  detailTitle: { fontSize: 18, fontWeight: 800, color: "#2c1810", marginTop: 8, lineHeight: 1.3 },
  statRow: { display: "flex", justifyContent: "space-around", background: "#fff", borderRadius: 14, padding: "12px 8px", marginTop: 14, border: "1px solid #f1e8dd" },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  statVal: { fontSize: 14, color: "#2c1810" },
  statLabel: { fontSize: 9.5, color: "#8a7b70" },
  servingCtrl: { display: "flex", alignItems: "center", gap: 8 },
  servingBtn: { width: 20, height: 20, borderRadius: "50%", border: "1px solid #f1e8dd", background: "#fdf6ee", fontSize: 12, fontWeight: 700, color: "#b5121a", cursor: "pointer" },
  sectionTitle: { fontSize: 14.5, fontWeight: 700, color: "#2c1810", marginTop: 20, marginBottom: 10 },
  ingList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 },
  ingItem: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "#2c1810", lineHeight: 1.4 },
  ingDot: { width: 5, height: 5, borderRadius: "50%", background: "#b5121a", marginTop: 6, flexShrink: 0 },
  stepList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 },
  stepItem: { display: "flex", alignItems: "flex-start", gap: 10 },
  stepNum: { width: 22, height: 22, borderRadius: "50%", background: "#fde3e0", color: "#b5121a", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepText: { fontSize: 12.5, color: "#2c1810", lineHeight: 1.5, marginTop: 2 },
  jadwalBtn: { marginTop: 22, width: "100%", background: "#b5121a", color: "#fff", border: "none", padding: 14, borderRadius: 16, fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 18px rgba(181,18,26,.3)" },
};

/* ============================================================
   9. PROFIL
============================================================ */

const MENU_ITEMS_PROFIL = [
  { icon: "📋", label: "Data Diri" },
  { icon: "📈", label: "Riwayat Berat Badan" },
  { icon: "🔔", label: "Notifikasi" },
  { icon: "🌐", label: "Bahasa" },
  { icon: "❓", label: "Bantuan & FAQ" },
  { icon: "ℹ️", label: "Tentang Aplikasi" },
];

function ProfilScreen({ onBack, ping, auth, uid }) {
  const [nama, setNama] = usePersistentState("profil_nama", auth?.user?.displayName || "Sahabat Sehat");
  const [editing, setEditing] = useState(false);
  const [tempNama, setTempNama] = useState(nama);
  const [beratAwal] = usePersistentState("profil_beratAwal", 78);
  const [beratSekarang, setBeratSekarang] = usePersistentState("profil_beratSekarang", 72);
  const [targetBerat] = usePersistentState("profil_targetBerat", 65);
  const [streak] = useState(12);
  const [premium, setPremium] = usePersistentState("profil_premium", false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function saveNama() { setNama(tempNama.trim() || nama); setEditing(false); ping("Nama berhasil diperbarui ✅"); }
  function adjustBerat(delta) { setBeratSekarang((b) => Math.max(30, Math.min(200, b + delta))); }
  const progress = Math.min(100, Math.max(0, ((beratAwal - beratSekarang) / (beratAwal - targetBerat)) * 100));

  return (
    <>
      <SubHeader title="Profil" onBack={onBack} />
      <div style={{ padding: "0 22px" }}>
        <div style={sProfil.avatarBlock}>
          <div style={sProfil.avatarWrap}>
            <div style={sProfil.avatar}>🧕</div>
            <button style={sProfil.avatarEdit} onClick={() => ping("Ganti foto profil segera hadir 📷")}>✎</button>
          </div>
          {!editing ? (
            <div style={sProfil.nameRow}>
              <h3 style={sProfil.nameText}>{nama}</h3>
              <button style={sProfil.editIcon} onClick={() => { setTempNama(nama); setEditing(true); }}>✎</button>
            </div>
          ) : (
            <div style={sProfil.editRow}>
              <input style={sProfil.nameInput} value={tempNama} onChange={(e) => setTempNama(e.target.value)} autoFocus />
              <button style={sProfil.saveIcon} onClick={saveNama}>✓</button>
            </div>
          )}
          <span style={sProfil.memberBadge}>{premium ? "👑 Premium Member" : "Free Member"}</span>
          <span style={sProfil.accountNote}>
            {!auth?.isOnline
              ? "💾 Tersimpan di perangkat ini"
              : auth?.user?.isAnonymous
              ? "👤 Akun Tamu — data tersinkron di cloud"
              : `✉️ ${auth?.user?.email || ""}`}
          </span>
        </div>

        <div style={sProfil.progressCard}>
          <div style={sProfil.progressTop}>
            <div style={sProfil.progressCol}><span style={sProfil.progressLabel}>Berat Awal</span><b style={sProfil.progressVal}>{beratAwal} kg</b></div>
            <div style={sProfil.progressCol}>
              <span style={sProfil.progressLabel}>Sekarang</span>
              <div style={sProfil.beratNowRow}>
                <button style={sProfil.beratBtn} onClick={() => adjustBerat(-0.5)}>−</button>
                <b style={{ ...sProfil.progressVal, color: "#fff" }}>{beratSekarang} kg</b>
                <button style={sProfil.beratBtn} onClick={() => adjustBerat(0.5)}>+</button>
              </div>
            </div>
            <div style={sProfil.progressCol}><span style={sProfil.progressLabel}>Target</span><b style={sProfil.progressVal}>{targetBerat} kg</b></div>
          </div>
          <div style={sProfil.progressBarBg}><div style={{ ...sProfil.progressBarFill, width: `${progress}%` }} /></div>
          <p style={sProfil.progressNote}>{Math.round(progress)}% menuju target beratmu 🎯</p>
        </div>

        <div style={sProfil.statsRow}>
          <div style={sProfil.statCard}><div style={{ fontSize: 20 }}>🔥</div><b style={sProfil.statVal}>{streak} hari</b><span style={sProfil.statLabel}>Streak Diet</span></div>
          <div style={sProfil.statCard}><div style={{ fontSize: 20 }}>⚖️</div><b style={sProfil.statVal}>{(beratAwal - beratSekarang).toFixed(1)} kg</b><span style={sProfil.statLabel}>Sudah Turun</span></div>
        </div>

        {!premium && (
          <button style={sProfil.upgradeBanner} onClick={() => { setPremium(true); ping("Selamat! Kamu sekarang Premium 🎉"); }}>
            <div style={{ flex: 1, textAlign: "left" }}>
              <h4 style={sProfil.bannerTitle}>Upgrade ke Premium</h4>
              <p style={sProfil.bannerDesc}>Akses semua resep, menu diet eksklusif, dan fitur lengkap!</p>
            </div>
            <div style={sProfil.bowl}>👑</div>
          </button>
        )}

        <div style={sProfil.menuList}>
          {MENU_ITEMS_PROFIL.map((m) => (
            <button key={m.label} style={sProfil.menuRow} onClick={() => ping(`Membuka ${m.label}...`)}>
              <span style={sProfil.menuIcon}>{m.icon}</span>
              <span style={sProfil.menuLabel}>{m.label}</span>
              <span style={sProfil.menuArrow}>›</span>
            </button>
          ))}
          <button style={sProfil.menuRow} onClick={() => setConfirmReset(true)}>
            <span style={sProfil.menuIcon}>🗑️</span>
            <span style={{ ...sProfil.menuLabel, color: "#d89b1f" }}>Reset Semua Data</span>
            <span style={sProfil.menuArrow}>›</span>
          </button>
          <button style={{ ...sProfil.menuRow, borderBottom: "none" }} onClick={() => setConfirmLogout(true)}>
            <span style={sProfil.menuIcon}>🚪</span>
            <span style={{ ...sProfil.menuLabel, color: "#d81f27" }}>Keluar</span>
            <span style={{ ...sProfil.menuArrow, opacity: 0 }}>›</span>
          </button>
        </div>
        <p style={sProfil.versionText}>Sehat Bersama Pak Aji · v1.0.0</p>
        <p style={sProfil.storageNote}>💾 Data tersimpan otomatis di perangkat ini</p>
      </div>

      {confirmReset && (
        <div style={sProfil.modalOverlay}>
          <div style={sProfil.modalCard}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🗑️</div>
            <h4 style={sProfil.modalTitle}>Reset semua data?</h4>
            <p style={sProfil.modalDesc}>Jadwal diet, belanja, resep tersimpan, dan profil akan dikembalikan ke awal. Tindakan ini tidak bisa dibatalkan.</p>
            <div style={sProfil.modalActions}>
              <button style={sProfil.modalCancel} onClick={() => setConfirmReset(false)}>Batal</button>
              <button
                style={sProfil.modalConfirm}
                onClick={() => {
                  clearAllPersistedData(uid);
                  setConfirmReset(false);
                  ping("Semua data direset — memuat ulang... 🔄");
                  setTimeout(() => window.location.reload(), 900);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmLogout && (
        <div style={sProfil.modalOverlay}>
          <div style={sProfil.modalCard}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🚪</div>
            <h4 style={sProfil.modalTitle}>Keluar dari akun?</h4>
            <p style={sProfil.modalDesc}>Kamu perlu login kembali untuk mengakses data dietmu.</p>
            <div style={sProfil.modalActions}>
              <button style={sProfil.modalCancel} onClick={() => setConfirmLogout(false)}>Batal</button>
              <button
                style={sProfil.modalConfirm}
                onClick={async () => {
                  setConfirmLogout(false);
                  if (auth?.isOnline) {
                    try { await auth.logout(); } catch {}
                  }
                  ping("Berhasil keluar 👋");
                }}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const sProfil = {
  avatarBlock: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 6, marginBottom: 18 },
  avatarWrap: { position: "relative" },
  avatar: { width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(135deg,#f7ece0,#f2e6d6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, border: "3px solid #fff", boxShadow: "0 8px 20px rgba(0,0,0,.1)" },
  avatarEdit: { position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#b5121a", color: "#fff", border: "2px solid #fdf6ee", fontSize: 11, cursor: "pointer" },
  nameRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 12 },
  nameText: { fontSize: 17, fontWeight: 700, color: "#2c1810" },
  editIcon: { border: "none", background: "none", fontSize: 12, color: "#8a7b70", cursor: "pointer" },
  editRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 12 },
  nameInput: { fontSize: 14, fontWeight: 600, padding: "6px 12px", borderRadius: 10, border: "1px solid #d81f27", outline: "none", fontFamily: "'Poppins', sans-serif", color: "#2c1810", textAlign: "center" },
  saveIcon: { width: 26, height: 26, borderRadius: "50%", background: "#3a7d44", color: "#fff", border: "none", fontSize: 12, cursor: "pointer" },
  memberBadge: { marginTop: 8, fontSize: 11, fontWeight: 700, color: "#b5121a", background: "#fde3e0", padding: "4px 12px", borderRadius: 20 },
  accountNote: { marginTop: 8, fontSize: 10, color: "#8a7b70" },
  progressCard: { background: "linear-gradient(135deg, #d81f27, #7a0e13)", borderRadius: 20, padding: 18, color: "#fff", boxShadow: "0 12px 24px rgba(181,18,26,.28)" },
  progressTop: { display: "flex", justifyContent: "space-between" },
  progressCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 },
  progressLabel: { fontSize: 10, opacity: 0.8 },
  progressVal: { fontSize: 14, opacity: 0.9 },
  beratNowRow: { display: "flex", alignItems: "center", gap: 6 },
  beratBtn: { width: 20, height: 20, borderRadius: "50%", border: "1px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  progressBarBg: { height: 6, background: "rgba(255,255,255,.25)", borderRadius: 5, marginTop: 16, overflow: "hidden" },
  progressBarFill: { height: "100%", background: "#fff", borderRadius: 5, transition: "width .4s ease" },
  progressNote: { fontSize: 11, opacity: 0.9, marginTop: 8, textAlign: "center" },
  statsRow: { display: "flex", gap: 10, marginTop: 12 },
  statCard: { flex: 1, background: "#fff", borderRadius: 14, padding: "14px 8px", textAlign: "center", border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)" },
  statVal: { fontSize: 14, color: "#2c1810", display: "block", marginTop: 4 },
  statLabel: { fontSize: 10, color: "#8a7b70" },
  upgradeBanner: { marginTop: 16, width: "100%", background: "linear-gradient(120deg, #b5121a, #7a0e13)", borderRadius: 18, padding: 16, display: "flex", alignItems: "center", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 10px 20px rgba(181,18,26,.22)" },
  bannerTitle: { fontSize: 13.5, fontWeight: 700, marginBottom: 4 },
  bannerDesc: { fontSize: 10.5, opacity: 0.9, lineHeight: 1.4 },
  bowl: { width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginLeft: 8, flexShrink: 0 },
  menuList: { marginTop: 18, background: "#fff", borderRadius: 16, border: "1px solid #f1e8dd", boxShadow: "0 4px 10px rgba(0,0,0,.04)", overflow: "hidden" },
  menuRow: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "none", border: "none", borderBottom: "1px solid #f7f2ea", cursor: "pointer", textAlign: "left" },
  menuIcon: { fontSize: 16, width: 20, textAlign: "center" },
  menuLabel: { fontSize: 12.5, fontWeight: 600, color: "#2c1810", flex: 1 },
  menuArrow: { fontSize: 15, color: "#c9bba8" },
  versionText: { textAlign: "center", fontSize: 10, color: "#b3a795", marginTop: 18 },
  storageNote: { textAlign: "center", fontSize: 9.5, color: "#b3a795", margin: "4px 0 18px" },
  modalOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 40 },
  modalCard: { background: "#fff", borderRadius: 20, padding: "24px 20px", textAlign: "center", width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,.2)" },
  modalTitle: { fontSize: 15, fontWeight: 700, color: "#2c1810" },
  modalDesc: { fontSize: 11.5, color: "#8a7b70", marginTop: 6, lineHeight: 1.5 },
  modalActions: { display: "flex", gap: 10, marginTop: 18 },
  modalCancel: { flex: 1, padding: 11, borderRadius: 12, border: "1px solid #f1e8dd", background: "#fdf6ee", color: "#2c1810", fontWeight: 700, fontSize: 12.5, cursor: "pointer" },
  modalConfirm: { flex: 1, padding: 11, borderRadius: 12, border: "none", background: "#d81f27", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" },
};

/* ============================================================
   MAIN APP — routing + shell
============================================================ */

const TAB_SCREENS = ["beranda", "resep", "profil"];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  .scrollarea::-webkit-scrollbar { display: none; }
  @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
  @keyframes screenIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
`;

function PhoneShell({ children, background }) {
  return (
    <div style={shared.page}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ ...shared.phone, background: background || "#fdf6ee" }}>{children}</div>
    </div>
  );
}

function AppShell({ auth, uid }) {
  const [hasOnboarded, setHasOnboarded] = usePersistentState("hasOnboarded", false);
  const [screen, setScreen] = useState(hasOnboarded ? "beranda" : "onboarding");
  const [toast, setToast] = useState("");

  function ping(msg) { setToast(msg); setTimeout(() => setToast(""), 1800); }
  function navigate(target) {
    if (target === "notif") { ping("Belum ada notifikasi baru 🔔"); return; }
    setScreen(target);
  }
  function finishOnboarding() {
    setHasOnboarded(true);
    ping("Selamat datang! 🎉");
    setScreen("beranda");
  }

  const isOnboarding = screen === "onboarding";
  const showBottomNav = TAB_SCREENS.includes(screen);

  return (
    <PhoneShell background={isOnboarding ? "linear-gradient(180deg, #f2ece2 0%, #f2ece2 38%, #b5121a 78%, #7a0e13 100%)" : "#fdf6ee"}>
      <StatusBar />

      <div key={screen} className="scrollarea" style={{ ...shared.scroll, animation: "screenIn .25s ease" }}>
        {screen === "onboarding" && <OnboardingScreen onFinish={finishOnboarding} />}
        {screen === "beranda" && <BerandaScreen onNavigate={navigate} ping={ping} />}
        {screen === "kalkulator" && <KalkulatorScreen onBack={() => navigate("beranda")} />}
        {screen === "jadwal" && <JadwalScreen onBack={() => navigate("beranda")} ping={ping} />}
        {screen === "menu" && <MenuScreen onBack={() => navigate("beranda")} ping={ping} />}
        {screen === "belanja" && <BelanjaScreen onBack={() => navigate("beranda")} ping={ping} />}
        {screen === "artikel" && <ArtikelScreen onBack={() => navigate("beranda")} ping={ping} />}
        {screen === "resep" && <ResepScreen onBack={() => navigate("beranda")} ping={ping} />}
        {screen === "profil" && <ProfilScreen onBack={() => navigate("beranda")} ping={ping} auth={auth} uid={uid} />}
      </div>

      {showBottomNav && <BottomNav active={screen} onNavigate={navigate} />}
      {toast && <div style={shared.toast}>{toast}</div>}
    </PhoneShell>
  );
}

/**
 * Root — decides what to show before the app itself mounts:
 *  1. Firebase not configured yet  → skip login entirely, run local-only
 *     (exactly like before; nothing breaks while you set up Firebase).
 *  2. Checking auth state          → tiny loading splash.
 *  3. Not logged in                → AuthScreen (login / register / guest).
 *  4. Logged in                    → the real app, data synced to that uid.
 */
export default function PakAjiRoot() {
  const auth = useAuth();
  const [toast, setToast] = useState("");
  function ping(msg) { setToast(msg); setTimeout(() => setToast(""), 1800); }

  if (!auth.isOnline) {
    return (
      <PersistProvider uid={null}>
        <AppShell auth={auth} uid={null} />
      </PersistProvider>
    );
  }

  if (auth.loading) {
    return (
      <PhoneShell>
        <StatusBar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ fontSize: 34 }}>🍲</div>
          <p style={{ fontSize: 12, color: "#8a7b70", fontWeight: 600 }}>Memuat...</p>
        </div>
      </PhoneShell>
    );
  }

  if (!auth.user) {
    return (
      <PhoneShell>
        <StatusBar />
        <div className="scrollarea" style={{ ...shared.scroll }}>
          <AuthScreen auth={auth} ping={ping} />
        </div>
        {toast && <div style={shared.toast}>{toast}</div>}
      </PhoneShell>
    );
  }

  return (
    <PersistProvider uid={auth.user.uid}>
      <AppShell auth={auth} uid={auth.user.uid} />
    </PersistProvider>
  );
}

const shared = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#e7e2da", fontFamily: "'Poppins', sans-serif", padding: 24 },
  phone: { width: 375, height: 812, borderRadius: 44, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px rgba(0,0,0,.25), 0 0 0 10px #111", display: "flex", flexDirection: "column" },
  statusbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 26px 4px", fontSize: 15, fontWeight: 700, color: "#2c1810", position: "relative", zIndex: 20, flexShrink: 0 },
  scroll: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px 8px", flexShrink: 0 },
  backBtn: { width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "1px solid #f1e8dd", fontSize: 20, color: "#2c1810", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,.05)" },
  headerTitle: { fontSize: 16, fontWeight: 700, color: "#2c1810" },
  bottomnav: { flexShrink: 0, background: "#fff", borderTop: "1px solid #f1e8dd", display: "flex", justifyContent: "space-around", padding: "10px 0 22px", position: "relative", zIndex: 30 },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" },
  navItemCenter: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: -26, background: "none", border: "none", cursor: "pointer" },
  navLabel: { fontSize: 9.5 },
  dotActive: { width: 44, height: 44, borderRadius: "50%", background: "#b5121a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 17, boxShadow: "0 8px 16px rgba(181,18,26,.35)" },
  toast: { position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,.8)", color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "10px 18px", borderRadius: 20, zIndex: 70, whiteSpace: "nowrap", animation: "toastIn .25s ease" },
};
