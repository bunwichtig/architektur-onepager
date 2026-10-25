/*
 * Verwaltung im Testmodus: Projekte hochladen, Anfragen ansehen, Einrichtung.
 * Alles bleibt im Browser (siehe assets/store.js).
 */
(function () {
  var C = window.SITE, U = window.SiteUtil, bi = U.bi, esc = U.esc;

  // ---------- Reiter ----------
  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== t.dataset.tab; });
      if (t.dataset.tab === 'anfragen') renderInbox();
    });
  });

  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ---------- Projekt hochladen ----------
  var form = document.getElementById('upload-form');
  var fileInput = document.getElementById('u-img');
  var preview = document.getElementById('u-preview');
  form.elements.year.value = new Date().getFullYear();

  fileInput.addEventListener('change', function () {
    preview.innerHTML = '';
    Array.from(fileInput.files).forEach(function (f) {
      var img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.alt = f.name;
      preview.appendChild(img);
    });
  });

  // Große Fotos verkleinern, damit der Browser-Speicher reicht
  function resize(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || !window.createImageBitmap) return Promise.resolve(file);
    return createImageBitmap(file).then(function (bmp) {
      var s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      if (s === 1 && file.size < 1.5e6) return file;
      var c = document.createElement('canvas');
      c.width = Math.round(bmp.width * s);
      c.height = Math.round(bmp.height * s);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return new Promise(function (r) { c.toBlob(function (b) { r(b || file); }, 'image/jpeg', 0.85); });
    }).catch(function () { return file; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var out = document.getElementById('upload-result');
    if (!form.reportValidity()) return;
    var f = form.elements;
    Promise.all(Array.from(fileInput.files).map(resize)).then(function (blobs) {
      return DemoStore.put({
        id: 'local-' + Date.now(),
        local: true,
        category: f.category.value,
        title_de: f.title_de.value.trim(),
        title_en: f.title_en.value.trim(),
        location: f.location.value.trim(),
        year: f.year.value,
        summary_de: f.summary_de.value.trim(),
        summary_en: f.summary_en.value.trim(),
        text_de: f.text_de.value.trim(),
        text_en: f.text_en.value.trim(),
        imageBlobs: blobs
      });
    }).then(function () {
      form.reset();
      form.elements.year.value = new Date().getFullYear();
      preview.innerHTML = '';
      out.className = 'notice';
      out.innerHTML = U.biHtml('Gespeichert. Das Projekt steht jetzt auf der <a href="projekte.html">Projektseite</a>.',
                               'Saved. The project is now on the <a href="projekte.html">projects page</a>.');
      out.hidden = false;
      renderLocal();
    }).catch(function (err) {
      out.className = 'notice warn';
      out.textContent = 'Speichern fehlgeschlagen / Saving failed: ' + err.message;
      out.hidden = false;
    });
  });

  function renderLocal() {
    var box = document.getElementById('local-list');
    DemoStore.all().then(function (list) {
      if (!list.length) {
        box.innerHTML = '<p class="card muted">' + bi('Noch nichts hochgeladen.', 'Nothing uploaded yet.') + '</p>';
        return;
      }
      box.innerHTML = '<table><tbody>' + list.map(function (p) {
        var src = p.imageBlobs && p.imageBlobs[0] ? URL.createObjectURL(p.imageBlobs[0]) : '';
        return '<tr><td style="width:110px">' + (src ? '<div class="thumbs" style="margin:0"><img src="' + src + '" alt=""></div>' : '') + '</td>' +
          '<td><strong>' + esc(p.title_de) + '</strong><br><span class="muted">' + esc(p.location) + ' · ' + esc(p.year) + ' · ' +
          (p.imageBlobs || []).length + ' ' + bi('Bilder', 'images') + '</span><br>' +
          '<a href="projekt.html?id=' + encodeURIComponent(p.id) + '">' + bi('Ansehen', 'View') + '</a> · ' +
          '<a href="#" data-del="' + esc(p.id) + '">' + bi('Löschen', 'Delete') + '</a></td></tr>';
      }).join('') + '</tbody></table>';
    });
  }
  document.getElementById('local-list').addEventListener('click', function (e) {
    var a = e.target.closest('[data-del]');
    if (!a) return;
    e.preventDefault();
    if (confirm('Projekt löschen? / Delete project?')) DemoStore.remove(a.dataset.del).then(renderLocal);
  });
  renderLocal();

  // ---------- Anfragen ----------
  var FIELDS = [['datum', 'Datum'], ['name', 'Name'], ['email', 'E-Mail'], ['telefon', 'Telefon'], ['ort', 'Ort'], ['thema', 'Thema'], ['nachricht', 'Nachricht']];
  function fmt(d) { try { return new Date(d).toLocaleString('de-DE'); } catch (e) { return d; } }

  function renderInbox() {
    var list = DemoInbox.all(), box = document.getElementById('inbox');
    if (!list.length) {
      box.innerHTML = '<p class="card muted">' + U.biHtml('Noch keine Anfragen. Probieren Sie das <a href="kontakt.html">Kontaktformular</a> aus.',
                                                         'No requests yet. Try the <a href="kontakt.html">contact form</a>.') + '</p>';
      return;
    }
    box.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>' + bi('Datum', 'Date') + '</th><th>Name</th><th>' + bi('Kontakt', 'Contact') +
      '</th><th>' + bi('Thema', 'Topic') + '</th><th>' + bi('Nachricht', 'Message') + '</th></tr></thead><tbody>' +
      list.map(function (r) {
        return '<tr><td>' + esc(fmt(r.datum)) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.email) + '<br>' + esc(r.telefon) +
          '</td><td>' + esc(r.thema) + '<br><span class="muted">' + esc(r.ort) + '</span></td><td style="white-space:pre-line">' + esc(r.nachricht) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  document.getElementById('inbox-download').addEventListener('click', function () {
    var list = DemoInbox.all();
    var text = list.map(function (r) {
      return FIELDS.map(function (f) { return f[1] + ': ' + (f[0] === 'datum' ? fmt(r.datum) : (r[f[0]] || '')); }).join('\n');
    }).join('\n\n----------------------------------------\n\n');
    download('anfragen-' + new Date().toISOString().slice(0, 10) + '.txt', text || 'Keine Anfragen.');
  });
  document.getElementById('inbox-clear').addEventListener('click', function () {
    if (confirm('Alle Anfragen löschen? / Delete all requests?')) { DemoInbox.clear(); renderInbox(); }
  });

  // ---------- Einrichtung ----------
  // [Pfad in SITE, Bezeichnung, Hinweis, Prüfung ob noch Platzhalter]
  function placeholder(v) { return !v || /example|\[|0000|Vorname|Nachname/.test(v); }
  var SETUP = [
    ['Allgemein', [
      ['name', 'Name', ''],
      ['business.de', 'Tätigkeit (Deutsch)', ''],
      ['business.en', 'Tätigkeit (Englisch)', ''],
      ['siteUrl', 'Adresse der Website', 'Später die eigene Domain, z. B. https://www.henrike-scholze.de/. Dann auch die Adressen in sitemap.xml, robots.txt und den HTML-Köpfen ersetzen.',
        function (v) { return /github\.io/.test(v); }],
      ['design', 'Design für alle Besucher', 'galerie, natur, beton, hanse, magazin, riso oder pavillon (siehe Designvarianten)', function () { return false; }],
      ['demo', 'Demo-Modus', 'Auf „false“ setzen, wenn die Seite online geht. Dann verschwinden der gelbe Hinweis und die Demo-Links.', function (v) { return v !== 'false'; }]
    ]],
    ['Kontakt & Impressum', [
      ['email', 'E-Mail', ''],
      ['phone', 'Telefon (für Links, international)', 'z. B. +493841123456'],
      ['phoneDisplay', 'Telefon (Anzeige)', 'z. B. 03841 123 456'],
      ['street', 'Straße und Hausnummer', 'Pflicht für das Impressum'],
      ['zip', 'PLZ', '', function () { return false; }],
      ['city', 'Ort', '', function () { return false; }],
      ['region', 'Bundesland', '', function () { return false; }],
      ['vatId', 'USt-IdNr. oder Steuernummer', 'Nur nötig, wenn vorhanden']
    ]],
    ['Kontaktformular', [
      ['formEndpoint', 'Formular-Adresse (z. B. Formspree)', 'Kostenlos bei formspree.io registrieren, ein Formular anlegen und die Adresse (https://formspree.io/f/…) hier eintragen. Dann kommen Anfragen per E-Mail an.']
    ]],
    ['Google', [
      ['maps.query', 'Suchbegriff für die Karte', 'Ort oder später der Name aus dem Google-Unternehmensprofil', function () { return false; }],
      ['maps.profileUrl', 'Link zum Google-Unternehmensprofil', 'Kostenlos unter business.google.com anlegen. Danach den Link hier eintragen.']
    ]],
    ['Redaktionssystem (admin/)', [
      ['cms.repo', 'GitHub-Repository', 'besitzer/repository', function () { return false; }],
      ['cms.branch', 'Branch', 'Meist „main“', function () { return false; }],
      ['cms.authUrl', 'Adresse des Anmeldedienstes (OAuth)', 'Nötig, damit sich die Inhaberin im Redaktionssystem mit GitHub anmelden kann. Anleitung im README.']
    ]]
  ];

  function get(path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, C); }
  function set(obj, path, v) {
    var ks = path.split('.'), last = ks.pop();
    ks.reduce(function (o, k) { return o[k] = o[k] || {}; }, obj)[last] = v;
  }

  var setup = document.getElementById('setup-form');
  setup.innerHTML = SETUP.map(function (g) {
    return '<h3 style="margin-top:8px">' + esc(g[0]) + '</h3>' + g[1].map(function (f) {
      var v = String(get(f[0]) == null ? '' : get(f[0]));
      var todo = (f[3] || placeholder)(v);
      return '<div class="field"><label for="s-' + f[0] + '">' + esc(f[1]) + ' <span class="status ' + (todo ? 'todo' : 'ok') + '">' +
        (todo ? 'offen' : 'ok') + '</span></label>' +
        '<input id="s-' + f[0] + '" name="' + f[0] + '" value="' + esc(v) + '">' +
        (f[2] ? '<p class="hint">' + esc(f[2]) + '</p>' : '') + '</div>';
    }).join('');
  }).join('') + '<div class="btn-row"><button class="btn" type="submit">config.js herunterladen</button></div>';

  setup.addEventListener('submit', function (e) {
    e.preventDefault();
    var cfg = JSON.parse(JSON.stringify(C));
    Array.from(setup.elements).forEach(function (el) {
      if (!el.name) return;
      var v = el.value.trim();
      set(cfg, el.name, el.name === 'demo' ? v !== 'false' : v);
    });
    var text = '/*\n * Zentrale Einstellungen der Website.\n * Erzeugt über verwaltung.html → Einrichtung am ' + new Date().toLocaleDateString('de-DE') + '.\n */\n' +
      'window.SITE = ' + JSON.stringify(cfg, null, 2) + ';\n';
    download('config.js', text, 'text/javascript;charset=utf-8');
  });
})();
