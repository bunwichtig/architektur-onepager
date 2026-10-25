# Henrike Scholze · Bauplanung (Website)

Mehrseitige Website für Henrike Scholze, Bauplanung in Wismar: Sanierung, Neubau, Landschaftsgestaltung für Privatleute. Deutsch und Englisch umschaltbar, sieben Designvarianten, Projekte zum Hochladen. **Derzeit Demo mit Testdaten.**

Reines HTML, CSS und JavaScript ohne Build-Schritt. Es werden keine Schriften oder Skripte von fremden Servern geladen. Ausnahmen: Google Maps, das erst nach Klick lädt, und das Redaktionssystem unter `admin/`.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Leistungen, Projekten, Einzugsgebiet und Karte |
| `leistungen.html` | Sanierung, Neubau, Landschaftsgestaltung |
| `projekte.html` / `projekt.html?id=…` | Projektübersicht mit Filter und Detailseiten mit Galerie |
| `ablauf.html` | Ablauf in sechs Schritten und häufige Fragen (mit FAQ-Daten für Google) |
| `ueber-mich.html` | Über mich |
| `kontakt.html` | Kontaktformular, E-Mail-Variante, Karte |
| `impressum.html`, `datenschutz.html` | Entwürfe, **vor Veröffentlichung rechtlich prüfen lassen** |
| `bildnachweise.html` | Urheber und Lizenzen aller Fotos |
| `designs.html` | Vorschau aller Designvarianten (nicht für Google) |
| `verwaltung.html` | Testmodus: Projekte hochladen, Anfragen ansehen, Einrichtung (nicht für Google) |
| `admin/` | Echtes Redaktionssystem (Decap CMS), sobald eingerichtet |

## Wo steht was?

- **Einstellungen und Kontaktdaten:** `assets/config.js`. Bequemer geht es über `verwaltung.html` → *Einrichtung*: ausfüllen, `config.js` herunterladen und die Datei im Repository ersetzen.
- **Projekte:** `content/projects.json`. Bilder liegen in `assets/img/` (Testgrafiken) bzw. `assets/uploads/` (echte Uploads).
- **Texte:** direkt in den HTML-Dateien, jeweils als Paar `<span lang="de">…</span><span lang="en">…</span>`.
- **Designs:** Liste aller Varianten oben in `assets/site.js` (`VARIANTS`). Jede Variante wählt eine Anordnung für das Startbild (`hero`: split, split-rev, stack, overlay, float, editorial) und für die Projekte (`projects`: cards, list, tiles, index, editorial). Farben, Schriften und Details stehen in `assets/site.css` unter `html[data-design="…"]`. Für ein neues Design einen Eintrag in `VARIANTS` und einen Block in `site.css` anlegen. Es erscheint dann automatisch auf `designs.html`.
- **Schriften:** `assets/fonts/` (Instrument Serif/Sans, Archivo, Fraunces, IBM Plex Mono, Bricolage Grotesque, Newsreader), alle unter SIL Open Font License, Lizenztexte liegen daneben.
- **Fotos und Bildnachweise:** `assets/img/fotos/` (Beispielfotos von Wikimedia Commons, verkleinert, ohne Metadaten) und `content/credits.json` (Urheber, Lizenz, Quelle je Bild). Steht ein Bild in `credits.json`, zeigt die Seite den Nachweis automatisch am Bild an. Alle Nachweise stehen gesammelt auf `bildnachweise.html`.

## Lokal ansehen

Die Seite muss über einen Webserver laufen, sonst lassen sich die Projekte nicht laden:

```
python3 -m http.server 8000
```

Danach <http://localhost:8000> öffnen.

## Zwei Wege zum Hochladen von Projekten

1. **Testmodus (sofort nutzbar):** `verwaltung.html` → *Projekt hochladen*. Die Projekte erscheinen auf der Projektseite, bleiben aber nur im eigenen Browser.
2. **Redaktionssystem (für die echte Seite):** `admin/` mit Anmeldung über GitHub. Neue Projekte und Bilder werden direkt ins Repository gespeichert und sind danach für alle sichtbar.
   - Lokal testen ohne Anmeldung: in einem zweiten Terminal `npx decap-server` starten, dann <http://localhost:8000/admin/> öffnen.
   - Online braucht GitHub einen kleinen Anmeldedienst (OAuth), da GitHub Pages keinen eigenen Server hat. Kostenlos geht das zum Beispiel mit einem Cloudflare Worker (Vorlage: „decap-proxy“) oder über Netlify als Host. Die Adresse kommt in `config.js` unter `cms.authUrl`.
   - Frau Scholze braucht ein GitHub-Konto mit Schreibrecht auf das Repository.

## Kontaktformular

- **Ohne Formulardienst (jetzt):** Anfragen werden im Browser gespeichert und sind unter `verwaltung.html` → *Anfragen* zu sehen und als Textdatei herunterladbar.
- **Mit Formulardienst (später):** Bei z. B. [Formspree](https://formspree.io) ein kostenloses Formular anlegen und die Adresse in `config.js` unter `formEndpoint` eintragen. Dann kommen Anfragen per E-Mail an.
- Zusätzlich gibt es den Knopf „Lieber mit E-Mail-Programm“. Er öffnet eine vorausgefüllte E-Mail.

## Google-Sichtbarkeit (Checkliste)

- [x] Eigene Seitentitel und Beschreibungen je Seite, mit Ort und Leistungen
- [x] Strukturierte Daten: Unternehmen mit Einzugsgebiet (`index.html`) und FAQ (`ablauf.html`)
- [x] `sitemap.xml` und `robots.txt`
- [x] Schnell: keine fremden Schriften, Karte erst nach Klick
- [ ] Eigene Domain kaufen und eintragen (`config.js`, `sitemap.xml`, `robots.txt`, `canonical`- und `og:`-Angaben in den HTML-Köpfen)
- [ ] **Google-Unternehmensprofil** anlegen (business.google.com, kostenlos). Adresse ausblenden und „Servicegebiet: Wismar und Umgebung“ wählen. Den Link in `config.js` unter `maps.profileUrl` eintragen
- [ ] In der Google Search Console anmelden und die Sitemap einreichen
- [ ] Echte Fotos mit aussagekräftigen Dateinamen (z. B. `sanierung-giebelhaus-wismar.jpg`)
- [ ] Ein Vorschaubild als JPG/PNG für das Teilen in sozialen Medien (`og:image`, derzeit SVG)
- [ ] Kundinnen und Kunden um Google-Bewertungen bitten
- [ ] Eintrag in Branchenverzeichnisse (Gelbe Seiten, Das Örtliche, Houzz) mit genau gleichen Kontaktdaten

## Vor der Veröffentlichung

1. Echte Daten in `config.js` (Straße, Telefon, E-Mail, USt-IdNr.), `demo: false` setzen.
2. Testprojekte in `content/projects.json` durch echte ersetzen. Die Beispielfotos zeigen keine Projekte von Frau Scholze: löschen und dazu die Einträge in `content/credits.json` entfernen.
3. Impressum und Datenschutz prüfen lassen.
4. Hinweis zur Berufsbezeichnung: „Architektin“ ist geschützt und wird nicht verwendet. Bauanträge brauchen je nach Vorhaben eine bauvorlageberechtigte Person.

## Veröffentlichen

GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / root*.
