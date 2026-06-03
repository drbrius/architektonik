# ARCHITEKTONIK — Backend-Spezifikation

Node.js / Express + PostgreSQL. Produktionsreife Referenz für das zweistufige
Vergabeverfahren (Bewerbung → selektive Dossier-Freigabe → verbindliches Angebot → Vergabe).

Schweizer Standard: CHF, MWST 8.1 %, DSG-konforme Datenhaltung (Daten in CH/EU),
SIA-Honorarordnungen als Referenz, QR-Rechnung/TWINT als Zahlungsmittel.

---

## 1. Architekturüberblick

```
Client (React)  ──HTTPS──▶  Express API  ──▶  PostgreSQL
                                  │
                                  ├─▶ S3-kompatibler Objektspeicher (CH, z.B. Exoscale/Infomaniak)
                                  │     für Dossier-Dateien (Pläne, Gutachten, Fotos)
                                  ├─▶ Stripe / Datatrans (TWINT, Karte, QR-Rechnung)
                                  └─▶ Mail-Versand (transaktional)
```

Zugriff auf vertrauliche Dossier-Dateien immer über **signierte, kurzlebige URLs**,
die nur ausgestellt werden, wenn `dossier_access` für (Projekt, Büro) den Status
`granted` hat. Dateien liegen nie öffentlich.

---

## 2. Datenmodell (PostgreSQL)

```sql
-- ---------- Nutzer & Organisationen ----------
CREATE TYPE rolle AS ENUM ('investor', 'architekt', 'admin');

CREATE TABLE organisation (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rolle         rolle NOT NULL,
  name          TEXT NOT NULL,
  typ           TEXT,                 -- 'Architekturbüro' | 'Entwickler' | 'Pensionskasse' ...
  ort           TEXT,
  kanton        TEXT,
  uid_nummer    TEXT,                 -- CHE-Nummer (Handelsregister)
  gegruendet    INT,
  mitarbeiter   INT,
  tagline       TEXT,
  verifiziert   BOOLEAN DEFAULT FALSE,   -- Kuratierung durch Admin
  erstellt_am   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE benutzer (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES organisation(id) ON DELETE CASCADE,
  email           TEXT UNIQUE NOT NULL,
  passwort_hash   TEXT NOT NULL,
  vorname         TEXT,
  nachname        TEXT,
  erstellt_am     TIMESTAMPTZ DEFAULT now()
);

-- ---------- Abonnements / Zahlungen ----------
CREATE TYPE plan_typ AS ENUM (
  'arch_einzel','arch_atelier','arch_maison',
  'inv_einzel','inv_bauherr','inv_konsortium'
);

CREATE TABLE abonnement (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES organisation(id),
  plan            plan_typ NOT NULL,
  aktiv           BOOLEAN DEFAULT TRUE,
  start_am        TIMESTAMPTZ DEFAULT now(),
  ende_am         TIMESTAMPTZ
);

CREATE TABLE zahlung (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID REFERENCES organisation(id),
  betrag_chf      NUMERIC(12,2) NOT NULL,   -- exkl. MWST
  mwst_chf        NUMERIC(12,2) NOT NULL,   -- 8.1 %
  zweck           TEXT NOT NULL,            -- 'teilnahmegebuehr' | 'ausschreibung' | 'abo'
  referenz_id     UUID,                     -- z.B. bewerbung.id oder projekt.id
  provider        TEXT,                     -- 'stripe' | 'datatrans'
  provider_ref    TEXT,
  status          TEXT DEFAULT 'offen',     -- 'offen' | 'bezahlt' | 'storniert'
  erstellt_am     TIMESTAMPTZ DEFAULT now()
);

-- ---------- Projekt / Dossier (vom Investor) ----------
CREATE TYPE projekt_status AS ENUM (
  'entwurf','offen','bewertung','runde2','vergeben','geschlossen'
);

CREATE TABLE projekt (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id     UUID REFERENCES organisation(id),
  status          projekt_status DEFAULT 'entwurf',

  -- Allgemein
  titel           TEXT NOT NULL,
  art             TEXT,             -- 'Architekturwettbewerb' | 'Generalplaner-Auktion' ...
  beschreibung    TEXT,

  -- Standard-Bauangaben
  adresse         TEXT,
  plz             TEXT,
  ort             TEXT,
  kanton          TEXT,
  parzelle_nr     TEXT,
  grundstueck_m2  NUMERIC(10,2),
  gfz             NUMERIC(4,2),     -- Geschossflächenziffer
  budget_chf      NUMERIC(14,2),
  termin_start    DATE,
  termin_bezug    DATE,

  -- Detaillierte Programmangaben
  nutzung         TEXT,             -- 'Wohnen' | 'Mischnutzung' | 'Gewerbe' ...
  anzahl_einheiten INT,
  wohnungsmix     JSONB,            -- [{typ:'4.5', anzahl:6, flaeche:120}, ...]
  raumprogramm    TEXT,
  energiestandard TEXT,             -- 'Minergie-P' | 'GEAK A' ...

  -- Rechtliches / Bewilligung
  zonenplan       TEXT,             -- z.B. 'W3 Wohnzone'
  baurecht        TEXT,             -- Eigentum | Baurecht | im Stockwerk
  auflagen        TEXT,             -- Denkmalschutz, Gewässerabstand, Lärm ...
  bewilligungsstand TEXT,           -- 'Vorprüfung' | 'Baubewilligung erteilt' ...

  honorarmodell   TEXT,             -- 'SIA 102' | 'Pauschal' | 'nach Aufwand'
  frist_runde1    DATE,
  erstellt_am     TIMESTAMPTZ DEFAULT now()
);

-- Dossier-Dateien (vertraulich, nur via Freigabe sichtbar)
CREATE TABLE dossier_datei (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projekt_id   UUID REFERENCES projekt(id) ON DELETE CASCADE,
  dateiname    TEXT NOT NULL,
  kategorie    TEXT,               -- 'Plan' | 'Gutachten' | 'Foto' | 'Sonstiges'
  storage_key  TEXT NOT NULL,      -- Objektspeicher-Schlüssel
  groesse_byte BIGINT,
  oeffentlich  BOOLEAN DEFAULT FALSE,  -- TRUE = bereits in Runde 1 sichtbar
  erstellt_am  TIMESTAMPTZ DEFAULT now()
);

-- ---------- Runde 1: Bewerbung + Richtofferte ----------
CREATE TYPE bewerbung_status AS ENUM (
  'eingereicht','gesichtet','freigegeben','abgelehnt','finalist','zuschlag'
);

CREATE TABLE bewerbung (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projekt_id      UUID REFERENCES projekt(id) ON DELETE CASCADE,
  architekt_id    UUID REFERENCES organisation(id),
  status          bewerbung_status DEFAULT 'eingereicht',

  -- Bewerbungsschreiben (kein verbindliches Angebot!)
  motivation      TEXT NOT NULL,      -- Warum wir, Herangehensweise
  referenzen      JSONB,              -- ausgewählte Referenzprojekte
  team            TEXT,               -- vorgesehenes Team
  -- Unverbindliche Richtofferte auf Basis öffentlicher Eckdaten
  richt_honorar_von  NUMERIC(12,2),
  richt_honorar_bis  NUMERIC(12,2),
  richt_termin    TEXT,
  honorar_hinweis TEXT,               -- Annahmen / Vorbehalte
  unverbindlich   BOOLEAN DEFAULT TRUE,

  teilnahme_bezahlt BOOLEAN DEFAULT FALSE,  -- Gebühr od. via Abo gedeckt
  erstellt_am     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(projekt_id, architekt_id)
);

-- ---------- Selektive Dossier-Freigabe (pro Büro) ----------
CREATE TYPE access_status AS ENUM ('keine','granted','widerrufen');

CREATE TABLE dossier_access (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  projekt_id    UUID REFERENCES projekt(id) ON DELETE CASCADE,
  architekt_id  UUID REFERENCES organisation(id),
  status        access_status DEFAULT 'keine',
  gewaehrt_am   TIMESTAMPTZ,
  gewaehrt_von  UUID REFERENCES benutzer(id),
  UNIQUE(projekt_id, architekt_id)
);

-- ---------- Runde 2: verbindliches Angebot ----------
CREATE TABLE angebot (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bewerbung_id  UUID REFERENCES bewerbung(id) ON DELETE CASCADE,
  honorar_chf   NUMERIC(12,2) NOT NULL,   -- verbindlich
  honorarmodell TEXT,
  leistungsumfang TEXT,
  termin        TEXT,
  gueltig_bis   DATE,
  verbindlich   BOOLEAN DEFAULT TRUE,
  erstellt_am   TIMESTAMPTZ DEFAULT now()
);

-- ---------- Bewertungen ----------
CREATE TABLE bewertung (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  architekt_id  UUID REFERENCES organisation(id),
  projekt_id    UUID REFERENCES projekt(id),
  sterne        NUMERIC(2,1),
  kommentar     TEXT,
  erstellt_am   TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Statusfluss

```
PROJEKT:  entwurf ─▶ offen ─▶ bewertung ─▶ runde2 ─▶ vergeben ─▶ geschlossen

BEWERBUNG: eingereicht ─▶ gesichtet ─┬─▶ freigegeben ─▶ finalist ─▶ zuschlag
                                     └─▶ abgelehnt

DOSSIER-ACCESS:  keine ─▶ granted ─▶ (optional) widerrufen
```

Wichtig: In `offen`/`bewertung` sieht der Architekt **nur** öffentliche Eckdaten und
Dateien mit `oeffentlich = TRUE`. Erst `dossier_access = granted` schaltet die
vollständigen Dateien frei. Der Investor entscheidet pro Büro einzeln (`grantAccess`).

---

## 4. REST-API (Auszug)

Alle Routen unter `/api/v1`. Auth via JWT (Bearer). Rollen-Middleware prüft `req.user.rolle`.

### Auth
```
POST   /auth/register          { rolle, organisation{...}, email, passwort }
POST   /auth/login             { email, passwort } -> { token }
GET    /auth/me                -> aktuelle Org + Abo
```

### Projekte (Investor)
```
POST   /projekte                          Dossier anlegen (status=entwurf)
PATCH  /projekte/:id                       Felder aktualisieren
POST   /projekte/:id/publizieren           entwurf -> offen (prüft Zahlung/Abo)
GET    /projekte/:id                        eigenes vollständiges Dossier
GET    /projekte/mine                        Liste eigener Projekte + Kennzahlen
POST   /projekte/:id/dateien                 Multipart-Upload -> dossier_datei
DELETE /projekte/:id/dateien/:dateiId
POST   /projekte/:id/vergeben                { bewerbungId } -> Zuschlag
```

### Auktionen / öffentliche Sicht (Architekt)
```
GET    /auktionen                            offene Projekte, NUR Eckdaten
GET    /auktionen/:id                         öffentliches Dossier (+ Mitbewerberzahl,
                                              KEINE fremden Honorare)
```

### Bewerbung — Runde 1 (Architekt)
```
POST   /auktionen/:id/bewerbung              { motivation, referenzen, team,
                                              richt_honorar_von, richt_honorar_bis,
                                              richt_termin, honorar_hinweis }
                                              -> erzeugt Zahlung (Teilnahmegebühr)
                                              falls kein aktives Abo
GET    /bewerbungen/mine                       eigene Bewerbungen + Status
```

### Sichtung & Freigabe — Investor
```
GET    /projekte/:id/bewerbungen              alle Bewerbungen (mit Richtofferten;
                                              nur Investor sieht Beträge)
PATCH  /bewerbungen/:id/status                { status }  (gesichtet/abgelehnt/finalist)
POST   /projekte/:id/access                   { architektId } -> dossier_access=granted
DELETE /projekte/:id/access/:architektId       -> widerrufen
```

### Dossier-Dateien (geschützt)
```
GET    /projekte/:id/dateien                  Investor: alle;
                                              Architekt: oeffentlich=TRUE ODER access=granted
GET    /dateien/:dateiId/url                  signierte URL, 5 Min gültig.
                                              403 wenn kein granted-Access.
```

### Angebot — Runde 2 (freigegebener Architekt)
```
POST   /bewerbungen/:id/angebot               { honorar_chf, honorarmodell,
                                              leistungsumfang, termin, gueltig_bis }
                                              -> nur wenn dossier_access=granted
```

---

## 5. Zugriffsschutz für Dateien (Kernlogik)

```js
// GET /dateien/:dateiId/url
async function dateiUrl(req, res) {
  const datei = await db.dossierDatei(req.params.dateiId);
  const projekt = await db.projekt(datei.projekt_id);

  const istInvestor = req.user.organisation_id === projekt.investor_id;
  let erlaubt = istInvestor || datei.oeffentlich;

  if (!erlaubt && req.user.rolle === 'architekt') {
    const acc = await db.dossierAccess(projekt.id, req.user.organisation_id);
    erlaubt = acc && acc.status === 'granted';
  }
  if (!erlaubt) return res.status(403).json({ fehler: 'Kein Zugriff auf dieses Dokument' });

  const url = await storage.signedUrl(datei.storage_key, { expiresIn: 300 });
  res.json({ url });
}
```

---

## 6. Zahlungslogik (Teilnahmegebühr / Abo)

```js
// Bei POST /auktionen/:id/bewerbung
async function darfBewerben(orgId) {
  const abo = await db.aktivesAbo(orgId);
  if (abo && ['arch_atelier','arch_maison'].includes(abo.plan))
    return { gedeckt: true };               // Teilnahme im Abo enthalten
  return { gedeckt: false, gebuehr: 290 };  // CHF 290 + 8.1 % MWST
}
```

Analog für Investoren: `inv_bauherr`/`inv_konsortium` decken unbegrenzte
Ausschreibungen; sonst CHF 1'500 pro Projekt bei `publizieren`.

---

## 7. Sicherheit & Compliance

- Passwörter: Argon2id. JWT kurzlebig + Refresh-Token.
- Datenhaltung in CH/EU (DSG / DSGVO). Recht auf Auskunft & Löschung.
- Dossier-Dateien nie öffentlich; ausschliesslich signierte URLs mit Ablauf.
- Audit-Log für jede Access-Gewährung/-Widerruf (wer, wann, welches Büro).
- Rate-Limiting auf Auth- und Upload-Routen.
- Verbindliche Angebote (Runde 2) sind nach OR rechtsverbindlich → Versionierung & Zeitstempel.
