# Architektonik

Die kuratierte **Schweizer Vergabe-Plattform** für Architektur,
Immobilienentwicklung und Bauherrschaft.

Investoren und Bauherren schreiben Projekte aus; Architekturbüros und Entwickler
bewerben sich, erhalten selektiven Zugriff auf das vollständige Dossier und reichen
in einer zweiten Runde ein verbindliches Angebot ein.

> **Hinweis:** Diese Version ist eine voll funktionsfähige **Vorführversion**. Sie
> speichert Daten im Browser des jeweiligen Besuchers (localStorage). Für den echten
> Mehrbenutzer-Betrieb werden Login, gemeinsamer Datenspeicher und Bezahlung über
> Supabase und Stripe ergänzt — Schritt für Schritt beschrieben in der beiliegenden
> Anleitung (`anleitung-plattform-starten.md`).

---

## Schnellstart (auf dem eigenen Computer)

Voraussetzung: [Node.js](https://nodejs.org) (Version „LTS") ist installiert.

```bash
npm install      # einmalig: Hilfsteile laden
npm run dev      # Entwicklungsserver starten
```

Danach im Terminal den angezeigten Link öffnen (meist http://localhost:5173).

## Ins Internet stellen

Am einfachsten über [Vercel](https://vercel.com): GitHub-Konto verbinden, dieses
Repository importieren, **Deploy** klicken. Vercel erkennt das Vite-Projekt
automatisch — es sind keine Einstellungen nötig.

Ausführliche, anfängerfreundliche Anleitung dazu: siehe
`anleitung-plattform-starten.md` (Etappe B).

---

## Befehle

| Befehl            | Wirkung                                            |
|-------------------|----------------------------------------------------|
| `npm run dev`     | Entwicklungsserver (lokal, lädt automatisch neu)   |
| `npm run build`   | Erstellt die optimierte Version für das Internet   |
| `npm run preview` | Zeigt die gebaute Version lokal an                 |
| `npm run lint`    | Prüft den Code auf Fehler                          |

## Projektstruktur

```
architektonik/
├── index.html              Einstiegspunkt der Webseite
├── src/
│   ├── App.jsx             Die gesamte App (Logik + Aussehen)
│   ├── main.jsx            Startet die App
│   └── index.css           Minimale globale Stile
├── api/
│   └── checkout.js         Stripe-Bezahlfunktion (optional, Etappe E)
├── .env.example            Vorlage für die Schlüssel-Datei .env
├── .gitignore              Was NICHT zu GitHub hochgeladen wird (z.B. .env)
├── package.json            Projekt-Angaben und Abhängigkeiten
└── vite.config.js          Bau-Werkzeug-Einstellungen
```

## Nächste Ausbaustufen

- **Login + Datenspeicher (Supabase):** Anleitung, Etappe D.
- **Zahlungen, inkl. TWINT (Stripe):** Anleitung, Etappe E.
- **Datenmodell / Backend-Bauplan:** Datei `backend-spec.md`.

---

© 2026 Architektonik · Schweiz · Preise exkl. 8.1 % MWST · DSG-konform
