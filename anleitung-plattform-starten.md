# ARCHITEKTONIK — Schritt-für-Schritt-Anleitung
### Wie du deine Plattform zum Leben erweckst (für Menschen ohne IT-Erfahrung)

Diese Anleitung erklärt **jeden einzelnen Schritt** so, als hättest du noch nie
programmiert. Du musst nichts auswendig wissen. Lies langsam, mach einen Schritt
nach dem anderen, und hak ihn ab, bevor du weitergehst.

> **Wichtig zum Verständnis vorab:** Was du jetzt hast, sind zwei Dateien:
> 1. Eine **App-Datei** (`architektonik-plattform.jsx`) — das ist das *Aussehen und
>    Verhalten* der Webseite, das was Besucher sehen und anklicken.
> 2. Eine **Backend-Beschreibung** (`backend-spec.md`) — das ist der *Bauplan* für
>    den unsichtbaren Teil, der später Daten dauerhaft speichert (Konten, Projekte,
>    Bewerbungen). Den brauchst du erst in der „grossen" Ausbaustufe.
>
> Wir gehen in **drei Etappen** vor — von „heute noch sichtbar" bis „echte Firma":
>
> - **Etappe A:** Die App auf deinem eigenen Computer ansehen (heute, gratis).
> - **Etappe B:** Die App ins Internet stellen, damit andere sie unter einer
>   Adresse sehen können (ca. 1 Stunde, gratis möglich).
> - **Etappe C:** Aus der Vorführ-Version ein echtes Geschäft machen — mit echten
>   Konten, Bezahlung und Datenspeicher (hier holst du dir Hilfe dazu).

---

## Bevor du anfängst: ein paar Wörter, die immer wiederkommen

Damit du nicht stolperst, hier die wichtigsten Begriffe in einfachen Worten:

- **Datei:** Ein einzelnes Dokument auf dem Computer, wie ein Word-Dokument — nur
  dass hier Programm-Text drinsteht statt eines Briefes.
- **Ordner / Verzeichnis:** Eine Schublade, in der Dateien liegen.
- **Terminal** (auch „Eingabeaufforderung" oder „Kommandozeile"): Ein einfaches
  schwarzes oder weisses Fenster, in das man **Befehle tippt**, statt mit der Maus
  zu klicken. Klingt furchteinflössend, ist aber nur ein Textfenster. Du tippst eine
  Zeile, drückst Enter, fertig.
- **Code / Quelltext:** Der Text in den Programmier-Dateien. Das ist die „Sprache",
  in der die App geschrieben ist.
- **Browser:** Dein Internet-Programm (Chrome, Safari, Firefox, Edge).
- **Lokal:** „Auf deinem eigenen Computer", nur für dich sichtbar.
- **Online / live / deployen:** „Im Internet veröffentlicht", für andere sichtbar.
- **Backend:** Der unsichtbare Teil im Hintergrund, der Daten speichert und sich
  Dinge merkt (z. B. wer eingeloggt ist). Aktuell merkt sich die App Dinge nur im
  Browser — das reicht zum Vorführen, aber nicht für echten Betrieb.

Atme durch. Es kann nichts kaputtgehen. Wenn etwas nicht klappt, kannst du jeden
Schritt einfach wiederholen.

---

# ETAPPE A — Die App auf deinem eigenen Computer ansehen

Ziel: Du siehst die Plattform in deinem Browser laufen, auf deinem Rechner, nur für
dich. Das ist die Grundlage für alles Weitere.

## Schritt A1 — Das Programm „Node" installieren

Die App ist in einer Sprache geschrieben, die ein Hilfsprogramm namens **Node.js**
versteht. Stell dir Node wie den Motor vor, der die App startet. Den brauchst du
einmalig.

1. Öffne deinen Browser und gehe auf: **https://nodejs.org**
2. Du siehst dort zwei grosse Knöpfe. Klick auf den, bei dem **„LTS"** steht
   (das heisst „besonders stabil"). Es lädt eine Installationsdatei herunter.
3. Öffne die heruntergeladene Datei (Doppelklick) und klick dich durch die
   Installation: immer „Weiter" / „Next" / „Akzeptieren", nichts ändern.
4. Fertig. Du musst Node nie direkt öffnen — es läuft im Hintergrund mit.

✅ **Abhaken, wenn:** Die Installation ohne Fehlermeldung „Fertig" gemeldet hat.

## Schritt A2 — Das Terminal öffnen (das Textfenster)

Du brauchst jetzt einmal dieses Textfenster, in das man Befehle tippt.

**Auf Windows:**
- Drück die **Windows-Taste**, tippe das Wort `cmd`, drück **Enter**.
- Es öffnet sich ein schwarzes Fenster. Das ist das Terminal.

**Auf einem Mac:**
- Drück **Cmd + Leertaste** (das öffnet die Suche), tippe `Terminal`, drück **Enter**.
- Es öffnet sich ein Fenster. Das ist das Terminal.

## Schritt A3 — Prüfen, ob Node wirklich da ist

Tippe in das Terminal genau das hier und drück Enter:

```
node --version
```

Wenn eine Zahl erscheint (z. B. `v20.11.0`), ist alles gut. Node ist installiert.
Wenn eine Fehlermeldung kommt, starte den Computer neu und versuch es nochmal.

✅ **Abhaken, wenn:** Eine Versionsnummer angezeigt wird.

## Schritt A4 — Das Grundgerüst der App erstellen

Die App-Datei, die du hast, braucht ein „Zuhause" — eine kleine Projekt-Struktur
drumherum, damit der Motor weiss, wie er sie starten soll. Es gibt ein fertiges
Werkzeug, das dieses Zuhause in einem Rutsch baut. Es heisst **Vite** (sprich:
„Wiet"). Du musst nichts verstehen, nur abtippen.

Tippe Zeile für Zeile (jede Zeile mit Enter abschliessen, abwarten bis sie fertig ist):

```
npm create vite@latest architektonik -- --template react
```

> Falls es fragt „Ok to proceed?", tippe `y` und Enter.

Dann:

```
cd architektonik
```

> `cd` heisst „geh in den Ordner". Du bist jetzt **in** deinem Projektordner.

Dann:

```
npm install
```

> Das lädt alle Hilfsteile herunter, die die App braucht. Kann ein, zwei Minuten
> dauern und viele Textzeilen ausspucken — das ist normal. Warte, bis es fertig ist
> und du wieder tippen kannst.

✅ **Abhaken, wenn:** `npm install` durchgelaufen ist (keine roten „ERROR"-Zeilen
ganz am Ende).

## Schritt A5 — Deine App-Datei einsetzen

Jetzt tauschen wir die Beispiel-Datei, die Vite erstellt hat, gegen **deine** App aus.

1. Öffne den Ordner **`architektonik`** im normalen Datei-Explorer (Windows) bzw.
   Finder (Mac). Du findest ihn dort, wo dein Terminal gerade „steht" — meist im
   Benutzer-Ordner (z. B. `C:\Users\DeinName\architektonik` oder
   `/Users/DeinName/architektonik`).
2. Geh in den Unterordner **`src`** (steht für „source", also Quelltext).
3. Dort liegt eine Datei namens **`App.jsx`**. **Lösche** sie.
4. Kopiere deine Datei **`architektonik-plattform.jsx`** in genau diesen `src`-Ordner.
5. **Benenne** deine kopierte Datei um in: **`App.jsx`**
   (Rechtsklick → Umbenennen. Achte auf die grosse Schreibweise und die Endung
   `.jsx`.)

> Warum? Die App startet immer eine Datei namens `App.jsx`. Indem du deine Datei so
> nennst, sagst du: „Nimm meine."

6. In demselben `src`-Ordner liegt eventuell eine Datei `App.css`. Falls ja, öffne
   sie mit einem einfachen Texteditor (Editor/TextEdit) und **lösche allen Inhalt**
   (alles markieren, löschen, speichern). Sie darf leer sein — unsere App bringt ihr
   Aussehen selbst mit.

✅ **Abhaken, wenn:** Im Ordner `src` deine App jetzt als `App.jsx` liegt.

## Schritt A6 — Die App starten und ansehen

Zurück ins Terminal (das Fenster von vorher — es steht noch im Ordner
`architektonik`). Tippe:

```
npm run dev
```

Nach ein paar Sekunden erscheint eine Zeile mit einer Adresse, etwa:

```
Local:   http://localhost:5173/
```

- `localhost` heisst „dein eigener Computer".
- Öffne deinen Browser, tippe diese Adresse (z. B. `http://localhost:5173`) in die
  Adresszeile und drück Enter.

🎉 **Deine Plattform läuft!** Du siehst die Startseite, kannst dich als Investor oder
Architekt „anmelden", Projekte ausschreiben, Bewerbungen ansehen usw.

> **Gut zu wissen:** Solange das Terminal-Fenster offen bleibt und `npm run dev`
> läuft, läuft die App. Schliesst du das Fenster, ist die App gestoppt — sie ist dann
> nicht „kaputt", du startest sie einfach mit `npm run dev` wieder.
>
> **Wenn du etwas am Text der App änderst und speicherst,** aktualisiert sich der
> Browser automatisch. So kannst du gefahrlos experimentieren.

✅ **Etappe A geschafft!** Du hast die App auf deinem Rechner live gesehen.

---

# ETAPPE B — Die App ins Internet stellen

Ziel: Eine echte Internet-Adresse (Link), die du Leuten schicken kannst, damit sie
deine Plattform im Browser ansehen. Immer noch die Vorführ-Version (sie speichert
Daten noch nicht dauerhaft auf einem Server), aber für andere sichtbar — ideal, um
sie Partnern, Investoren oder Testnutzern zu zeigen.

Wir nutzen dafür einen kostenlosen Dienst namens **Vercel** (sprich „Wör-sell").
Er nimmt deine App und macht daraus eine echte Webseite. Es gibt zwei Wege — wähle
**Weg 1**, er ist für Anfänger am einfachsten.

## Weg 1 (empfohlen): Über die Webseite, ohne weitere Befehle

Dieser Weg läuft über einen „Code-Aufbewahrungsort" namens **GitHub**. Das ist wie
eine Cloud (à la Dropbox), aber speziell für Programm-Dateien. Vercel holt sich
deine App von dort.

### Schritt B1 — Kostenloses GitHub-Konto anlegen
1. Geh auf **https://github.com** und klick „Sign up" (Registrieren).
2. E-Mail, Passwort, Benutzername wählen. Bestätige die E-Mail. Fertig.

### Schritt B2 — Deinen Projektordner zu GitHub hochladen
Die bequemste Variante ohne Befehle ist das Programm **GitHub Desktop**:
1. Lade es von **https://desktop.github.com** herunter und installiere es.
2. Öffne es, melde dich mit deinem GitHub-Konto an.
3. Klick auf **„File" → „Add Local Repository"** und wähle deinen Ordner
   `architektonik` aus.
4. Falls es sagt, das sei „kein Repository", klick auf den angebotenen Knopf
   **„create a repository"** (Repository = der Aufbewahrungsort für dein Projekt).
5. Klick unten links auf **„Commit to main"** (das heisst: „Stand sichern").
6. Klick oben auf **„Publish repository"** (das lädt alles zu GitHub hoch).
   - Setz **kein** Häkchen bei „Keep this code private", wenn du willst, dass es
     einfach klappt — oder lass es privat, das geht mit Vercel auch.

✅ **Abhaken, wenn:** Dein Projekt auf github.com unter deinem Konto sichtbar ist.

### Schritt B3 — Mit Vercel veröffentlichen
1. Geh auf **https://vercel.com** und klick „Sign Up". Wähle **„Continue with
   GitHub"** — dann sind die beiden gleich verbunden.
2. Nach der Anmeldung klick **„Add New…" → „Project"**.
3. Vercel zeigt deine GitHub-Projekte. Wähle **`architektonik`** und klick
   **„Import"**.
4. Vercel erkennt automatisch, dass es eine Vite-/React-App ist. Du musst **nichts**
   einstellen. Klick einfach auf **„Deploy"** (Veröffentlichen).
5. Warte ein, zwei Minuten. Dann erscheint **„Congratulations"** und ein Link wie
   `https://architektonik-xxxx.vercel.app`.

🎉 **Das ist deine Live-Adresse.** Klick drauf — deine Plattform ist im Internet.
Diesen Link kannst du jedem schicken.

> **Später Änderungen veröffentlichen:** Du änderst etwas in deinem Ordner, sicherst
> es in GitHub Desktop („Commit" + „Push"), und Vercel aktualisiert die Webseite
> ganz von allein in ein, zwei Minuten. Du musst Schritt B3 nie wiederholen.

## Weg 2 (Alternative): Direkt aus dem Terminal
Falls du GitHub überspringen willst:
1. Im Terminal (im Ordner `architektonik`) tippe: `npm install -g vercel`
2. Dann: `vercel`
3. Beantworte die Fragen mit Enter (Standard übernehmen), beim ersten Mal musst du
   dich per Link im Browser anmelden. Am Ende bekommst du ebenfalls einen Live-Link.

✅ **Etappe B geschafft!** Deine Plattform hat eine echte Internet-Adresse.

---

## Eine eigene Wunsch-Adresse (z. B. www.architektonik.ch)

Die `.vercel.app`-Adresse funktioniert, sieht aber nicht nach Firma aus. So bekommst
du deine eigene:

1. Kauf einen Domainnamen (die Wunsch-Adresse). Für die Schweiz eignen sich Anbieter
   wie **Hostpoint**, **Infomaniak** oder **switch.ch**. Eine `.ch`-Adresse kostet
   meist 10–20 CHF pro Jahr. Du suchst dort z. B. „architektonik.ch" und kaufst sie,
   falls frei.
2. In Vercel: Geh in dein Projekt → **„Settings" → „Domains"**, tippe deine gekaufte
   Adresse ein und klick „Add".
3. Vercel zeigt dir zwei, drei technische Werte (sogenannte „DNS-Einträge"). Die
   kopierst du in die Verwaltungsseite bei deinem Domain-Anbieter (dort heisst der
   Bereich meist „DNS" oder „Nameserver"). Anbieter-Support hilft dir dabei gern —
   sag einfach „Ich möchte meine Domain auf Vercel zeigen lassen".
4. Nach ein paar Stunden ist deine Plattform unter deiner Wunsch-Adresse erreichbar.

---

# ETAPPE C — Aus der Vorführung ein echtes Geschäft machen

Bis hierher hast du eine **funktionierende Vorführung**: Man kann alles anklicken und
durchspielen. Aber: Die Daten leben nur im Browser des jeweiligen Besuchers. Es gibt
noch **kein echtes Login**, **keine echte Bezahlung** und **keinen gemeinsamen
Datenspeicher**, auf den alle Nutzer zugreifen.

Das ist völlig in Ordnung für den Start — viele Gründer zeigen genau so ihre Idee
herum, bevor sie Geld in die Vollversion stecken. Für den echten Betrieb brauchst du
aber diese drei Bausteine. Hier ist, **was sie tun** und **wie du sie bekommst** —
ohne dass du sie selbst programmieren musst.

## Baustein 1 — Datenspeicher & Login (das „Backend")

**Was es tut:** Merkt sich dauerhaft alle Konten, Projekte, Bewerbungen und Dateien
für alle Nutzer gemeinsam. Sorgt dafür, dass sich Leute mit E-Mail und Passwort
anmelden können.

**Der einfachste Weg für Nicht-Profis:** Ein Dienst namens **Supabase**
(https://supabase.com). Er bietet fertig:
- einen Datenspeicher (eine „Datenbank"),
- ein Login-System (Konten mit E-Mail/Passwort) zum Anklicken,
- einen Ablageort für hochgeladene Dateien (Pläne, Gutachten).

Es gibt eine kostenlose Stufe zum Ausprobieren. Die Datei `backend-spec.md`, die du
schon hast, ist die **Bauanleitung dafür**: Sie beschreibt genau, welche „Tabellen"
(Listen für Projekte, Bewerbungen usw.) angelegt werden müssen. Ein Entwickler kann
diese Datei nehmen und das Backend in wenigen Tagen aufsetzen.

## Baustein 2 — Bezahlung (Teilnahmegebühren & Abos)

**Was es tut:** Nimmt echtes Geld entgegen — die CHF 290 pro Auktionsteilnahme, die
CHF 1'500 pro Ausschreibung, die Monatsabos.

**Empfehlung für die Schweiz:**
- **Stripe** (https://stripe.com) — weltweit verbreitet, unterstützt Kreditkarten und
  inzwischen auch **TWINT**. Sehr gut dokumentiert.
- **Datatrans** oder **Payrexx** — Schweizer Anbieter, falls du TWINT und
  QR-Rechnung besonders einfach möchtest.

Du eröffnest dort ein Geschäftskonto (dazu brauchst du Firmenangaben, siehe unten).
Der Entwickler verbindet dann die Bezahl-Knöpfe der App mit diesem Konto.

## Baustein 3 — Jemand, der die Bausteine 1 und 2 einbaut

Das Verbinden von App, Datenspeicher und Bezahlung ist Programmierarbeit. Das ist
der eine Punkt, an dem du **Hilfe holst** — und das ist normal und richtig.

**So findest und beauftragst du gut:**
1. Schreib in einfachen Worten auf, was du willst (du darfst dafür diese Anleitung
   und die Datei `backend-spec.md` weitergeben). Ein guter Auftragstext wäre:
   > „Ich habe eine fertige React-App (Vite) für eine Schweizer Vergabe-Plattform.
   > Gesucht: Anbindung an Supabase (Login + Datenbank + Datei-Upload gemäss
   > beiliegender Spezifikation) und Stripe für Zahlungen (Einzelgebühren + Abos,
   > inkl. TWINT). Die Datenstruktur ist dokumentiert."
2. **Wo suchen:**
   - Schweizer Web-Agenturen (Suche „Webentwicklung Agentur" + deine Stadt).
   - Freelancer-Plattformen wie **Malt**, **Upwork** oder **Fiverr Pro** (dort
     „React + Supabase + Stripe" als Stichworte).
   - Frag im Bekanntenkreis nach „jemandem, der React und Supabase kann".
3. **Worauf achten:** Bitte um ein Festpreis-Angebot für einen klar umrissenen
   ersten Schritt („Login + Projekte speichern + eine Bezahlung funktioniert"). So
   behältst du die Kosten im Griff. Lass dir am Ende die Zugangsdaten zu allen
   Konten (Vercel, Supabase, Stripe, Domain) geben — **die müssen auf deinen Namen
   laufen**, nicht auf den des Entwicklers.

---

# Was du als Gründer parallel erledigen solltest (kein IT-Thema)

Damit aus der Plattform ein seriöses Schweizer Angebot wird:

- **Firma anmelden:** Für Rechnungen und Bezahldienste brauchst du eine Rechtsform
  (z. B. Einzelfirma für den Anfang, später GmbH/AG). Ein Treuhänder hilft dir
  schnell und günstig.
- **AGB & Datenschutzerklärung:** Auf der Plattform werden persönliche Daten und
  vertrauliche Baudossiers verarbeitet. Lass dir von einem Juristen oder über einen
  Schweizer Vorlagen-Dienst rechtssichere Texte erstellen (Stichwort: **DSG**, das
  Schweizer Datenschutzgesetz). Das ist wichtig, weil Büros vertrauliche Pläne
  hochladen.
- **Mehrwertsteuer:** Ab einem gewissen Umsatz wirst du MWST-pflichtig (aktuell
  8.1 %). Dein Treuhänder klärt, ab wann das für dich gilt.
- **Geschäftskonto:** Ein Bankkonto auf die Firma, damit die Zahlungen sauber
  getrennt von deinem Privatkonto eingehen.

---

# Schnell-Übersicht zum Abhaken

**Heute (Etappe A):**
- [ ] Node installiert (A1)
- [ ] Terminal geöffnet, `node --version` zeigt eine Zahl (A2, A3)
- [ ] Projekt mit Vite erstellt, `npm install` lief durch (A4)
- [ ] Eigene Datei als `src/App.jsx` eingesetzt (A5)
- [ ] `npm run dev` gestartet, App im Browser gesehen (A6)

**Diese Woche (Etappe B):**
- [ ] GitHub-Konto erstellt, Projekt hochgeladen (B1, B2)
- [ ] Mit Vercel veröffentlicht, Live-Link erhalten (B3)
- [ ] (optional) eigene `.ch`-Adresse verbunden

**Wenn es ernst wird (Etappe C):**
- [ ] Firma & rechtliche Texte (Treuhänder/Jurist)
- [ ] Entwickler:in beauftragt für Supabase + Stripe (mit `backend-spec.md`)
- [ ] Alle Konten laufen auf deinen/Firmennamen

---

# Wenn etwas klemmt — die häufigsten Stolpersteine

- **„`npm` wird nicht erkannt":** Node war nicht richtig installiert oder der
  Computer wurde nach der Installation nicht neu gestartet. → A1 wiederholen, Rechner
  neu starten.
- **Beim Tippen passiert nichts / falscher Ordner:** Prüfe, ob im Terminal wirklich
  `architektonik` als aktueller Ordner steht. Mit `cd architektonik` gehst du hinein,
  mit `cd ..` eine Ebene zurück.
- **Browser zeigt eine leere weisse Seite:** Meist ein Tippfehler beim Umbenennen.
  Die Datei muss exakt `App.jsx` heissen (grosses A, Endung `.jsx`) und im Ordner
  `src` liegen.
- **Rote Fehlerzeilen nach `npm install`:** Internetverbindung prüfen und den Befehl
  einfach nochmal eingeben. Oft hilft schon der zweite Versuch.
- **Allgemein:** Du kannst jeden Befehl ohne Risiko wiederholen. Im Zweifel
  Terminal-Fenster schliessen, neu öffnen, mit `cd architektonik` zurück ins Projekt
  und weiter.

Du musst nicht alles auf einmal schaffen. Etappe A heute, Etappe B wenn du Lust hast,
Etappe C wenn die Idee Fahrt aufnimmt. Viel Erfolg!


---
---

# ETAPPE D — Supabase einrichten: Login + Datenspeicher + Datei-Ablage

Ziel: Deine Plattform merkt sich Dinge **dauerhaft und für alle Nutzer gemeinsam**.
Echte Konten mit E-Mail/Passwort, gespeicherte Projekte und Bewerbungen, hochgeladene
Pläne und Gutachten.

> **Ehrliche Vorwarnung — bitte lesen:** Etappe A und B konntest du ganz allein
> schaffen. Etappe D ist der erste Teil, der **echte Programmierarbeit** ist. Ich
> erkläre dir alles Schritt für Schritt und gebe dir jeden Text zum Kopieren. Die
> Schritte D1 bis D5 (Konto, Datenbank-Tabellen, Datei-Ablage anlegen) schaffst du
> sehr wahrscheinlich selbst — das ist Anklicken und Einfügen. Ab Schritt D6 (den
> Code der App damit verbinden) wird es anspruchsvoll. Wenn du dort merkst „das ist
> mir zu viel", ist das völlig normal: Dann hast du mit D1–D5 schon die halbe Arbeit
> erledigt und gibst den Rest an eine Entwicklerin (siehe Baustein 3 in Etappe C) —
> das spart ihr Zeit und dir Geld.

## Schritt D1 — Supabase-Konto und Projekt anlegen

1. Geh auf **https://supabase.com** und klick **„Start your project"**. Melde dich
   am einfachsten mit deinem GitHub-Konto an (das hast du in Etappe B schon).
2. Klick **„New Project"**.
3. Fülle aus:
   - **Name:** `architektonik`
   - **Database Password:** Klick auf „Generate a password" und **kopiere das
     Passwort sofort** in eine Notiz, die du sicher aufbewahrst. Du brauchst es
     selten, aber verlieren solltest du es nicht.
   - **Region:** Wähle **„Frankfurt (eu-central-1)"** — das ist von der Schweiz aus
     am nächsten und liegt in der EU (gut für den Datenschutz).
4. Klick **„Create new project"**. Warte 1–2 Minuten, bis es fertig aufgebaut ist.

✅ **Abhaken, wenn:** Du im Supabase-Dashboard (der Verwaltungsseite) deines neuen
Projekts gelandet bist.

## Schritt D2 — Die zwei Zugangsschlüssel deines Projekts notieren

Damit deine App mit Supabase reden darf, braucht sie zwei Angaben. Du findest sie so:

1. Links im Menü auf das Zahnrad **„Project Settings"** klicken.
2. Auf **„API"** klicken.
3. Notiere dir zwei Dinge (kopieren in deine sichere Notiz):
   - **Project URL** — sieht aus wie `https://abcdefg.supabase.co`
   - **anon public** Key — eine sehr lange Zeichenkette (das ist der „öffentliche
     Schlüssel", er darf in der App stehen).

> Es gibt dort auch einen `service_role`-Schlüssel. **Den nimmst du NICHT** und gibst
> ihn niemals in die App oder zu GitHub — er ist wie der Generalschlüssel zum Haus.

## Schritt D3 — Die Tabellen anlegen (das Gerüst für deine Daten)

Eine „Tabelle" ist wie ein Excel-Blatt: eine Liste mit Spalten. Du brauchst je eine
für Organisationen, Projekte, Bewerbungen usw. Du musst das **nicht** von Hand
zusammenklicken — du fügst einen fertigen Text ein, und Supabase baut alles auf einmal.

1. Links im Menü auf **„SQL Editor"** klicken.
2. Klick **„+ New query"**.
3. **Kopiere den gesamten folgenden Block** und füge ihn in das grosse leere Feld ein.

> „SQL" ist einfach die Sprache, in der man einer Datenbank sagt, was sie tun soll.
> Du musst sie nicht verstehen — der Text ist fertig.

```sql
-- ========================================================
--  ARCHITEKTONIK — Datenbank-Aufbau für Supabase
-- ========================================================

-- 1) Organisationen (Büros und Investoren)
create table organisation (
  id           uuid primary key default gen_random_uuid(),
  besitzer     uuid references auth.users(id),  -- wer dieses Konto angelegt hat
  rolle        text not null,                   -- 'investor' oder 'architekt'
  name         text not null,
  typ          text,
  ort          text,
  kanton       text,
  gegruendet   int,
  mitarbeiter  int,
  tagline      text,
  farbe        text default '#3d5a4c',
  verifiziert  boolean default false,
  bewertung    numeric default 0,
  zuschlaege   int default 0,
  plan         text default 'arch_einzel',
  erstellt_am  timestamptz default now()
);

-- 2) Projekte (Dossiers der Investoren)
create table projekt (
  id              uuid primary key default gen_random_uuid(),
  investor_id     uuid references organisation(id) on delete cascade,
  status          text default 'offen',
  titel           text not null,
  art             text,
  beschreibung    text,
  adresse         text,
  plz             text,
  ort             text,
  kanton          text,
  parzelle_nr     text,
  grundstueck_m2  numeric,
  gfz             numeric,
  budget_chf      numeric,
  termin_start    date,
  termin_bezug    date,
  nutzung         text,
  anzahl_einheiten int,
  raumprogramm    text,
  energiestandard text,
  zonenplan       text,
  baurecht        text,
  auflagen        text,
  bewilligungsstand text,
  honorarmodell   text,
  frist_runde1    date,
  erstellt_am     timestamptz default now()
);

-- 3) Dossier-Dateien (Pläne, Gutachten, Fotos)
create table dossier_datei (
  id           uuid primary key default gen_random_uuid(),
  projekt_id   uuid references projekt(id) on delete cascade,
  dateiname    text not null,
  kategorie    text,
  storage_pfad text not null,        -- wo die Datei in der Ablage liegt
  groesse      bigint,
  oeffentlich  boolean default false,
  erstellt_am  timestamptz default now()
);

-- 4) Bewerbungen (Runde 1: Schreiben + Richtofferte)
create table bewerbung (
  id              uuid primary key default gen_random_uuid(),
  projekt_id      uuid references projekt(id) on delete cascade,
  architekt_id    uuid references organisation(id) on delete cascade,
  status          text default 'eingereicht',
  motivation      text not null,
  team            text,
  referenzen      jsonb default '[]',
  richt_honorar_von numeric,
  richt_honorar_bis numeric,
  richt_termin    text,
  honorar_hinweis text,
  unverbindlich   boolean default true,
  erstellt_am     timestamptz default now(),
  unique(projekt_id, architekt_id)
);

-- 5) Dossier-Freigabe (Investor entscheidet pro Büro)
create table dossier_access (
  id            uuid primary key default gen_random_uuid(),
  projekt_id    uuid references projekt(id) on delete cascade,
  architekt_id  uuid references organisation(id) on delete cascade,
  status        text default 'granted',
  gewaehrt_am   timestamptz default now(),
  unique(projekt_id, architekt_id)
);

-- 6) Angebote (Runde 2: verbindlich)
create table angebot (
  id            uuid primary key default gen_random_uuid(),
  bewerbung_id  uuid references bewerbung(id) on delete cascade,
  honorar_chf   numeric not null,
  honorarmodell text,
  leistungsumfang text,
  termin        text,
  gueltig_bis   date,
  verbindlich   boolean default true,
  erstellt_am   timestamptz default now()
);

-- 7) Zahlungen (Protokoll der Gebühren und Abos)
create table zahlung (
  id              uuid primary key default gen_random_uuid(),
  organisation_id uuid references organisation(id),
  betrag_chf      numeric not null,
  mwst_chf        numeric,
  zweck           text not null,     -- 'teilnahmegebuehr' | 'ausschreibung' | 'abo'
  referenz_id     uuid,
  provider        text,
  provider_ref    text,
  status          text default 'offen',
  erstellt_am     timestamptz default now()
);
```

4. Klick rechts unten auf **„Run"** (oder drück Strg+Enter / Cmd+Enter).
5. Es sollte unten **„Success. No rows returned"** erscheinen. Das heisst: alles
   wurde angelegt.

✅ **Abhaken, wenn:** Links unter **„Table Editor"** jetzt die sieben Tabellen
(organisation, projekt, …) auftauchen.

## Schritt D4 — Sicherheitsregeln einschalten (sehr wichtig)

Standardmässig könnte jeder alle Daten lesen. Du willst aber, dass z. B. ein Büro die
vertraulichen Unterlagen eines Investors **nur sieht, wenn es freigegeben wurde**.
Diese Regeln heissen „Row Level Security" (Zugriffsregeln pro Zeile). Auch hier:
fertigen Text einfügen und ausführen.

1. Wieder **„SQL Editor" → „+ New query"**.
2. Diesen Block einfügen und **„Run"** klicken:

```sql
-- Zugriffsregeln aktivieren
alter table organisation     enable row level security;
alter table projekt          enable row level security;
alter table dossier_datei    enable row level security;
alter table bewerbung        enable row level security;
alter table dossier_access   enable row level security;
alter table angebot          enable row level security;
alter table zahlung          enable row level security;

-- Eingeloggte Nutzer dürfen Organisationen sehen (öffentliches Verzeichnis)
create policy "orgs lesbar" on organisation
  for select using (auth.role() = 'authenticated');

-- Nutzer darf die eigene Organisation anlegen/ändern
create policy "eigene org anlegen" on organisation
  for insert with check (auth.uid() = besitzer);
create policy "eigene org aendern" on organisation
  for update using (auth.uid() = besitzer);

-- Offene Projekte sind für alle Eingeloggten sichtbar
create policy "projekte lesbar" on projekt
  for select using (auth.role() = 'authenticated');

-- Investor darf eigene Projekte anlegen/ändern
create policy "projekt anlegen" on projekt
  for insert with check (
    investor_id in (select id from organisation where besitzer = auth.uid())
  );
create policy "projekt aendern" on projekt
  for update using (
    investor_id in (select id from organisation where besitzer = auth.uid())
  );

-- Bewerbungen: Architekt sieht eigene, Investor sieht die zu seinen Projekten
create policy "bewerbungen lesbar" on bewerbung
  for select using (
    architekt_id in (select id from organisation where besitzer = auth.uid())
    or projekt_id in (
      select p.id from projekt p
      join organisation o on o.id = p.investor_id
      where o.besitzer = auth.uid()
    )
  );
create policy "bewerbung einreichen" on bewerbung
  for insert with check (
    architekt_id in (select id from organisation where besitzer = auth.uid())
  );

-- Freigaben und Angebote: für alle Eingeloggten lesbar (vereinfachter Start)
create policy "access lesbar" on dossier_access for select using (auth.role() = 'authenticated');
create policy "access setzen" on dossier_access for insert with check (auth.role() = 'authenticated');
create policy "angebot lesbar" on angebot for select using (auth.role() = 'authenticated');
create policy "angebot abgeben" on angebot for insert with check (auth.role() = 'authenticated');

-- Dateien: öffentliche für alle, vertrauliche nur bei Freigabe
create policy "dateien sichtbar" on dossier_datei
  for select using (
    oeffentlich = true
    or projekt_id in (
      select p.id from projekt p
      join organisation o on o.id = p.investor_id
      where o.besitzer = auth.uid()
    )
    or projekt_id in (
      select da.projekt_id from dossier_access da
      join organisation o on o.id = da.architekt_id
      where o.besitzer = auth.uid() and da.status = 'granted'
    )
  );
```

> Was das bewirkt, in einem Satz: Jeder sieht nur, was er sehen darf — Büros sehen
> vertrauliche Pläne erst nach deiner Freigabe. Genau das Verhalten, das die App
> vorführt, ist jetzt **echt abgesichert**.

✅ **Abhaken, wenn:** Auch dieser Lauf „Success" meldet.

## Schritt D5 — Die Datei-Ablage anlegen (für Pläne und Gutachten)

1. Links im Menü auf **„Storage"** klicken.
2. **„New bucket"** klicken („bucket" = Eimer, also ein Ablage-Behälter).
3. Name: **`dossiers`**. Lass „Public" **ausgeschaltet** (vertrauliche Dateien sollen
   nicht öffentlich sein). **„Create bucket"** klicken.

✅ **Abhaken, wenn:** Der Behälter `dossiers` in der Storage-Liste steht.

---

## Ab hier wird es Code: Die App mit Supabase verbinden (D6–D8)

> **Letzte Erinnerung:** Wenn dir das Folgende zu technisch wird, ist hier der ideale
> Punkt zum Übergeben. Du hast die komplette Datenbank bereits aufgebaut — eine
> Entwicklerin braucht dann nur noch wenige Stunden statt Tage. Wenn du es selbst
> probieren willst: Geh in Ruhe vor, kopiere genau, und nichts kann dauerhaft
> kaputtgehen.

## Schritt D6 — Das Supabase-Hilfspaket installieren

1. Terminal öffnen und in deinen Projektordner wechseln:
   ```
   cd architektonik
   ```
2. Das Verbindungspaket installieren:
   ```
   npm install @supabase/supabase-js
   ```

## Schritt D7 — Die Zugangsdaten sicher hinterlegen

Deine zwei Angaben aus Schritt D2 sollen **nicht** offen im Code stehen. Man legt sie
in eine spezielle Datei namens `.env` (für „Environment", also Umgebung).

1. Erstelle im Projektordner `architektonik` eine neue Textdatei mit dem exakten Namen
   **`.env`** (ja, mit dem Punkt davor und ohne weitere Endung).
2. Schreib genau diese zwei Zeilen hinein und ersetze die Platzhalter durch **deine**
   Werte aus Schritt D2:
   ```
   VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
   VITE_SUPABASE_ANON_KEY=dein-langer-anon-public-schluessel
   ```
3. Speichern.

> Damit dieser Schlüssel nicht aus Versehen ins Internet (zu GitHub) hochgeladen wird:
> Öffne die Datei `.gitignore` im selben Ordner (sie ist schon da) und füge unten eine
> Zeile mit `.env` hinzu, falls sie noch nicht drinsteht. Speichern.

## Schritt D8 — Die Verbindungsdatei anlegen

1. Geh in den Ordner `src`.
2. Erstelle dort eine neue Datei namens **`supabase.js`**.
3. Füge genau diesen Text ein und speichere:

```javascript
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
```

Diese Datei ist ab jetzt die „Telefonleitung" zwischen deiner App und Supabase. Andere
Teile der App rufen sie auf, um Daten zu speichern oder zu holen.

## Schritt D9 — Was jetzt noch zu tun ist (und warum es Code-Arbeit ist)

Die App in ihrer jetzigen Form holt ihre Daten aus der eingebauten Demo-Liste
(`SEED_DB`) und merkt sie im Browser. Damit echte Konten und gemeinsame Daten
funktionieren, müssen diese Stellen umgestellt werden auf „hole/speichere bei
Supabase". Konkret sind das vier Arten von Änderungen:

1. **Login-Bildschirm:** Statt der Demo-Knöpfe ein echtes Anmeldeformular, das
   `supabase.auth.signUp(...)` (Konto erstellen) und `supabase.auth.signInWithPassword(...)`
   (anmelden) verwendet.
2. **Daten lesen:** Wo die App heute aus `db.projekte` liest, kommt z. B.
   `const { data } = await supabase.from('projekt').select('*')`.
3. **Daten schreiben:** Wo heute `db.projekte.unshift(...)` steht, kommt
   `await supabase.from('projekt').insert({...})`.
4. **Dateien:** Hochladen mit `supabase.storage.from('dossiers').upload(...)`,
   Herunterladen über eine zeitlich begrenzte Link-Erzeugung.

Das ist überschaubar, aber es berührt viele Stellen und will sorgfältig getestet
werden. Das ist genau die Aufgabe, die du gut an eine Entwicklerin gibst — mit dem
Hinweis: „Datenbank und Sicherheitsregeln stehen schon in Supabase, bitte die App
(`App.jsx`) von der Demo-Datenliste auf Supabase umstellen." Das verkürzt ihre Arbeit
erheblich.

✅ **Etappe D geschafft (Grundlage):** Datenbank, Sicherheitsregeln, Datei-Ablage und
Verbindung stehen. Die Umstellung des App-Codes ist der letzte, am besten delegierte
Schritt.

---
---

# ETAPPE E — Stripe einrichten: echte Zahlungen (Gebühren & Abos)

Ziel: Die App nimmt echtes Geld entgegen — die Teilnahmegebühr (CHF 290), die
Ausschreibungsgebühr (CHF 1'500) und die Monatsabos. Stripe unterstützt Kreditkarten
und **TWINT**.

> **Wichtig zu verstehen:** Eine Bezahlung sicher abzuwickeln ist aus gutem Grund
> nicht „nur ein Knopf". Geld darf man niemals allein im Browser verbuchen (das
> könnte man fälschen). Es braucht immer ein winziges Stück Programm, das **im
> Hintergrund auf einem Server** läuft und mit Stripe abrechnet. Die gute Nachricht:
> Vercel (wo deine Seite schon liegt) kann solche Hintergrund-Stücke kostenlos
> mitlaufen lassen — man nennt sie „Functions". Du musst dafür nichts Neues kaufen.
>
> Die Schritte E1–E3 (Konto, Produkte, Schlüssel) machst du selbst. Das Einbauen der
> Funktion (E4–E5) ist wieder Code-Arbeit — dieselbe Entwicklerin, die Supabase
> anbindet, erledigt Stripe gleich mit. Ich gebe dir trotzdem den fertigen Baustein,
> damit du (oder sie) ihn nur noch einsetzen muss.

## Schritt E1 — Stripe-Konto anlegen

1. Geh auf **https://stripe.com** und erstelle ein Konto. Als Land **Schweiz** wählen.
2. Du landest im „Dashboard". Oben gibt es einen Schalter **„Test mode"** (Testmodus).
   **Lass ihn zunächst eingeschaltet** — im Testmodus kannst du mit erfundenen
   Kreditkartennummern üben, ohne echtes Geld.
3. Für **echte** Zahlungen später musst du dein Konto „aktivieren": Stripe fragt dann
   nach Firmenangaben und deiner Bankverbindung (deshalb brauchst du die Firma und das
   Geschäftskonto aus Etappe C). Das kannst du nachholen, wenn du bereit bist,
   live zu gehen.

## Schritt E2 — Deine Preise als „Produkte" anlegen

In Stripe legt man an, was man verkauft. Du brauchst vier Einträge.

1. Links im Menü **„Product catalog"** (oder „Products") → **„+ Add product"**.
2. Lege nacheinander an:
   - **Teilnahmegebühr Auktion** — Preis **290 CHF**, Typ **„One-off"** (einmalig).
   - **Ausschreibungsgebühr** — Preis **1500 CHF**, Typ **„One-off"**.
   - **Abo Atelier (Architekten)** — Preis **490 CHF**, Typ **„Recurring"**
     (wiederkehrend), Abrechnung **monatlich**.
   - **Abo Bauherr (Investoren)** — Preis **690 CHF**, Typ **„Recurring"**, monatlich.
3. Klick bei jedem angelegten Preis auf den Preis und **kopiere die „Price ID"** —
   sie sieht aus wie `price_1Q2x...`. Notiere dir, welche ID zu welchem Angebot
   gehört. Diese IDs braucht die App später.

## Schritt E3 — Die Stripe-Schlüssel notieren

1. Links **„Developers" → „API keys"**.
2. Du siehst (im Testmodus) zwei Schlüssel:
   - **Publishable key** (beginnt mit `pk_test_...`) — darf in der App stehen.
   - **Secret key** (beginnt mit `sk_test_...`) — **streng geheim**, kommt nur in den
     Hintergrund-Teil, niemals in die sichtbare App oder zu GitHub.
3. Beide in deine sichere Notiz kopieren.

## Schritt E4 — Den Bezahl-Schlüssel zu Vercel hinzufügen

Der geheime Schlüssel gehört auf den Server (Vercel), nicht in die App-Dateien.

1. Geh auf **https://vercel.com**, öffne dein Projekt `architektonik`.
2. **„Settings" → „Environment Variables"**.
3. Lege zwei Einträge an (jeweils Name und Wert, dann „Save"):
   - Name: `STRIPE_SECRET_KEY` — Wert: dein `sk_test_...`
   - Name: `STRIPE_PRICE_TEILNAHME` — Wert: die Price-ID der Teilnahmegebühr
   (weitere Price-IDs kannst du analog ergänzen, z. B. `STRIPE_PRICE_AUSSCHREIBUNG`).

## Schritt E5 — Den Bezahl-Baustein einsetzen (fertig zum Kopieren)

Dies ist das kleine Hintergrund-Programm, das Vercel ausführt. Es erstellt eine
sichere Stripe-Bezahlseite und schickt den Nutzer dorthin.

1. Im Terminal das Stripe-Paket installieren:
   ```
   cd architektonik
   npm install stripe
   ```
2. Erstelle im Projektordner `architektonik` einen **neuen Ordner** namens `api`.
3. Erstelle darin eine Datei **`checkout.js`** mit genau diesem Inhalt:

```javascript
// Läuft im Hintergrund auf Vercel — erstellt eine sichere Bezahlseite.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ fehler: "Nur POST erlaubt" });
  }
  try {
    const { priceId, modus } = req.body; // modus: 'payment' oder 'subscription'
    const session = await stripe.checkout.sessions.create({
      mode: modus || "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/?bezahlt=ja`,
      cancel_url: `${req.headers.origin}/?bezahlt=nein`,
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ fehler: e.message });
  }
}
```

> Was das tut: Wenn die App „bezahlen" meldet, ruft sie diese Funktion. Die Funktion
> spricht mit Stripe, erzeugt eine offizielle, sichere Stripe-Bezahlseite und gibt
> deren Link zurück. Der Nutzer zahlt dort (Karte oder TWINT) und kommt danach zu
> deiner Seite zurück.

## Schritt E6 — In der App den Bezahl-Knopf verbinden

An den Stellen, wo heute „Verbindlich bieten" bzw. „Ausschreibung publizieren" die
Gebühr nur anzeigt, ruft man künftig die Funktion auf. Der einzusetzende Baustein
sieht so aus (das ist die Stelle, die deine Entwicklerin an die richtigen Knöpfe hängt):

```javascript
async function zahlungStarten(priceId, modus = "payment") {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, modus }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;   // weiter zur Stripe-Bezahlseite
  } else {
    alert("Zahlung konnte nicht gestartet werden: " + data.fehler);
  }
}

// Beispielaufruf bei der Teilnahmegebühr:
// zahlungStarten("price_1Q2x...", "payment");
// Beispiel für ein Monatsabo:
// zahlungStarten("price_1ABODings...", "subscription");
```

## Schritt E7 — Im Testmodus ausprobieren

1. Lade deine Änderungen wie gewohnt über GitHub Desktop hoch (Commit + Push) — Vercel
   veröffentlicht sie automatisch.
2. Klick in deiner Live-App auf einen Bezahl-Knopf. Du landest auf der Stripe-Seite.
3. Gib eine **Stripe-Testkarte** ein: Nummer `4242 4242 4242 4242`, ein beliebiges
   zukünftiges Ablaufdatum, beliebige Prüfziffer. Es wird **kein echtes Geld**
   bewegt.
4. Nach „Zahlung erfolgreich" kommst du zu deiner Seite zurück. Im Stripe-Dashboard
   unter „Payments" siehst du die Testzahlung.

## Schritt E8 — Auf echt umstellen (wenn du bereit bist)

1. Stripe-Konto aktivieren (Firmenangaben + Bankverbindung hinterlegen).
2. Oben im Stripe-Dashboard den **„Test mode" ausschalten**.
3. Unter „API keys" die **echten** Schlüssel holen (beginnen mit `pk_live_` /
   `sk_live_`) und bei Vercel den `STRIPE_SECRET_KEY` durch den `sk_live_`-Wert
   ersetzen. Ebenso die Produkte/Preise im Live-Modus anlegen und die neuen Price-IDs
   eintragen.

Ab jetzt fliesst echtes Geld auf dein Geschäftskonto.

✅ **Etappe E geschafft (Grundlage):** Zahlungswege stehen bereit. Das Verbinden mit
den genauen Knöpfen erledigt sich zusammen mit der Supabase-Umstellung in einem Zug.

---

## Empfohlene Reihenfolge — damit du den Überblick behältst

1. **Etappe A** — App lokal sehen *(selbst, heute)*
2. **Etappe B** — App online stellen *(selbst, diese Woche)*
3. **Firma & Recht** aus Etappe C *(mit Treuhänder/Jurist, parallel)*
4. **Etappe D, Schritte D1–D5** — Supabase-Datenbank aufbauen *(selbst, gut machbar)*
5. **Etappe E, Schritte E1–E3** — Stripe-Konto & Produkte anlegen *(selbst, gut machbar)*
6. **Etappe D6–D9 + E4–E8** — App mit Supabase und Stripe verdrahten
   *(am besten mit Entwickler:in — du hast alle Vorarbeiten schon geleistet)*

Mit dieser Aufteilung machst du den grössten Teil selbst und bezahlst Hilfe nur noch
für das letzte, rein technische Verbinden — der günstigste und sicherste Weg für
jemanden ohne IT-Hintergrund.

## Neue Stolpersteine in Etappe D und E

- **Supabase „permission denied" / nichts wird angezeigt:** Fast immer fehlen die
  Zugriffsregeln aus Schritt D4 oder der Nutzer ist nicht eingeloggt. D4 erneut
  ausführen und sicherstellen, dass man angemeldet ist.
- **App startet nach `.env` nicht / findet Schlüssel nicht:** Nach dem Anlegen der
  `.env`-Datei den laufenden `npm run dev` einmal stoppen (im Terminal `Strg + C`)
  und mit `npm run dev` neu starten. Vite liest `.env` nur beim Start.
- **Stripe-Knopf macht nichts / Fehler 500:** Meist fehlt der `STRIPE_SECRET_KEY` bei
  Vercel (Schritt E4) oder es wurde eine falsche Price-ID verwendet.
- **„Funktioniert lokal, aber nicht online":** Umgebungs-Werte (Schlüssel) müssen
  **sowohl** lokal in `.env` **als auch** bei Vercel unter „Environment Variables"
  hinterlegt sein — beide Orte getrennt pflegen.
- **Geheimer Schlüssel aus Versehen bei GitHub gelandet:** Sofort in Stripe bzw.
  Supabase den Schlüssel „zurückziehen/neu erzeugen" („Roll key") und den neuen Wert
  eintragen. Deshalb steht `.env` in der `.gitignore`.
