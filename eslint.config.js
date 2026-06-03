import { useState, useEffect, useCallback } from "react";

// ============================================================
//  ARCHITEKTONIK — Vollständige Plattform mit Backend-Datenschicht
//  Zweistufiges Verfahren: Bewerbung → Dossier-Freigabe → Angebot → Vergabe
// ============================================================

const CHF = (n) =>
  new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(n || 0);
const DATUM = (d) => (d ? new Date(d).toLocaleDateString("de-CH", { day: "2-digit", month: "short", year: "numeric" }) : "—");

const T = {
  ink: "#1a1814", paper: "#f4f1ea", paper2: "#ebe6dc", card: "#fbfaf6",
  line: "#d8d1c4", gold: "#9a7b4f", goldSoft: "#c4a87a",
  green: "#3d5a4c", red: "#8a3b34", blue: "#3a4d63", muted: "#6f6a60",
};
const serif = `"Cormorant Garamond", "Times New Roman", serif`;
const sans = `"Jost", "Helvetica Neue", system-ui, sans-serif`;

// ============================================================
//  DATENSCHICHT  (Browser-localStorage, mit Seed-Daten)
//  Spiegelt das echte Backend-Schema (siehe backend-spec.md)
// ============================================================
const KEY = "architektonik:db:v1";

const SEED_DB = {
  organisationen: [
    { id: "o1", rolle: "architekt", name: "Vogt & Brunner Architekten", typ: "Architekturbüro", ort: "Zürich", kanton: "ZH", gegruendet: 1998, mitarbeiter: 34, tagline: "Reduktion als Haltung. Material als Sprache.", farbe: "#3d5a4c", verifiziert: true, bewertung: 4.9, zuschlaege: 23, plan: "arch_atelier" },
    { id: "o2", rolle: "architekt", name: "Studio Lac Léman", typ: "Architekturbüro", ort: "Lausanne", kanton: "VD", gegruendet: 2011, mitarbeiter: 18, tagline: "Lumière, pierre, et le lac comme horizon.", farbe: "#9a7b4f", verifiziert: true, bewertung: 4.7, zuschlaege: 14, plan: "arch_einzel" },
    { id: "o3", rolle: "architekt", name: "Helvetia Immobilien Partner", typ: "Entwickler", ort: "Bern", kanton: "BE", gegruendet: 2005, mitarbeiter: 52, tagline: "Vom Grundstück zur Rendite — alles aus einer Hand.", farbe: "#8a3b34", verifiziert: true, bewertung: 4.6, zuschlaege: 31, plan: "arch_maison" },
    { id: "inv1", rolle: "investor", name: "Bauherrschaft Zollikon", typ: "Privater Bauherr", ort: "Zollikon", kanton: "ZH", verifiziert: true, plan: "inv_bauherr" },
  ],
  projekte: [
    {
      id: "p1", investor_id: "inv1", status: "bewertung",
      titel: "Neubau Mehrfamilienhaus am Hang", art: "Architekturwettbewerb",
      beschreibung: "Mehrfamilienhaus mit Eigentumswohnungen in Hanglage mit Seesicht. Hohe Anforderungen an Energiestandard und Materialisierung.",
      adresse: "Bergstrasse 14", plz: "8702", ort: "Zollikon", kanton: "ZH",
      parzelle_nr: "ZK-1842", grundstueck_m2: 1240, gfz: 0.55, budget_chf: 8400000,
      termin_start: "2026-09-01", termin_bezug: "2028-11-30",
      nutzung: "Wohnen", anzahl_einheiten: 6,
      wohnungsmix: [{ typ: "3.5", anzahl: 2, flaeche: 95 }, { typ: "4.5", anzahl: 3, flaeche: 120 }, { typ: "5.5 Attika", anzahl: 1, flaeche: 165 }],
      raumprogramm: "6 ETW, Tiefgarage 10 PP, gemeinschaftlicher Aussenraum, Velo-/Kinderwagenraum.",
      energiestandard: "Minergie-P",
      zonenplan: "W2 zweigeschossige Wohnzone", baurecht: "Eigentum",
      auflagen: "Gewässerabstand Bach 8 m, Aussichtsschutz Seezone.", bewilligungsstand: "Vorprüfung positiv",
      honorarmodell: "SIA 102", frist_runde1: "2026-06-25",
      dateien: [
        { id: "d1", dateiname: "Situationsplan_1500.pdf", kategorie: "Plan", groesse: 2400000, oeffentlich: true },
        { id: "d2", dateiname: "Baugrundgutachten.pdf", kategorie: "Gutachten", groesse: 5600000, oeffentlich: false },
        { id: "d3", dateiname: "Katasterplan_Parzelle.pdf", kategorie: "Plan", groesse: 1800000, oeffentlich: false },
        { id: "d4", dateiname: "Fotodokumentation_Grundstueck.zip", kategorie: "Foto", groesse: 14000000, oeffentlich: false },
        { id: "d5", dateiname: "Machbarkeitsstudie_Vorprojekt.pdf", kategorie: "Sonstiges", groesse: 8900000, oeffentlich: false },
      ],
    },
  ],
  bewerbungen: [
    { id: "b1", projekt_id: "p1", architekt_id: "o1", status: "freigegeben",
      motivation: "Hanglagen mit Seesicht sind unsere Kerndisziplin. Wir schlagen eine terrassierte Volumetrie vor, die jeder Einheit unverbaubare Sicht und einen privaten Aussenraum sichert. Minergie-P erreichen wir über kompakte Hülle und Erdregister.",
      team: "Projektleitung M. Vogt, Bauleitung S. Brunner, Energie-Fachplaner extern.",
      referenzen: [{ t: "Wohnüberbauung Seefeld", j: 2023 }, { t: "Umbau Villa Küsnacht", j: 2022 }],
      richt_honorar_von: 590000, richt_honorar_bis: 660000, richt_termin: "22 Monate ab Baufreigabe",
      honorar_hinweis: "Richtwert nach SIA 102, Annahme BKP 2 gemäss Budget. Definitiv nach Sichtung Baugrundgutachten.",
      unverbindlich: true, erstellt_am: "2026-06-02" },
    { id: "b2", projekt_id: "p1", architekt_id: "o2", status: "gesichtet",
      motivation: "Wir verstehen Wohnen am Hang als Choreografie von Licht und Blick. Unser Ansatz: ein schlanker Baukörper mit vorgelagerten Loggien, der die GFZ effizient nutzt und dennoch grosszügig wirkt.",
      team: "Projektleitung C. Martin, lokale Bauleitung in Aussicht.",
      referenzen: [{ t: "Résidence Ouchy", j: 2024 }, { t: "Pavillon Vidy", j: 2023 }],
      richt_honorar_von: 610000, richt_honorar_bis: 690000, richt_termin: "24 Monate",
      honorar_hinweis: "Unverbindliche Schätzung. Reisespesen Lausanne–Zollikon noch nicht enthalten.",
      unverbindlich: true, erstellt_am: "2026-06-01" },
    { id: "b3", projekt_id: "p1", architekt_id: "o3", status: "eingereicht",
      motivation: "Als Generalplaner bieten wir Architektur, Kostenführung und Realisierung aus einer Hand — ideal bei ambitioniertem Budget und engem Terminplan.",
      team: "GU-Team mit internem Architekturstudio.",
      referenzen: [{ t: "Areal Wankdorf-City", j: 2024 }],
      richt_honorar_von: 640000, richt_honorar_bis: 700000, richt_termin: "20 Monate (beschleunigt)",
      honorar_hinweis: "Pauschalrichtwert inkl. Kostengarantie-Option.",
      unverbindlich: true, erstellt_am: "2026-05-30" },
  ],
  access: [
    { projekt_id: "p1", architekt_id: "o1", status: "granted", gewaehrt_am: "2026-06-03" },
  ],
  angebote: [],
  zahlungen: [],
};

// Datenschicht: speichert dauerhaft im Browser (localStorage).
// In der Ausbaustufe (Etappe D der Anleitung) wird dies durch Supabase ersetzt.
// MEM hält die Daten zur Laufzeit, damit nicht bei jedem Zugriff neu geparst wird.
let MEM = null;
const klon = (o) =>
  typeof structuredClone === "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
const sicher = {
  get(k) {
    try { return typeof localStorage !== "undefined" ? localStorage.getItem(k) : null; }
    catch { return null; }
  },
  set(k, v) {
    try { if (typeof localStorage !== "undefined") localStorage.setItem(k, v); } catch { /* Speicher nicht verfügbar (z.B. privater Modus) — bewusst ignoriert */ }
  },
};
const DB = {
  async load() {
    if (MEM) return MEM;
    try {
      const roh = sicher.get(KEY);
      MEM = roh ? JSON.parse(roh) : klon(SEED_DB);
    } catch {
      MEM = klon(SEED_DB);
    }
    return MEM;
  },
  async save() {
    try { sicher.set(KEY, JSON.stringify(MEM)); } catch { /* Speicher nicht verfügbar (z.B. privater Modus) — bewusst ignoriert */ }
  },
  async reset() {
    MEM = klon(SEED_DB);
    await this.save();
    return MEM;
  },
};
const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 8);

// Plan-Helfer
const ARCH_ABO = ["arch_atelier", "arch_maison"];
const INV_ABO = ["inv_bauherr", "inv_konsortium"];

const STATUS_LABEL = {
  eingereicht: ["Eingereicht", T.blue],
  gesichtet: ["Gesichtet", T.gold],
  freigegeben: ["Dossier freigegeben", T.green],
  abgelehnt: ["Abgelehnt", T.red],
  finalist: ["Finalist", T.green],
  zuschlag: ["Zuschlag erhalten", T.green],
};
const PROJ_STATUS = {
  entwurf: ["Entwurf", T.muted], offen: ["Offen für Bewerbungen", T.blue],
  bewertung: ["In Bewertung", T.gold], runde2: ["Runde 2 — Angebote", T.green],
  vergeben: ["Vergeben", T.green], geschlossen: ["Geschlossen", T.muted],
};
// ============================================================
//  UI-PRIMITIVE
// ============================================================
function Badge({ children, farbe = T.gold, gefüllt = false }) {
  return (
    <span style={{
      fontFamily: sans, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase",
      color: gefüllt ? "#fff" : farbe, background: gefüllt ? farbe : `${farbe}14`,
      border: `1px solid ${farbe}44`, padding: "3px 9px", borderRadius: 2, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}
function Sterne({ wert }) {
  if (!wert) return <span style={{ color: T.muted, fontSize: 12 }}>Noch keine Bewertung</span>;
  return (
    <span style={{ color: T.gold, letterSpacing: 2, fontSize: 13 }}>
      {"★★★★★".slice(0, Math.round(wert))}<span style={{ color: T.line }}>{"★★★★★".slice(Math.round(wert))}</span>
      <span style={{ color: T.muted, marginLeft: 6, fontFamily: sans, fontSize: 12 }}>{wert.toFixed(1)}</span>
    </span>
  );
}
function Stat({ label, wert, farbe = T.ink, klein }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted }}>{label}</div>
      <div style={{ fontFamily: serif, fontSize: klein ? 20 : 30, fontWeight: 600, color: farbe, marginTop: 4 }}>{wert}</div>
    </div>
  );
}
function Feld({ label, value, onChange, placeholder, type = "text", textarea, options, halb, voll }) {
  const style = {
    width: "100%", background: T.card, border: `1px solid ${T.line}`, padding: "11px 13px",
    fontSize: 14, marginTop: 6, outline: "none", fontFamily: sans, color: T.ink, borderRadius: 2,
  };
  return (
    <div style={{ marginBottom: 16, gridColumn: voll ? "1 / -1" : halb ? "auto" : undefined }}>
      <label style={{ fontSize: 12, letterSpacing: 0.4, color: T.muted }}>{label}</label>
      {textarea ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} style={{ ...style, resize: "vertical" }} />
      ) : options ? (
        <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={style}>
          <option value="">— wählen —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}
function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const base = { cursor: disabled ? "not-allowed" : "pointer", border: "none", fontFamily: sans, fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", padding: "13px 28px", transition: "all .3s", opacity: disabled ? 0.45 : 1, borderRadius: 2 };
  const vs = {
    primary: { background: T.ink, color: T.paper },
    gold: { background: T.gold, color: "#fff" },
    green: { background: T.green, color: "#fff" },
    ghost: { background: "transparent", color: T.ink, border: `1px solid ${T.ink}` },
    danger: { background: "transparent", color: T.red, border: `1px solid ${T.red}` },
    quiet: { background: T.paper2, color: T.ink },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vs[variant], ...style }}>{children}</button>;
}
function Card({ children, style, hover }) {
  return <div className={hover ? "lift" : ""} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 3, ...style }}>{children}</div>;
}

// ============================================================
//  APP-SHELL
// ============================================================
function App() {
  const [bereit, setBereit] = useState(false);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);        // aktive Organisation (eingeloggt)
  const [route, setRoute] = useState({ name: "landing" });
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => { DB.load().then((d) => { setDb(d); setBereit(true); }); }, []);
  useEffect(() => { if (db) DB.save(); }, [tick, db]);

  const go = (name, params = {}) => { setRoute({ name, ...params }); window.scrollTo?.(0, 0); };

  const loginAls = (orgId) => {
    const org = db.organisationen.find((o) => o.id === orgId);
    setUser(org);
    go(org.rolle === "investor" ? "inv-dash" : "arch-dash");
  };
  const logout = () => { setUser(null); go("landing"); };

  if (!bereit) return <div style={{ fontFamily: sans, padding: 60, color: T.muted }}>Lädt …</div>;

  const ctx = { db, user, go, route, refresh, loginAls, logout };

  return (
    <div style={{ fontFamily: sans, background: T.paper, color: T.ink, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${T.gold};color:#fff}
        body{margin:0}
        .lift{transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
        .lift:hover{transform:translateY(-3px);box-shadow:0 16px 38px -22px rgba(26,24,20,.4)}
        .ul{position:relative;cursor:pointer}
        .ul::after{content:'';position:absolute;left:0;bottom:-3px;height:1px;width:0;background:currentColor;transition:width .3s}
        .ul:hover::after{width:100%}
        @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .rise{animation:rise .6s both}
        input,select,textarea{font-family:${sans}}
        table{border-collapse:collapse;width:100%}
      `}</style>

      <TopBar {...ctx} />
      <main style={{ minHeight: "70vh" }}>
        {route.name === "landing" && <Landing {...ctx} />}
        {route.name === "inv-dash" && <InvestorDashboard {...ctx} />}
        {route.name === "inv-projekt-neu" && <ProjektFormular {...ctx} />}
        {route.name === "inv-projekt" && <InvestorProjekt {...ctx} />}
        {route.name === "arch-dash" && <ArchitektDashboard {...ctx} />}
        {route.name === "arch-auktionen" && <ArchitektAuktionen {...ctx} />}
        {route.name === "arch-auktion" && <ArchitektAuktionDetail {...ctx} />}
        {route.name === "arch-bewerbung" && <BewerbungFormular {...ctx} />}
      </main>
      <Footer />
    </div>
  );
}

function TopBar({ user, go, logout, db, loginAls }) {
  const [menu, setMenu] = useState(false);
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(244,241,234,.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "16px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go(user ? (user.rolle === "investor" ? "inv-dash" : "arch-dash") : "landing")} style={{ cursor: "pointer", lineHeight: 1 }}>
          <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600, letterSpacing: 1 }}>ARCHITEKTONIK</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: T.muted, marginTop: 2 }}>SCHWEIZER VERGABE-PLATTFORM</div>
        </div>
        <nav style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {user && user.rolle === "investor" && (
            <>
              <span className="ul" onClick={() => go("inv-dash")} style={{ fontSize: 13, color: T.muted }}>Übersicht</span>
              <span className="ul" onClick={() => go("inv-projekt-neu")} style={{ fontSize: 13, color: T.muted }}>Projekt ausschreiben</span>
            </>
          )}
          {user && user.rolle === "architekt" && (
            <>
              <span className="ul" onClick={() => go("arch-dash")} style={{ fontSize: 13, color: T.muted }}>Übersicht</span>
              <span className="ul" onClick={() => go("arch-auktionen")} style={{ fontSize: 13, color: T.muted }}>Auktionen</span>
            </>
          )}
          {user ? (
            <div style={{ position: "relative" }}>
              <div onClick={() => setMenu(!menu)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", border: `1px solid ${T.line}`, borderRadius: 2 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: user.farbe || T.gold, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontFamily: serif }}>{user.name[0]}</span>
                <span style={{ fontSize: 13 }}>{user.name.split(" ")[0]}</span>
              </div>
              {menu && (
                <div style={{ position: "absolute", right: 0, top: 44, background: T.card, border: `1px solid ${T.line}`, minWidth: 230, boxShadow: "0 16px 40px -20px rgba(0,0,0,.3)", zIndex: 60 }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.line}`, fontSize: 12, color: T.muted }}>{user.name}</div>
                  <div style={{ padding: "8px 16px", fontSize: 11, letterSpacing: 1, color: T.muted, textTransform: "uppercase" }}>Konto wechseln (Demo)</div>
                  {db.organisationen.map((o) => (
                    <div key={o.id} onClick={() => { loginAls(o.id); setMenu(false); }} style={{ padding: "9px 16px", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", background: o.id === user.id ? T.paper2 : "transparent" }}>
                      {o.name}<span style={{ color: T.muted, fontSize: 11 }}>{o.rolle === "investor" ? "Investor" : "Architekt"}</span>
                    </div>
                  ))}
                  <div onClick={() => { logout(); setMenu(false); }} style={{ padding: "11px 16px", fontSize: 13, cursor: "pointer", borderTop: `1px solid ${T.line}`, color: T.red }}>Abmelden</div>
                </div>
              )}
            </div>
          ) : (
            <Btn onClick={() => go("landing")} style={{ padding: "11px 22px" }}>Anmelden</Btn>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.ink, color: T.paper, padding: "50px 30px 34px", marginTop: 60 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 600 }}>ARCHITEKTONIK</div>
        <div style={{ fontSize: 12, color: "#8a8478" }}>© 2026 Architektonik AG · Zürich · Preise exkl. 8.1 % MWST · CHF · DSG-konform</div>
      </div>
    </footer>
  );
}
// ============================================================
//  LANDING / ROLLENWAHL (Demo-Login)
// ============================================================
function Landing({ db, loginAls }) {
  const investoren = db.organisationen.filter((o) => o.rolle === "investor");
  const architekten = db.organisationen.filter((o) => o.rolle === "architekt");
  return (
    <section style={{ maxWidth: 1000, margin: "0 auto", padding: "70px 30px 90px" }}>
      <div className="rise" style={{ textAlign: "center" }}>
        <Badge>Schweizer Standard · Diskret · Kuratiert</Badge>
        <h1 style={{ fontFamily: serif, fontSize: 64, fontWeight: 500, lineHeight: 1.04, marginTop: 22, letterSpacing: -1 }}>
          Wählen Sie Ihr <em style={{ color: T.gold }}>Dashboard</em>
        </h1>
        <p style={{ fontSize: 17, color: T.muted, marginTop: 20, maxWidth: 600, margin: "20px auto 0", lineHeight: 1.7 }}>
          Investoren schreiben Projekte aus und steuern die Vergabe. Architekturbüros bewerben sich, erhalten selektiven Dossier-Zugriff und reichen verbindliche Angebote ein.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 50 }}>
        <Card style={{ padding: 32, borderTop: `3px solid ${T.gold}` }}>
          <Badge farbe={T.gold}>Investor / Bauherr</Badge>
          <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, marginTop: 14 }}>Projekte ausschreiben</h3>
          <p style={{ fontSize: 14, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>Dossier erfassen, Bewerbungen sichten, Unterlagen pro Büro freigeben, Zuschlag erteilen.</p>
          <div style={{ marginTop: 20 }}>
            {investoren.map((o) => (
              <div key={o.id} onClick={() => loginAls(o.id)} className="lift" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: `1px solid ${T.line}`, marginBottom: 10, background: T.paper }}>
                <span style={{ fontSize: 15 }}>{o.name}</span>
                <span style={{ fontSize: 12, color: T.gold }}>Anmelden →</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 32, borderTop: `3px solid ${T.green}` }}>
          <Badge farbe={T.green}>Architekt / Entwickler</Badge>
          <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, marginTop: 14 }}>An Auktionen teilnehmen</h3>
          <p style={{ fontSize: 14, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>Bewerbungsschreiben + unverbindliche Richtofferte einreichen, Dossier-Zugriff erhalten, Angebot abgeben.</p>
          <div style={{ marginTop: 20 }}>
            {architekten.map((o) => (
              <div key={o.id} onClick={() => loginAls(o.id)} className="lift" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", border: `1px solid ${T.line}`, marginBottom: 10, background: T.paper }}>
                <span style={{ fontSize: 15 }}>{o.name}</span>
                <span style={{ fontSize: 12, color: T.green }}>Anmelden →</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 30 }}>Demo-Modus — wählen Sie ein Konto, um das jeweilige Dashboard zu sehen. Über das Profilmenü oben rechts können Sie jederzeit wechseln.</p>
    </section>
  );
}

// ============================================================
//  INVESTOR-DASHBOARD
// ============================================================
function InvestorDashboard({ db, user, go }) {
  const meine = db.projekte.filter((p) => p.investor_id === user.id);
  const alleBew = db.bewerbungen.filter((b) => meine.some((p) => p.id === b.projekt_id));
  const offen = meine.filter((p) => ["offen", "bewertung", "runde2"].includes(p.status)).length;

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 30px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
        <div>
          <Badge farbe={T.gold}>Investor-Dashboard</Badge>
          <h1 style={{ fontFamily: serif, fontSize: 44, fontWeight: 500, marginTop: 12 }}>{user.name}</h1>
        </div>
        <Btn variant="gold" onClick={() => go("inv-projekt-neu")}>+ Projekt ausschreiben</Btn>
      </div>

      <Card style={{ padding: "26px 30px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 30 }}>
        <Stat label="Projekte gesamt" wert={meine.length} />
        <Stat label="Aktive Ausschreibungen" wert={offen} farbe={T.green} />
        <Stat label="Bewerbungen erhalten" wert={alleBew.length} farbe={T.gold} />
        <Stat label="Abonnement" wert={INV_ABO.includes(user.plan) ? "Bauherr" : "Einzeln"} klein />
      </Card>

      <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Meine Projekte</h2>
      {meine.length === 0 && (
        <Card style={{ padding: 40, textAlign: "center", color: T.muted }}>
          Noch keine Projekte. <span className="ul" style={{ color: T.gold }} onClick={() => go("inv-projekt-neu")}>Jetzt erstes Projekt ausschreiben →</span>
        </Card>
      )}
      <div style={{ display: "grid", gap: 16 }}>
        {meine.map((p) => {
          const bew = db.bewerbungen.filter((b) => b.projekt_id === p.id);
          const freigegeben = db.access.filter((a) => a.projekt_id === p.id && a.status === "granted").length;
          const [lbl, col] = PROJ_STATUS[p.status];
          return (
            <Card key={p.id} hover style={{ padding: "26px 30px", cursor: "pointer", display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr auto", gap: 22, alignItems: "center" }} >
              <div onClick={() => go("inv-projekt", { projektId: p.id })}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge farbe={col}>{lbl}</Badge><Badge farbe={T.muted}>{p.art}</Badge></div>
                <h3 style={{ fontFamily: serif, fontSize: 23, fontWeight: 600 }}>{p.titel}</h3>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{p.ort} {p.kanton} · Parzelle {p.parzelle_nr}</div>
              </div>
              <Stat label="Bausumme" wert={CHF(p.budget_chf)} klein />
              <Stat label="Bewerbungen" wert={bew.length} klein farbe={T.gold} />
              <Stat label="Dossier-Zugriff" wert={`${freigegeben} Büros`} klein farbe={T.green} />
              <div style={{ textAlign: "right" }}><Btn variant="quiet" style={{ padding: "10px 18px" }} onClick={() => go("inv-projekt", { projektId: p.id })}>Verwalten →</Btn></div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
// ============================================================
//  PROJEKT-FORMULAR (Investor erfasst Dossier)
//  4 Stufen: Allgemein · Bauangaben · Programm · Recht + Dateien
// ============================================================
function ProjektFormular({ db, user, go, refresh }) {
  const [stufe, setStufe] = useState(1);
  const [f, setF] = useState({
    titel: "", art: "Architekturwettbewerb", beschreibung: "",
    adresse: "", plz: "", ort: "", kanton: "", parzelle_nr: "", grundstueck_m2: "", gfz: "", budget_chf: "", termin_start: "", termin_bezug: "",
    nutzung: "Wohnen", anzahl_einheiten: "", raumprogramm: "", energiestandard: "",
    zonenplan: "", baurecht: "Eigentum", auflagen: "", bewilligungsstand: "",
    honorarmodell: "SIA 102", frist_runde1: "",
    dateien: [],
  });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const stufen = ["Allgemein", "Bauangaben", "Programm", "Recht & Dateien"];
  const ausschreibgebuehr = INV_ABO.includes(user.plan) ? 0 : 1500;

  const addDatei = (kategorie) => {
    const name = prompt(`Dateiname (${kategorie}) eingeben:`, "Dokument.pdf");
    if (!name) return;
    const oeff = confirm("Soll diese Datei bereits in Runde 1 öffentlich sichtbar sein?\n\nOK = öffentlich (alle Bewerber sehen sie)\nAbbrechen = vertraulich (nur nach Freigabe)");
    setF((p) => ({ ...p, dateien: [...p.dateien, { id: uid("d"), dateiname: name, kategorie, groesse: Math.round(Math.random() * 9000000) + 500000, oeffentlich: oeff }] }));
  };
  const rmDatei = (id) => setF((p) => ({ ...p, dateien: p.dateien.filter((d) => d.id !== id) }));

  const publizieren = () => {
    const neu = {
      id: uid("p"), investor_id: user.id, status: "offen", ...f,
      grundstueck_m2: +f.grundstueck_m2 || null, gfz: +f.gfz || null, budget_chf: +f.budget_chf || null,
      anzahl_einheiten: +f.anzahl_einheiten || null, wohnungsmix: [],
    };
    db.projekte.unshift(neu);
    if (ausschreibgebuehr > 0) (db.zahlungen || (db.zahlungen = [])).push({ id: uid("z"), organisation_id: user.id, betrag_chf: 1500, zweck: "ausschreibung", referenz_id: neu.id, status: "bezahlt" });
    refresh();
    go("inv-projekt", { projektId: neu.id });
  };

  const kannWeiter = stufe === 1 ? f.titel : true;

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "40px 30px 80px" }}>
      <span className="ul" onClick={() => go("inv-dash")} style={{ fontSize: 13, color: T.muted }}>← Zurück zur Übersicht</span>
      <h1 style={{ fontFamily: serif, fontSize: 44, fontWeight: 500, margin: "16px 0 6px" }}>Projekt ausschreiben</h1>
      <p style={{ fontSize: 14, color: T.muted, marginBottom: 26 }}>Je vollständiger das Dossier, desto präziser die Richtofferten der Büros.</p>

      {/* Fortschritt */}
      <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
        {stufen.map((s, i) => (
          <div key={s} onClick={() => setStufe(i + 1)} style={{ flex: 1, cursor: "pointer" }}>
            <div style={{ height: 3, background: i + 1 <= stufe ? T.gold : T.line }} />
            <div style={{ fontSize: 12, color: i + 1 === stufe ? T.ink : T.muted, marginTop: 8, fontWeight: i + 1 === stufe ? 500 : 400 }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <Card style={{ padding: 32 }}>
        {stufe === 1 && (
          <div>
            <Feld label="Projekttitel *" value={f.titel} onChange={set("titel")} placeholder="z.B. Neubau Mehrfamilienhaus am Hang" />
            <Feld label="Verfahrensart" value={f.art} onChange={set("art")} options={["Architekturwettbewerb", "Direktvergabe mit Auktion", "Generalplaner-Auktion", "Studienauftrag"]} />
            <Feld label="Kurzbeschreibung" value={f.beschreibung} onChange={set("beschreibung")} textarea placeholder="Worum geht es? Was sind die zentralen Anforderungen?" />
            <Feld label="Frist Runde 1 (Bewerbungen)" value={f.frist_runde1} onChange={set("frist_runde1")} type="date" />
          </div>
        )}
        {stufe === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <Feld halb label="Adresse" value={f.adresse} onChange={set("adresse")} placeholder="Strasse / Nr." />
            <Feld halb label="Parzellen-Nr." value={f.parzelle_nr} onChange={set("parzelle_nr")} placeholder="z.B. ZK-1842" />
            <Feld halb label="PLZ" value={f.plz} onChange={set("plz")} placeholder="8702" />
            <Feld halb label="Ort" value={f.ort} onChange={set("ort")} placeholder="Zollikon" />
            <Feld halb label="Kanton" value={f.kanton} onChange={set("kanton")} options={["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"]} />
            <Feld halb label="Grundstücksfläche (m²)" value={f.grundstueck_m2} onChange={set("grundstueck_m2")} type="number" placeholder="1240" />
            <Feld halb label="Geschossflächenziffer (GFZ)" value={f.gfz} onChange={set("gfz")} type="number" placeholder="0.55" />
            <Feld halb label="Geschätzte Bausumme (CHF)" value={f.budget_chf} onChange={set("budget_chf")} type="number" placeholder="8400000" />
            <Feld halb label="Baustart (geplant)" value={f.termin_start} onChange={set("termin_start")} type="date" />
            <Feld halb label="Bezug (geplant)" value={f.termin_bezug} onChange={set("termin_bezug")} type="date" />
          </div>
        )}
        {stufe === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <Feld halb label="Nutzung" value={f.nutzung} onChange={set("nutzung")} options={["Wohnen", "Mischnutzung", "Gewerbe", "Öffentlich", "Industrie/Umnutzung"]} />
            <Feld halb label="Anzahl Einheiten" value={f.anzahl_einheiten} onChange={set("anzahl_einheiten")} type="number" placeholder="6" />
            <Feld halb label="Energiestandard" value={f.energiestandard} onChange={set("energiestandard")} options={["Minergie", "Minergie-P", "Minergie-A", "GEAK A", "SNBS", "Kein Vorgabe"]} />
            <Feld halb label="Honorarmodell" value={f.honorarmodell} onChange={set("honorarmodell")} options={["SIA 102", "SIA 103", "SIA 108", "Pauschal", "Nach Aufwand"]} />
            <Feld voll label="Raum- / Bauprogramm" value={f.raumprogramm} onChange={set("raumprogramm")} textarea placeholder="z.B. 6 ETW, Tiefgarage 10 PP, gemeinschaftlicher Aussenraum, Velo-/Kinderwagenraum." />
          </div>
        )}
        {stufe === 4 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Feld halb label="Zonenplan / Zone" value={f.zonenplan} onChange={set("zonenplan")} placeholder="z.B. W2 zweigeschossige Wohnzone" />
              <Feld halb label="Baurecht" value={f.baurecht} onChange={set("baurecht")} options={["Eigentum", "Baurecht", "im Stockwerkeigentum"]} />
              <Feld halb label="Bewilligungsstand" value={f.bewilligungsstand} onChange={set("bewilligungsstand")} options={["Keine Vorabklärung", "Vorprüfung positiv", "Baubewilligung erteilt", "in Einsprachefrist"]} />
            </div>
            <Feld voll label="Auflagen / Besonderheiten" value={f.auflagen} onChange={set("auflagen")} textarea placeholder="z.B. Gewässerabstand, Denkmalschutz, Lärmschutz, Aussichtsschutz." />

            <div style={{ marginTop: 24, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 600 }}>Dossier-Dateien</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Plan", "Gutachten", "Foto", "Sonstiges"].map((k) => (
                    <Btn key={k} variant="quiet" style={{ padding: "8px 14px", fontSize: 11 }} onClick={() => addDatei(k)}>+ {k}</Btn>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>Vertrauliche Dateien werden erst sichtbar, wenn Sie einem Büro nach Sichtung der Bewerbungen Zugriff gewähren.</p>
              {f.dateien.length === 0 && <div style={{ fontSize: 13, color: T.muted, padding: "18px", border: `1px dashed ${T.line}`, textAlign: "center" }}>Noch keine Dateien hinzugefügt.</div>}
              {f.dateien.map((d) => (
                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", border: `1px solid ${T.line}`, marginBottom: 8, background: T.paper }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Badge farbe={T.muted}>{d.kategorie}</Badge>
                    <span style={{ fontSize: 14 }}>{d.dateiname}</span>
                    {d.oeffentlich ? <Badge farbe={T.blue}>öffentlich</Badge> : <Badge farbe={T.red}>vertraulich</Badge>}
                  </div>
                  <span className="ul" style={{ fontSize: 12, color: T.red }} onClick={() => rmDatei(d.id)}>entfernen</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 20, background: T.paper2, borderRadius: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span>Ausschreibungsgebühr</span>
                <span>{ausschreibgebuehr === 0 ? "im Abo enthalten" : CHF(1500)}</span>
              </div>
              {ausschreibgebuehr > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginTop: 6 }}><span>+ MWST 8.1 %</span><span>{CHF(1500 * 0.081)}</span></div>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          <Btn variant="ghost" onClick={() => (stufe > 1 ? setStufe(stufe - 1) : go("inv-dash"))}>{stufe > 1 ? "Zurück" : "Abbrechen"}</Btn>
          {stufe < 4
            ? <Btn variant="primary" disabled={!kannWeiter} onClick={() => setStufe(stufe + 1)}>Weiter</Btn>
            : <Btn variant="gold" onClick={publizieren}>Ausschreibung publizieren</Btn>}
        </div>
      </Card>
    </section>
  );
}
// ============================================================
//  INVESTOR-PROJEKTDETAIL — Bewerbungen sichten, Zugriff gewähren, vergeben
// ============================================================
function InvestorProjekt({ db, route, go, refresh }) {
  const p = db.projekte.find((x) => x.id === route.projektId);
  const [tab, setTab] = useState("bewerbungen");
  const [offen, setOffen] = useState(null); // aufgeklappte Bewerbung
  if (!p) return <section style={{ padding: 60 }}>Projekt nicht gefunden.</section>;

  const bewerbungen = db.bewerbungen.filter((b) => b.projekt_id === p.id);
  const accessOf = (archId) => db.access.find((a) => a.projekt_id === p.id && a.architekt_id === archId);
  const org = (id) => db.organisationen.find((o) => o.id === id);
  const [lbl, col] = PROJ_STATUS[p.status];

  const setBewStatus = (b, status) => { b.status = status; refresh(); };
  const toggleAccess = (archId) => {
    let a = accessOf(archId);
    if (!a) { a = { projekt_id: p.id, architekt_id: archId, status: "granted", gewaehrt_am: new Date().toISOString() }; db.access.push(a); }
    else a.status = a.status === "granted" ? "widerrufen" : "granted";
    // Status der Bewerbung mitführen
    const b = bewerbungen.find((x) => x.architekt_id === archId);
    if (b && a.status === "granted" && b.status === "gesichtet") b.status = "freigegeben";
    if (p.status === "bewertung" && db.access.some((x) => x.projekt_id === p.id && x.status === "granted")) p.status = "runde2";
    refresh();
  };
  const vergeben = (b) => {
    if (!confirm(`Zuschlag an ${org(b.architekt_id).name} erteilen? Das Verfahren wird abgeschlossen.`)) return;
    bewerbungen.forEach((x) => (x.status = x.id === b.id ? "zuschlag" : "abgelehnt"));
    p.status = "vergeben";
    const o = org(b.architekt_id); if (o) o.zuschlaege = (o.zuschlaege || 0) + 1;
    refresh();
  };

  const sortiert = [...bewerbungen].sort((a, b) => a.richt_honorar_von - b.richt_honorar_von);

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 30px 80px" }}>
      <span className="ul" onClick={() => go("inv-dash")} style={{ fontSize: 13, color: T.muted }}>← Zurück zur Übersicht</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "14px 0 26px" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><Badge farbe={col} gefüllt>{lbl}</Badge><Badge farbe={T.muted}>{p.art}</Badge></div>
          <h1 style={{ fontFamily: serif, fontSize: 42, fontWeight: 500 }}>{p.titel}</h1>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>{p.adresse}, {p.plz} {p.ort} · Parzelle {p.parzelle_nr}</div>
        </div>
        <Stat label="Bausumme" wert={CHF(p.budget_chf)} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.line}`, marginBottom: 26 }}>
        {[["bewerbungen", `Bewerbungen (${bewerbungen.length})`], ["dossier", "Dossier & Dateien"], ["details", "Projektangaben"]].map(([k, l]) => (
          <div key={k} onClick={() => setTab(k)} style={{ padding: "12px 20px", cursor: "pointer", fontSize: 14, borderBottom: `2px solid ${tab === k ? T.ink : "transparent"}`, color: tab === k ? T.ink : T.muted, fontWeight: tab === k ? 500 : 400 }}>{l}</div>
        ))}
      </div>

      {/* --- Bewerbungen --- */}
      {tab === "bewerbungen" && (
        <div>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 18, maxWidth: 760, lineHeight: 1.6 }}>
            Runde 1: Bewerbungsschreiben mit unverbindlicher Richtofferte. Gewähren Sie ausgewählten Büros Zugriff auf die vollständigen Dossier-Unterlagen — entscheiden Sie pro Büro einzeln. Danach reichen diese in Runde 2 ein verbindliches Angebot ein.
          </p>
          {sortiert.length === 0 && <Card style={{ padding: 40, textAlign: "center", color: T.muted }}>Noch keine Bewerbungen eingegangen.</Card>}
          <div style={{ display: "grid", gap: 14 }}>
            {sortiert.map((b, i) => {
              const o = org(b.architekt_id);
              const a = accessOf(b.architekt_id);
              const granted = a && a.status === "granted";
              const angebot = db.angebote.find((x) => x.bewerbung_id === b.id);
              const [sl, sc] = STATUS_LABEL[b.status];
              const auf = offen === b.id;
              return (
                <Card key={b.id} style={{ overflow: "hidden", border: `1px solid ${granted ? T.green + "66" : T.line}` }}>
                  <div style={{ padding: "20px 26px", display: "grid", gridTemplateColumns: "auto 2fr 1.3fr 1fr auto", gap: 20, alignItems: "center" }}>
                    <span style={{ width: 38, height: 38, borderRadius: "50%", background: o.farbe, color: "#fff", display: "grid", placeItems: "center", fontFamily: serif, fontSize: 16 }}>{o.name[0]}</span>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 600 }}>{o.name}</h3>
                        {i === 0 && <Badge farbe={T.green}>tiefste Richtofferte</Badge>}
                      </div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}><Sterne wert={o.bewertung} /> · {o.zuschlaege} Zuschläge · {o.ort}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.muted }}>Richtofferte (unverbindlich)</div>
                      <div style={{ fontFamily: serif, fontSize: 20, fontWeight: 600 }}>{CHF(b.richt_honorar_von)}–{CHF(b.richt_honorar_bis)}</div>
                    </div>
                    <Badge farbe={sc} gefüllt>{sl}</Badge>
                    <Btn variant="quiet" style={{ padding: "9px 16px", fontSize: 12 }} onClick={() => setOffen(auf ? null : b.id)}>{auf ? "Schliessen" : "Lesen"}</Btn>
                  </div>

                  {auf && (
                    <div style={{ padding: "0 26px 24px", borderTop: `1px solid ${T.line}` }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 30, paddingTop: 20 }}>
                        <div>
                          <H6>Bewerbungsschreiben</H6>
                          <p style={{ fontSize: 14, lineHeight: 1.75, color: T.ink }}>{b.motivation}</p>
                          <H6 style={{ marginTop: 18 }}>Vorgesehenes Team</H6>
                          <p style={{ fontSize: 14, color: T.muted }}>{b.team}</p>
                          <H6 style={{ marginTop: 18 }}>Referenzen</H6>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(b.referenzen || []).map((r, j) => <Badge key={j} farbe={T.gold}>{r.t} ({r.j})</Badge>)}</div>
                        </div>
                        <div>
                          <Card style={{ padding: 18, background: T.paper2 }}>
                            <H6>Unverbindliche Richtofferte</H6>
                            <div style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>{CHF(b.richt_honorar_von)} – {CHF(b.richt_honorar_bis)}</div>
                            <div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>Termin: {b.richt_termin}</div>
                            <div style={{ fontSize: 12, color: T.muted, marginTop: 10, lineHeight: 1.5, fontStyle: "italic" }}>{b.honorar_hinweis}</div>
                          </Card>

                          {angebot && (
                            <Card style={{ padding: 18, marginTop: 12, background: T.green + "0d", border: `1px solid ${T.green}44` }}>
                              <H6 style={{ color: T.green }}>Verbindliches Angebot (Runde 2)</H6>
                              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 600, color: T.green }}>{CHF(angebot.honorar_chf)}</div>
                              <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{angebot.honorarmodell} · {angebot.termin} · gültig bis {DATUM(angebot.gueltig_bis)}</div>
                              <p style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{angebot.leistungsumfang}</p>
                            </Card>
                          )}

                          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                            <Btn variant={granted ? "danger" : "green"} onClick={() => toggleAccess(b.architekt_id)}>
                              {granted ? "Dossier-Zugriff widerrufen" : "Vollständiges Dossier freigeben"}
                            </Btn>
                            {b.status !== "abgelehnt" && b.status !== "zuschlag" && (
                              <Btn variant="ghost" onClick={() => setBewStatus(b, "abgelehnt")}>Bewerbung ablehnen</Btn>
                            )}
                            {(b.status === "freigegeben" || angebot) && p.status !== "vergeben" && (
                              <Btn variant="gold" onClick={() => vergeben(b)}>★ Zuschlag erteilen</Btn>
                            )}
                          </div>
                          {granted && <div style={{ fontSize: 11, color: T.green, marginTop: 8 }}>✓ Hat seit {DATUM(a.gewaehrt_am)} Zugriff auf alle vertraulichen Unterlagen.</div>}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* --- Dossier-Dateien --- */}
      {tab === "dossier" && (
        <Card style={{ padding: 28 }}>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Vertrauliche Dateien sind nur für Büros sichtbar, denen Sie unter „Bewerbungen" Zugriff gewährt haben.</p>
          {(p.dateien || []).map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", border: `1px solid ${T.line}`, marginBottom: 8, background: T.paper }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Badge farbe={T.muted}>{d.kategorie}</Badge>
                <span style={{ fontSize: 14 }}>{d.dateiname}</span>
                <span style={{ fontSize: 12, color: T.muted }}>{(d.groesse / 1e6).toFixed(1)} MB</span>
              </div>
              {d.oeffentlich ? <Badge farbe={T.blue}>öffentlich (Runde 1)</Badge> : <Badge farbe={T.red}>vertraulich</Badge>}
            </div>
          ))}
        </Card>
      )}

      {/* --- Projektangaben --- */}
      {tab === "details" && (
        <Card style={{ padding: 32 }}>
          <Grid2>
            <Info l="Verfahrensart" v={p.art} />
            <Info l="Nutzung" v={p.nutzung} />
            <Info l="Adresse" v={`${p.adresse}, ${p.plz} ${p.ort}`} />
            <Info l="Parzelle" v={p.parzelle_nr} />
            <Info l="Grundstück" v={p.grundstueck_m2 ? `${p.grundstueck_m2} m²` : "—"} />
            <Info l="GFZ" v={p.gfz || "—"} />
            <Info l="Bausumme" v={CHF(p.budget_chf)} />
            <Info l="Einheiten" v={p.anzahl_einheiten || "—"} />
            <Info l="Energiestandard" v={p.energiestandard || "—"} />
            <Info l="Honorarmodell" v={p.honorarmodell} />
            <Info l="Zonenplan" v={p.zonenplan || "—"} />
            <Info l="Baurecht" v={p.baurecht} />
            <Info l="Bewilligungsstand" v={p.bewilligungsstand || "—"} />
            <Info l="Baustart / Bezug" v={`${DATUM(p.termin_start)} → ${DATUM(p.termin_bezug)}`} />
          </Grid2>
          {p.raumprogramm && <><H6 style={{ marginTop: 22 }}>Raumprogramm</H6><p style={{ fontSize: 14, lineHeight: 1.7 }}>{p.raumprogramm}</p></>}
          {p.auflagen && <><H6 style={{ marginTop: 18 }}>Auflagen</H6><p style={{ fontSize: 14, lineHeight: 1.7 }}>{p.auflagen}</p></>}
          {p.wohnungsmix?.length > 0 && (
            <><H6 style={{ marginTop: 18 }}>Wohnungsmix</H6>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{p.wohnungsmix.map((w, i) => <Badge key={i} farbe={T.gold}>{w.anzahl}× {w.typ} · {w.flaeche} m²</Badge>)}</div></>
          )}
        </Card>
      )}
    </section>
  );
}

function H6({ children, style }) { return <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, marginBottom: 8, ...style }}>{children}</div>; }
function Info({ l, v }) { return <div style={{ marginBottom: 4 }}><div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.muted }}>{l}</div><div style={{ fontSize: 15, marginTop: 2 }}>{v}</div></div>; }
function Grid2({ children }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px 24px" }}>{children}</div>; }
// ============================================================
//  ARCHITEKTEN-DASHBOARD
// ============================================================
function ArchitektDashboard({ db, user, go }) {
  const meine = db.bewerbungen.filter((b) => b.architekt_id === user.id);
  const projektOf = (b) => db.projekte.find((p) => p.id === b.projekt_id);
  const accessOf = (pid) => db.access.find((a) => a.projekt_id === pid && a.architekt_id === user.id && a.status === "granted");
  const freigegeben = meine.filter((b) => accessOf(b.projekt_id)).length;

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 30px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
        <div>
          <Badge farbe={T.green}>Architekten-Dashboard</Badge>
          <h1 style={{ fontFamily: serif, fontSize: 44, fontWeight: 500, marginTop: 12 }}>{user.name}</h1>
        </div>
        <Btn variant="green" onClick={() => go("arch-auktionen")}>Auktionen entdecken →</Btn>
      </div>

      <Card style={{ padding: "26px 30px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 30 }}>
        <Stat label="Aktive Bewerbungen" wert={meine.length} />
        <Stat label="Dossiers freigeschaltet" wert={freigegeben} farbe={T.green} />
        <Stat label="Zuschläge gesamt" wert={user.zuschlaege || 0} farbe={T.gold} />
        <Stat label="Abonnement" wert={user.plan === "arch_maison" ? "Maison" : user.plan === "arch_atelier" ? "Atelier" : "Einzeln"} klein />
      </Card>

      <h2 style={{ fontFamily: serif, fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Meine Bewerbungen</h2>
      {meine.length === 0 && (
        <Card style={{ padding: 40, textAlign: "center", color: T.muted }}>
          Noch keine Bewerbungen. <span className="ul" style={{ color: T.green }} onClick={() => go("arch-auktionen")}>Offene Auktionen ansehen →</span>
        </Card>
      )}
      <div style={{ display: "grid", gap: 14 }}>
        {meine.map((b) => {
          const p = projektOf(b); if (!p) return null;
          const granted = !!accessOf(p.id);
          const angebot = db.angebote.find((x) => x.bewerbung_id === b.id);
          const [sl, sc] = STATUS_LABEL[b.status];
          return (
            <Card key={b.id} hover style={{ padding: "22px 28px", display: "grid", gridTemplateColumns: "2.2fr 1.2fr 1fr auto", gap: 20, alignItems: "center", cursor: "pointer" }} >
              <div onClick={() => go("arch-auktion", { projektId: p.id })}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}><Badge farbe={sc} gefüllt>{sl}</Badge>{granted && <Badge farbe={T.green}>Vollzugriff</Badge>}</div>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 600 }}>{p.titel}</h3>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>{p.ort} {p.kanton} · {p.art}</div>
              </div>
              <Stat label="Ihre Richtofferte" wert={`${CHF(b.richt_honorar_von)}+`} klein />
              <Stat label="Status Runde 2" wert={angebot ? "Angebot abgegeben" : granted ? "Bereit" : "—"} klein farbe={angebot ? T.green : T.muted} />
              <Btn variant="quiet" style={{ padding: "10px 18px" }} onClick={() => go("arch-auktion", { projektId: p.id })}>Öffnen →</Btn>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
//  ARCHITEKT — AUKTIONSLISTE
// ============================================================
function ArchitektAuktionen({ db, user, go }) {
  const offen = db.projekte.filter((p) => ["offen", "bewertung", "runde2"].includes(p.status));
  const beworben = (pid) => db.bewerbungen.some((b) => b.projekt_id === pid && b.architekt_id === user.id);
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "44px 30px 80px" }}>
      <Badge farbe={T.red}>● Offene Auktionen</Badge>
      <h1 style={{ fontFamily: serif, fontSize: 48, fontWeight: 500, margin: "12px 0 8px" }}>Offene Ausschreibungen</h1>
      <p style={{ fontSize: 15, color: T.muted, maxWidth: 620, lineHeight: 1.6, marginBottom: 30 }}>
        Reichen Sie ein Bewerbungsschreiben mit unverbindlicher Richtofferte ein. Bei Freigabe durch die Bauherrschaft erhalten Sie Zugriff auf das vollständige Dossier und geben in Runde 2 Ihr verbindliches Angebot ab.
      </p>
      <div style={{ display: "grid", gap: 16 }}>
        {offen.map((p) => {
          const anzahl = db.bewerbungen.filter((b) => b.projekt_id === p.id).length;
          const dabei = beworben(p.id);
          return (
            <Card key={p.id} hover style={{ padding: "26px 30px", display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr auto", gap: 22, alignItems: "center", cursor: "pointer" }}>
              <div onClick={() => go("arch-auktion", { projektId: p.id })}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge farbe={T.red}>{p.art}</Badge>{dabei && <Badge farbe={T.green}>beworben</Badge>}</div>
                <h3 style={{ fontFamily: serif, fontSize: 23, fontWeight: 600 }}>{p.titel}</h3>
                <div style={{ fontSize: 13, color: T.muted, marginTop: 3 }}>{p.ort} {p.kanton} · {p.nutzung}</div>
              </div>
              <Stat label="Bausumme" wert={CHF(p.budget_chf)} klein />
              <Stat label="Mitbewerber" wert={`${anzahl} Büros`} klein farbe={T.green} />
              <Stat label="Frist Runde 1" wert={DATUM(p.frist_runde1)} klein />
              <Btn variant={dabei ? "quiet" : "green"} style={{ padding: "11px 20px" }} onClick={() => go("arch-auktion", { projektId: p.id })}>{dabei ? "Ansehen" : "Bewerben →"}</Btn>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
//  ARCHITEKT — AUKTIONSDETAIL (öffentlich / mit Vollzugriff)
// ============================================================
function ArchitektAuktionDetail({ db, user, route, go, refresh }) {
  const p = db.projekte.find((x) => x.id === route.projektId);
  const [angForm, setAngForm] = useState(false);
  const [ang, setAng] = useState({ honorar_chf: "", honorarmodell: p?.honorarmodell || "SIA 102", leistungsumfang: "", termin: "", gueltig_bis: "" });
  if (!p) return <section style={{ padding: 60 }}>Nicht gefunden.</section>;
  const meineBew = db.bewerbungen.find((b) => b.projekt_id === p.id && b.architekt_id === user.id);
  const granted = !!db.access.find((a) => a.projekt_id === p.id && a.architekt_id === user.id && a.status === "granted");
  const meinAngebot = meineBew && db.angebote.find((x) => x.bewerbung_id === meineBew.id);
  const anzahl = db.bewerbungen.filter((b) => b.projekt_id === p.id).length;

  const sichtbareDateien = (p.dateien || []).filter((d) => d.oeffentlich || granted);

  const angebotAbgeben = () => {
    db.angebote.push({ id: uid("a"), bewerbung_id: meineBew.id, honorar_chf: +ang.honorar_chf || 0, ...ang, verbindlich: true });
    refresh(); setAngForm(false);
  };

  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 30px 80px" }}>
      <span className="ul" onClick={() => go(meineBew ? "arch-dash" : "arch-auktionen")} style={{ fontSize: 13, color: T.muted }}>← Zurück</span>
      <div style={{ display: "flex", gap: 8, margin: "16px 0 10px" }}>
        <Badge farbe={T.red}>{p.art}</Badge>
        {granted ? <Badge farbe={T.green} gefüllt>Vollzugriff gewährt</Badge> : <Badge farbe={T.gold}>Öffentliche Eckdaten</Badge>}
      </div>
      <h1 style={{ fontFamily: serif, fontSize: 46, fontWeight: 500 }}>{p.titel}</h1>
      <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>{granted ? `${p.adresse}, ${p.plz} ${p.ort}` : `${p.ort} ${p.kanton}`} · Frist Runde 1: {DATUM(p.frist_runde1)}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 40, marginTop: 30 }}>
        <div>
          {/* Eckdaten */}
          <Card style={{ padding: 26 }}>
            <H6>Öffentliche Eckdaten</H6>
            <Grid2>
              <Info l="Nutzung" v={p.nutzung} />
              <Info l="Bausumme" v={CHF(p.budget_chf)} />
              <Info l="Grundstück" v={p.grundstueck_m2 ? `${p.grundstueck_m2} m²` : "—"} />
              <Info l="GFZ" v={p.gfz || "—"} />
              <Info l="Einheiten" v={p.anzahl_einheiten || "—"} />
              <Info l="Energiestandard" v={p.energiestandard || "—"} />
              <Info l="Honorarmodell" v={p.honorarmodell} />
              <Info l="Zonenplan" v={p.zonenplan || "—"} />
              <Info l="Kanton" v={p.kanton} />
            </Grid2>
            <H6 style={{ marginTop: 18 }}>Beschreibung</H6>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{p.beschreibung}</p>
            {p.raumprogramm && <><H6 style={{ marginTop: 16 }}>Raumprogramm</H6><p style={{ fontSize: 14, lineHeight: 1.7 }}>{p.raumprogramm}</p></>}
          </Card>

          {/* Vertrauliche Angaben nur bei Vollzugriff */}
          {granted && (
            <Card style={{ padding: 26, marginTop: 16, borderColor: T.green + "66" }}>
              <H6 style={{ color: T.green }}>Vertrauliche Angaben (freigegeben)</H6>
              <Grid2>
                <Info l="Adresse" v={`${p.adresse}, ${p.plz} ${p.ort}`} />
                <Info l="Parzelle" v={p.parzelle_nr} />
                <Info l="Baurecht" v={p.baurecht} />
                <Info l="Bewilligungsstand" v={p.bewilligungsstand} />
              </Grid2>
              {p.auflagen && <><H6 style={{ marginTop: 14 }}>Auflagen</H6><p style={{ fontSize: 14, lineHeight: 1.7 }}>{p.auflagen}</p></>}
            </Card>
          )}

          {/* Dateien */}
          <Card style={{ padding: 26, marginTop: 16 }}>
            <H6>Dossier-Dateien {granted ? "" : "(öffentlich sichtbar)"}</H6>
            {sichtbareDateien.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", border: `1px solid ${T.line}`, marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}><Badge farbe={T.muted}>{d.kategorie}</Badge><span style={{ fontSize: 14 }}>{d.dateiname}</span></div>
                <span className="ul" style={{ fontSize: 12, color: T.green }} onClick={() => alert("Signierte Download-URL (5 Min. gültig) würde hier geöffnet.")}>herunterladen ↓</span>
              </div>
            ))}
            {!granted && (p.dateien || []).some((d) => !d.oeffentlich) && (
              <div style={{ padding: 16, border: `1px dashed ${T.line}`, fontSize: 13, color: T.muted, textAlign: "center", marginTop: 4 }}>
                🔒 {(p.dateien || []).filter((d) => !d.oeffentlich).length} weitere vertrauliche Dokumente — sichtbar nach Freigabe durch die Bauherrschaft.
              </div>
            )}
          </Card>
        </div>

        {/* Aktionsspalte */}
        <div>
          <div style={{ position: "sticky", top: 90 }}>
            <Card style={{ padding: 26, background: T.ink, color: T.paper, border: "none" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.goldSoft }}>Mitbewerber im Rennen</div>
              <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 600 }}>{anzahl} Büros</div>

              {!meineBew && (
                <>
                  <p style={{ fontSize: 13, color: "#cfc8ba", marginTop: 14, lineHeight: 1.6 }}>Reichen Sie Ihr Bewerbungsschreiben mit unverbindlicher Richtofferte ein.</p>
                  <div style={{ fontSize: 12, color: "#a39c8e", margin: "12px 0" }}>
                    Teilnahme: {ARCH_ABO.includes(user.plan) ? "im Abo enthalten" : `${CHF(290)} + MWST`}
                  </div>
                  <Btn variant="gold" style={{ width: "100%" }} onClick={() => go("arch-bewerbung", { projektId: p.id })}>Jetzt bewerben</Btn>
                </>
              )}

              {meineBew && (
                <div style={{ marginTop: 14 }}>
                  <Badge farbe={STATUS_LABEL[meineBew.status][1]} gefüllt>{STATUS_LABEL[meineBew.status][0]}</Badge>
                  <div style={{ fontSize: 13, color: "#cfc8ba", marginTop: 14 }}>Ihre Richtofferte</div>
                  <div style={{ fontFamily: serif, fontSize: 22 }}>{CHF(meineBew.richt_honorar_von)} – {CHF(meineBew.richt_honorar_bis)}</div>

                  {granted && !meinAngebot && (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #33302a" }}>
                      <div style={{ fontSize: 13, color: T.goldSoft }}>✓ Dossier freigegeben — Runde 2 offen</div>
                      <Btn variant="gold" style={{ width: "100%", marginTop: 10 }} onClick={() => setAngForm(true)}>Verbindliches Angebot abgeben</Btn>
                    </div>
                  )}
                  {meinAngebot && (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #33302a" }}>
                      <div style={{ fontSize: 13, color: T.goldSoft }}>Verbindliches Angebot abgegeben</div>
                      <div style={{ fontFamily: serif, fontSize: 26, marginTop: 4 }}>{CHF(meinAngebot.honorar_chf)}</div>
                      <div style={{ fontSize: 12, color: "#a39c8e", marginTop: 4 }}>gültig bis {DATUM(meinAngebot.gueltig_bis)}</div>
                    </div>
                  )}
                  {!granted && meineBew.status !== "zuschlag" && meineBew.status !== "abgelehnt" && (
                    <div style={{ fontSize: 12, color: "#a39c8e", marginTop: 16, lineHeight: 1.5 }}>Warten auf Dossier-Freigabe durch die Bauherrschaft, um in Runde 2 ein verbindliches Angebot abzugeben.</div>
                  )}
                  {meineBew.status === "zuschlag" && <div style={{ marginTop: 16, color: T.goldSoft, fontFamily: serif, fontSize: 20 }}>★ Zuschlag erhalten</div>}
                  {meineBew.status === "abgelehnt" && <div style={{ marginTop: 16, fontSize: 13, color: "#c98" }}>Leider nicht berücksichtigt.</div>}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Angebots-Modal Runde 2 */}
      {angForm && (
        <Overlay onClose={() => setAngForm(false)}>
          <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 600 }}>Verbindliches Angebot · Runde 2</h2>
          <p style={{ fontSize: 13, color: T.muted, margin: "6px 0 18px" }}>Auf Basis der vollständigen Unterlagen. Rechtsverbindlich nach OR.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
            <Feld halb label="Honorar (CHF)" type="number" value={ang.honorar_chf} onChange={(v) => setAng({ ...ang, honorar_chf: v })} placeholder="630000" />
            <Feld halb label="Honorarmodell" options={["SIA 102", "SIA 103", "Pauschal", "Nach Aufwand"]} value={ang.honorarmodell} onChange={(v) => setAng({ ...ang, honorarmodell: v })} />
            <Feld halb label="Termin / Bauzeit" value={ang.termin} onChange={(v) => setAng({ ...ang, termin: v })} placeholder="22 Monate" />
            <Feld halb label="Gültig bis" type="date" value={ang.gueltig_bis} onChange={(v) => setAng({ ...ang, gueltig_bis: v })} />
            <Feld voll label="Leistungsumfang" textarea value={ang.leistungsumfang} onChange={(v) => setAng({ ...ang, leistungsumfang: v })} placeholder="Abgedeckte SIA-Phasen, Leistungen, Vorbehalte." />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => setAngForm(false)}>Abbrechen</Btn>
            <Btn variant="gold" disabled={!ang.honorar_chf} onClick={angebotAbgeben}>Verbindlich einreichen</Btn>
          </div>
        </Overlay>
      )}
    </section>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,24,20,.55)", zIndex: 100, display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.paper, padding: 36, maxWidth: 640, width: "100%", borderRadius: 4, boxShadow: "0 40px 90px -30px rgba(0,0,0,.5)" }}>{children}</div>
    </div>
  );
}
// ============================================================
//  BEWERBUNGSFORMULAR — Bewerbungsschreiben + unverbindliche Richtofferte
// ============================================================
function BewerbungFormular({ db, user, route, go, refresh }) {
  const p = db.projekte.find((x) => x.id === route.projektId);
  const [f, setF] = useState({ motivation: "", team: "", richt_honorar_von: "", richt_honorar_bis: "", richt_termin: "", honorar_hinweis: "" });
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const gebuehr = ARCH_ABO.includes(user.plan) ? 0 : 290;
  if (!p) return <section style={{ padding: 60 }}>Nicht gefunden.</section>;

  const einreichen = () => {
    const neu = {
      id: uid("b"), projekt_id: p.id, architekt_id: user.id, status: "eingereicht",
      motivation: f.motivation, team: f.team,
      referenzen: [],
      richt_honorar_von: +f.richt_honorar_von || 0, richt_honorar_bis: +f.richt_honorar_bis || 0,
      richt_termin: f.richt_termin, honorar_hinweis: f.honorar_hinweis, unverbindlich: true,
      erstellt_am: new Date().toISOString(), teilnahme_bezahlt: gebuehr === 0,
    };
    db.bewerbungen.push(neu);
    if (gebuehr > 0) (db.zahlungen || (db.zahlungen = [])).push({ id: uid("z"), organisation_id: user.id, betrag_chf: 290, zweck: "teilnahmegebuehr", referenz_id: neu.id, status: "bezahlt" });
    refresh();
    go("arch-auktion", { projektId: p.id });
  };

  const gültig = f.motivation.length > 20 && f.richt_honorar_von;

  return (
    <section style={{ maxWidth: 820, margin: "0 auto", padding: "40px 30px 80px" }}>
      <span className="ul" onClick={() => go("arch-auktion", { projektId: p.id })} style={{ fontSize: 13, color: T.muted }}>← Zurück zur Auktion</span>
      <div style={{ marginTop: 14 }}><Badge farbe={T.green}>Runde 1 — Bewerbung</Badge></div>
      <h1 style={{ fontFamily: serif, fontSize: 42, fontWeight: 500, margin: "12px 0 4px" }}>Bewerbung einreichen</h1>
      <div style={{ fontSize: 14, color: T.muted, marginBottom: 8 }}>für: {p.titel}</div>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, marginBottom: 24, maxWidth: 660 }}>
        Dies ist <strong>kein verbindliches Angebot</strong>, sondern ein Bewerbungsschreiben mit einer unverbindlichen Richtofferte auf Basis der öffentlichen Eckdaten. Überzeugt Ihre Bewerbung, gewährt die Bauherrschaft Ihnen Zugriff auf das vollständige Dossier — dann reichen Sie in Runde 2 Ihr verbindliches Angebot ein.
      </p>

      <Card style={{ padding: 32 }}>
        <Feld voll label="Bewerbungsschreiben / Motivation *" textarea value={f.motivation} onChange={set("motivation")} placeholder="Warum ist Ihr Büro das richtige für dieses Projekt? Skizzieren Sie Ihre Herangehensweise, relevante Erfahrung und gestalterische Haltung." />
        <Feld voll label="Vorgesehenes Team" value={f.team} onChange={set("team")} placeholder="Projektleitung, Bauleitung, beigezogene Fachplaner." />

        <H6 style={{ marginTop: 18 }}>Unverbindliche Richtofferte</H6>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
          <Feld halb label="Honorar von (CHF) *" type="number" value={f.richt_honorar_von} onChange={set("richt_honorar_von")} placeholder="590000" />
          <Feld halb label="Honorar bis (CHF)" type="number" value={f.richt_honorar_bis} onChange={set("richt_honorar_bis")} placeholder="660000" />
          <Feld voll label="Geschätzter Termin / Bauzeit" value={f.richt_termin} onChange={set("richt_termin")} placeholder="z.B. 22 Monate ab Baufreigabe" />
          <Feld voll label="Annahmen & Vorbehalte" textarea value={f.honorar_hinweis} onChange={set("honorar_hinweis")} placeholder="Auf welchen Annahmen beruht Ihre Schätzung? Was wird erst nach Sichtung der Volldokumente definitiv?" />
        </div>

        <div style={{ marginTop: 20, padding: 18, background: T.paper2, borderRadius: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>Teilnahmegebühr</span><span>{gebuehr === 0 ? "im Abo enthalten" : CHF(290)}</span>
          </div>
          {gebuehr > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.muted, marginTop: 6 }}><span>+ MWST 8.1 %</span><span>{CHF(290 * 0.081)}</span></div>}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <Btn variant="ghost" onClick={() => go("arch-auktion", { projektId: p.id })}>Abbrechen</Btn>
          <Btn variant="green" disabled={!gültig} onClick={einreichen}>Bewerbung einreichen</Btn>
        </div>
        {!gültig && <div style={{ fontSize: 12, color: T.muted, marginTop: 10, textAlign: "right" }}>Bitte Bewerbungsschreiben und mindestens „Honorar von" ausfüllen.</div>}
      </Card>
    </section>
  );
}

export default App;
