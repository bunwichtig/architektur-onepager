# Architektur-One-Pager

Kompakte One-Page-Website mit digitaler Visitenkarte für eine Architektin: Kontakt-Buttons, Leistungen, ausklappbare Projekte, Anfahrt mit Google Maps, Kontaktformular, vCard-Download und QR-Code.

Reines HTML, CSS und JavaScript mit Bootstrap 5. Es gibt keinen Build-Schritt. Bootstrap und die Schriften (Bricolage Grotesque, Newsreader) liegen im Ordner `assets/`, die Seite lädt nichts von fremden Servern. Die Google-Karte wird erst nach Klick geladen.

## Platzhalter ersetzen

1. **Kontaktdaten:** oben in `assets/app.js` im Objekt `C`. Daraus entstehen Anruf-, Mail- und Routen-Links, die Karte und die vCard.
2. **Texte, Projekte, Name:** in `index.html` (Platzhalter stehen in eckigen Klammern oder sind rosa hinterlegt).
3. **Bilder:** Jede Fläche mit `class="shot"` ist ein Platzhalter. Ersetzen durch `<div class="shot"><img src="assets/img/projekt1-1.jpg" alt="Beschreibung"></div>`.
4. **Impressum und Datenschutz:** Entwurf am Ende von `index.html`. Vor der Veröffentlichung ausfüllen und rechtlich prüfen lassen.
5. **QR-Code:** `assets/qr.svg` zeigt auf `https://bunwichtig.github.io/architektur-onepager/`. Bei anderer Adresse neu erzeugen.

## Farben

Akzent ist das Betonrosa `#DDA8AE`, Textakzent `#8A4B58`. Alle Farben stehen oben in `assets/style.css`.

## Veröffentlichen

GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / root*.

## Lizenzen

Bootstrap (MIT) und die Schriften (SIL Open Font License) liegen mit ihren Lizenztexten in `assets/`.
