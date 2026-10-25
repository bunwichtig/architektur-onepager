/*
 * Zentrale Einstellungen der Website.
 * Alle Werte sind Testdaten. Vor der Veröffentlichung ersetzen.
 * Bequemer geht es über verwaltung.html → „Einrichtung“: Dort ausfüllen und
 * die fertige config.js herunterladen. Hier stehen keine Passwörter: Die
 * Anmeldung im Redaktionssystem läuft über GitHub.
 */
window.SITE = {
  // true = Demo-Modus: Anfragen und hochgeladene Projekte bleiben nur im Browser.
  demo: true,

  name: 'Vorname Nachname',
  business: { de: 'Bauplanung', en: 'Building Design' },
  // Spätere eigene Domain hier eintragen, z. B. https://www.ihr-name.de/
  siteUrl: 'https://bunwichtig.github.io/architektur-onepager/',

  email: 'kontakt@example.com',
  phone: '+4938410000000',
  phoneDisplay: '03841 000 0000',
  street: '[Straße und Hausnummer]',
  zip: '23966',
  city: 'Wismar',
  region: 'Mecklenburg-Vorpommern',
  vatId: '[USt-IdNr. oder Steuernummer]',

  // Kontaktformular: Adresse eines Formulardienstes, z. B. https://formspree.io/f/abcdwxyz
  // Leer = Demo, Anfragen werden im Browser gespeichert (siehe verwaltung.html).
  formEndpoint: '',

  maps: {
    // Suchbegriff für die eingebettete Karte
    query: 'Wismar',
    // Link zum Google-Unternehmensprofil, sobald es angelegt ist
    profileUrl: ''
  },

  // Redaktionssystem (admin/): Repository, Branch und Adresse des Anmeldedienstes
  cms: {
    repo: 'bunwichtig/architektur-onepager',
    branch: 'main',
    authUrl: ''
  },

  // Standard-Design: galerie, natur, beton, hanse, magazin, riso oder pavillon
  design: 'natur'
};
