/* Zentrale Kontaktdaten: hier ersetzen, alles andere (Links, vCard, Karte) zieht sich die Werte von hier. */
const C = {
  name: "Vorname Nachname",
  short: "V. Nachname",
  first: "Vorname",
  last: "Nachname",
  role: "Freie Architektin",
  org: "Architekturbüro Nachname",
  phone: "+49 40 000 000 00",
  email: "hallo@example.de",
  street: "Musterstraße 12",
  zip: "20095",
  city: "Hamburg",
  country: "Deutschland",
  url: "https://bunwichtig.github.io/architektur-onepager/"
};

(function () {
  "use strict";

  const addr = `${C.street}, ${C.zip} ${C.city}`;
  const telDigits = C.phone.replace(/[^\d+]/g, "");
  const enc = encodeURIComponent;

  const text = {
    name: C.name,
    short: C.short,
    phone: C.phone,
    email: C.email,
    street: C.street,
    zipcity: `${C.zip} ${C.city}`
  };
  document.querySelectorAll("[data-c]").forEach(function (el) {
    const v = text[el.dataset.c];
    if (v) el.textContent = v;
  });

  const hrefs = {
    tel: "tel:" + telDigits,
    mail: "mailto:" + C.email,
    route: "https://www.google.com/maps/dir/?api=1&destination=" + enc(addr),
    reviews: "https://www.google.com/maps/search/?api=1&query=" + enc(addr)
  };
  document.querySelectorAll("[data-href]").forEach(function (el) {
    const h = hrefs[el.dataset.href];
    if (h) el.setAttribute("href", h);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Karte erst nach Klick laden (Datenschutz) */
  const mapBtn = document.getElementById("mapLoad");
  const mapBox = document.getElementById("mapBox");
  if (mapBtn && mapBox) {
    mapBtn.addEventListener("click", function () {
      const frame = document.createElement("iframe");
      frame.title = "Karte mit dem Standort des Büros";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.src = "https://www.google.com/maps?q=" + enc(addr) + "&output=embed";
      mapBox.replaceChildren(frame);
    });
  }

  /* vCard speichern */
  const vBtn = document.getElementById("vcardBtn");
  if (vBtn) {
    vBtn.addEventListener("click", function () {
      const esc = function (s) { return String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); };
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:" + esc(C.name),
        "N:" + esc(C.last) + ";" + esc(C.first) + ";;;",
        "ORG:" + esc(C.org),
        "TITLE:" + esc(C.role),
        "TEL;TYPE=WORK,VOICE:" + telDigits,
        "EMAIL;TYPE=WORK:" + C.email,
        "ADR;TYPE=WORK:;;" + esc(C.street) + ";" + esc(C.city) + ";;" + esc(C.zip) + ";" + esc(C.country),
        "URL:" + C.url,
        "END:VCARD"
      ];
      const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/vcard;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (C.last || "kontakt").toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".vcf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
  }

  /* Formular: prüfen, dann das E-Mail-Programm mit fertigem Text öffnen */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        const first = form.querySelector(":invalid");
        if (first) first.focus();
        return;
      }
      const d = new FormData(form);
      const body = [
        d.get("message"),
        "",
        "Von: " + d.get("name"),
        "E-Mail: " + d.get("email"),
        d.get("tel") ? "Telefon: " + d.get("tel") : ""
      ].filter(function (l, i, a) { return l !== "" || i < a.length - 1; }).join("\n");
      const subject = "Anfrage über die Webseite von " + d.get("name");
      window.location.href = "mailto:" + C.email + "?subject=" + enc(subject) + "&body=" + enc(body);
    });
  }
})();
