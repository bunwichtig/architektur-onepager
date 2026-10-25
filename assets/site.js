/*
 * Gemeinsames Skript aller Seiten: Design, Sprache, Kopf- und Fußzeile,
 * Kontaktdaten, Karte, Kontaktformular und Projekte.
 * Wird im <head> geladen, damit Design und Sprache ohne Flackern stehen.
 */
(function () {
  var C = window.SITE;
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var inFrame = window.self !== window.top;
  var DESIGNS = ['hell', 'natur', 'modern', 'hanse'];

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---------- Design ----------
  var design = params.get('design');
  if (DESIGNS.indexOf(design) > -1) {
    if (!inFrame) save('hs-design', design);
  } else {
    design = load('hs-design');
    if (DESIGNS.indexOf(design) < 0) design = C.design;
  }
  root.setAttribute('data-design', design);

  // ---------- Sprache ----------
  var lang = params.get('lang') || load('hs-lang') || 'de';
  if (lang !== 'en') lang = 'de';
  function applyLang() {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    var en = document.querySelector('meta[name="title-en"]');
    if (en) {
      if (!root.dataset.titleDe) root.dataset.titleDe = document.title;
      document.title = lang === 'en' ? en.content : root.dataset.titleDe;
    }
    document.querySelectorAll('[data-ph-de]').forEach(function (el) {
      el.placeholder = lang === 'en' ? el.dataset.phEn : el.dataset.phDe;
    });
  }
  root.setAttribute('data-lang', lang);

  // ---------- Hilfsfunktionen ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Zweisprachiger Text: beide Sprachen im DOM, CSS blendet eine aus.
  function bi(de, en) {
    return '<span lang="de">' + esc(de) + '</span><span lang="en">' + esc(en || de) + '</span>';
  }
  // Wie bi(), aber für Texte mit eigenem HTML (nur für feste Texte verwenden)
  function biHtml(de, en) { return '<span lang="de">' + de + '</span><span lang="en">' + en + '</span>'; }
  var CATS = {
    neubau: ['Neubau', 'New build'],
    sanierung: ['Sanierung', 'Renovation'],
    landschaft: ['Landschaftsgestaltung', 'Landscape design']
  };
  function address() { return C.street + ', ' + C.zip + ' ' + C.city; }

  window.SiteUtil = { esc: esc, bi: bi, biHtml: biHtml, CATS: CATS, DESIGNS: DESIGNS, design: design,
    setDesign: function (d) { save('hs-design', d); root.setAttribute('data-design', d); } };

  // ---------- Kopf- und Fußzeile ----------
  var NAV = [
    ['index.html', 'Start', 'Home'],
    ['leistungen.html', 'Leistungen', 'Services'],
    ['projekte.html', 'Projekte', 'Projects'],
    ['ablauf.html', 'Ablauf', 'Process'],
    ['ueber-mich.html', 'Über mich', 'About'],
    ['kontakt.html', 'Kontakt', 'Contact']
  ];
  var page = location.pathname.split('/').pop() || 'index.html';
  if (page === 'projekt.html') page = 'projekte.html';

  function header() {
    var el = document.getElementById('site-header');
    if (!el) return;
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + bi(n[1], n[2]) + '</a>';
    }).join('');
    var bar = C.demo && !inFrame
      ? '<div class="demo-bar">' + bi('Demo-Version mit Testdaten · ', 'Demo version with sample data · ') +
        '<a href="designs.html">' + bi('Designvarianten ansehen', 'View design options') + '</a> · ' +
        '<a href="verwaltung.html">' + bi('Verwaltung testen', 'Try the admin area') + '</a></div>'
      : '';
    el.outerHTML = bar +
      '<header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html"><strong>' + esc(C.name) + '</strong><span>' + bi(C.business.de + ' · ' + C.city, C.business.en + ' · ' + C.city) + '</span></a>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="nav">' + bi('Menü', 'Menu') + '</button>' +
      '<nav class="nav" id="nav" aria-label="' + (lang === 'en' ? 'Main' : 'Hauptmenü') + '">' + links +
      '<button class="lang-btn" type="button" aria-label="Sprache wechseln / Switch language">' + bi('EN', 'DE') + '</button></nav>' +
      '</div></header>';
    var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    document.querySelector('.lang-btn').addEventListener('click', function () {
      lang = lang === 'de' ? 'en' : 'de';
      save('hs-lang', lang);
      applyLang();
    });
  }

  function footer() {
    var el = document.getElementById('site-footer');
    if (!el) return;
    var nav = NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + bi(n[1], n[2]) + '</a></li>'; }).join('');
    el.outerHTML = '<footer class="site-footer"><div class="wrap">' +
      '<div><strong>' + esc(C.name) + ' · ' + bi(C.business.de, C.business.en) + '</strong>' +
      bi('Sanierung, Neubau und Landschaftsgestaltung für private Bauherren in Wismar und Umgebung.',
         'Renovation, new builds and landscape design for private clients in and around Wismar.') +
      '<p style="margin-top:12px">' + esc(address()) + '<br><a href="tel:' + esc(C.phone) + '">' + esc(C.phoneDisplay) + '</a><br>' +
      '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a></p></div>' +
      '<div><strong>' + bi('Seiten', 'Pages') + '</strong><ul>' + nav + '</ul></div>' +
      '<div><strong>' + bi('Rechtliches', 'Legal') + '</strong><ul>' +
      '<li><a href="impressum.html">' + bi('Impressum', 'Legal notice') + '</a></li>' +
      '<li><a href="datenschutz.html">' + bi('Datenschutz', 'Privacy') + '</a></li>' +
      (C.demo ? '<li><a href="designs.html">' + bi('Designvarianten', 'Design options') + '</a></li>' +
                '<li><a href="verwaltung.html">' + bi('Verwaltung (Demo)', 'Admin (demo)') + '</a></li>' : '') +
      '</ul></div>' +
      '<div class="legal">© ' + new Date().getFullYear() + ' ' + esc(C.name) + '</div>' +
      '</div></footer>';
  }

  // ---------- Kontaktdaten in Seiten eintragen ----------
  function fillContacts() {
    var map = {
      name: C.name, email: C.email, phone: C.phoneDisplay, address: address(),
      street: C.street, zipcity: C.zip + ' ' + C.city, vat: C.vatId, url: C.siteUrl
    };
    document.querySelectorAll('[data-c]').forEach(function (el) {
      var k = el.dataset.c;
      if (!(k in map)) return;
      el.textContent = map[k];
      if (el.tagName === 'A') {
        if (k === 'email') el.href = 'mailto:' + C.email;
        if (k === 'phone') el.href = 'tel:' + C.phone;
        if (k === 'url') el.href = C.siteUrl;
      }
    });
    if (C.maps.profileUrl) {
      document.querySelectorAll('[data-maps-profile]').forEach(function (a) { a.href = C.maps.profileUrl; a.hidden = false; });
    }
  }

  // ---------- Google Maps erst nach Klick ----------
  function maps() {
    document.querySelectorAll('[data-map]').forEach(function (box) {
      var q = encodeURIComponent(C.maps.query);
      box.innerHTML = '<div class="consent-box"><p><strong>' + bi('Karte von Google Maps', 'Google Maps') + '</strong></p>' +
        '<p>' + bi('Beim Laden der Karte werden Daten an Google übertragen. Mehr dazu in der Datenschutzerklärung.',
                   'Loading the map sends data to Google. See the privacy policy for details.') + '</p>' +
        '<div class="btn-row" style="justify-content:center"><button class="btn" type="button">' + bi('Karte laden', 'Load map') + '</button>' +
        '<a class="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + q + '">' +
        bi('In Google Maps öffnen', 'Open in Google Maps') + '</a></div></div>';
      box.querySelector('button').addEventListener('click', function () {
        box.innerHTML = '<iframe title="Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
          'src="https://maps.google.com/maps?q=' + q + '&z=12&output=embed"></iframe>';
      });
    });
  }

  // ---------- Kontaktformular ----------
  function contactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var out = document.getElementById('form-result');
    function show(cls, de, en) { out.className = 'notice ' + cls; out.innerHTML = bi(de, en); out.hidden = false; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website.value) return; // Spam-Falle
      var fd = new FormData(form);
      fd.delete('website');
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            form.reset();
            show('', 'Danke! Ihre Nachricht wurde gesendet. Ich melde mich in Kürze.', 'Thank you! Your message has been sent. I will get back to you shortly.');
          })
          .catch(function () {
            show('warn', 'Das hat leider nicht geklappt. Bitte schreiben Sie direkt an ' + C.email + '.',
                 'Sorry, that did not work. Please write directly to ' + C.email + '.');
          });
        return;
      }
      var entry = Object.fromEntries(fd.entries());
      entry.datum = new Date().toISOString();
      DemoInbox.add(entry);
      form.reset();
      show('warn', 'Demo: Die Anfrage wurde nicht verschickt, sondern in diesem Browser gespeichert. Ansehen unter „Verwaltung → Anfragen“.',
           'Demo: the request was not sent but stored in this browser. See “Admin → Requests”.');
    });

    // Variante 2: E-Mail-Programm mit vorausgefüllter Nachricht öffnen
    document.getElementById('mail-variant').addEventListener('click', function () {
      var f = form.elements;
      var subject = (lang === 'en' ? 'Enquiry: ' : 'Anfrage: ') + (f.thema.value || '');
      var body = [f.nachricht.value, '', f.name.value, f.telefon.value, f.ort.value].filter(Boolean).join('\n');
      location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // ---------- Projekte ----------
  function loadProjects() {
    var base = fetch('content/projects.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.projects || []; });
    var local = window.DemoStore ? DemoStore.all() : Promise.resolve([]);
    return Promise.all([base, local]).then(function (res) {
      var mine = res[1].map(function (p) {
        p.images = (p.imageBlobs || []).map(function (b) { return URL.createObjectURL(b); });
        return p;
      });
      return mine.concat(res[0]);
    });
  }
  window.SiteUtil.loadProjects = loadProjects;

  function card(p) {
    var cat = CATS[p.category] || [p.category, p.category];
    var img = p.images && p.images[0] ? p.images[0] : 'assets/img/hero.svg';
    return '<a class="project" href="projekt.html?id=' + encodeURIComponent(p.id) + '" data-cat="' + esc(p.category) + '">' +
      '<img src="' + esc(img) + '" alt="" loading="lazy">' +
      '<div class="body"><span class="meta">' + bi(cat[0], cat[1]) + ' · ' + esc(p.location) + ' · ' + esc(p.year) +
      (p.local ? '<span class="badge-local">' + bi('Demo-Upload', 'Demo upload') + '</span>' : '') + '</span>' +
      '<h3>' + bi(p.title_de, p.title_en) + '</h3><p>' + bi(p.summary_de, p.summary_en) + '</p></div></a>';
  }

  function loadError(el) {
    el.innerHTML = '<p class="notice warn">' + bi(
      'Projekte konnten nicht geladen werden. Wird die Seite direkt als Datei geöffnet, bitte über einen Webserver aufrufen (siehe README).',
      'Projects could not be loaded. If you opened the page as a local file, please use a web server (see README).') + '</p>';
  }

  function projectList() {
    var el = document.getElementById('project-list');
    if (!el) return;
    var limit = +el.dataset.limit || 0;
    loadProjects().then(function (list) {
      if (limit) list = list.slice(0, limit);
      el.innerHTML = list.map(card).join('');
      var filters = document.getElementById('filters');
      if (!filters) return;
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        el.querySelectorAll('.project').forEach(function (c) {
          c.hidden = b.dataset.cat !== 'alle' && c.dataset.cat !== b.dataset.cat;
        });
      });
    }).catch(function () { loadError(el); });
  }

  function projectDetail() {
    var el = document.getElementById('project-detail');
    if (!el) return;
    var id = params.get('id');
    loadProjects().then(function (list) {
      var i = list.findIndex(function (p) { return p.id === id; });
      var p = list[i];
      if (!p) {
        el.innerHTML = '<h1>' + bi('Projekt nicht gefunden', 'Project not found') + '</h1><p><a href="projekte.html">' + bi('Zur Projektübersicht', 'Back to projects') + '</a></p>';
        return;
      }
      var cat = CATS[p.category] || [p.category, p.category];
      document.title = (lang === 'en' ? p.title_en : p.title_de) + ' · ' + C.name;
      root.dataset.titleDe = p.title_de + ' · ' + C.name + ' Bauplanung Wismar';
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = p.summary_de;
      var metaEn = document.querySelector('meta[name="title-en"]');
      if (metaEn) metaEn.content = (p.title_en || p.title_de) + ' · ' + C.name;
      var paras = function (t) { return esc(t || '').split(/\n\s*\n/).map(function (x) { return '<p>' + x + '</p>'; }).join(''); };
      var prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
      el.innerHTML =
        '<div class="detail-head"><div><span class="eyebrow">' + bi(cat[0], cat[1]) + '</span><h1>' + bi(p.title_de, p.title_en) + '</h1>' +
        '<p class="lead">' + bi(p.summary_de, p.summary_en) + '</p></div>' +
        '<dl class="facts"><div><dt>' + bi('Ort', 'Location') + '</dt><dd>' + esc(p.location) + '</dd></div>' +
        '<div><dt>' + bi('Jahr', 'Year') + '</dt><dd>' + esc(p.year) + '</dd></div>' +
        '<div><dt>' + bi('Bereich', 'Type') + '</dt><dd>' + bi(cat[0], cat[1]) + '</dd></div></dl></div>' +
        '<div class="gallery">' + (p.images || []).map(function (src, n) {
          return '<button type="button" data-src="' + esc(src) + '" aria-label="' + (lang === 'en' ? 'Enlarge image ' : 'Bild vergrößern ') + (n + 1) + '"><img src="' + esc(src) + '" alt=""></button>';
        }).join('') + '</div>' +
        '<div class="prose"><div lang="de">' + paras(p.text_de) + '</div><div lang="en">' + paras(p.text_en || p.text_de) + '</div></div>' +
        '<nav class="pager"><a href="projekt.html?id=' + encodeURIComponent(prev.id) + '">← ' + bi(prev.title_de, prev.title_en) + '</a>' +
        '<a href="projekt.html?id=' + encodeURIComponent(next.id) + '">' + bi(next.title_de, next.title_en) + ' →</a></nav>' +
        '<dialog class="lightbox"><img alt=""><button class="btn close" type="button">' + bi('Schließen', 'Close') + '</button></dialog>';
      var dlg = el.querySelector('dialog');
      el.querySelector('.gallery').addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b || !dlg.showModal) return;
        dlg.querySelector('img').src = b.dataset.src;
        dlg.showModal();
      });
      dlg.addEventListener('click', function () { dlg.close(); });
    }).catch(function () { loadError(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    header();
    footer();
    fillContacts();
    applyLang();
    maps();
    contactForm();
    projectList();
    projectDetail();
  });
})();
