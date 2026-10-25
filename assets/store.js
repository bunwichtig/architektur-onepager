/*
 * Demo-Speicher im Browser (IndexedDB).
 * Hält Projekte, die über verwaltung.html hochgeladen werden, samt Bildern.
 * Die Daten bleiben nur in diesem Browser und werden nirgends hingeschickt.
 */
window.DemoStore = (function () {
  var DB = 'hs-demo', STORE = 'projects';

  function open() {
    return new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB nicht verfügbar'));
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE, { keyPath: 'id' }); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function run(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode);
        var req = fn(tx.objectStore(STORE));
        tx.oncomplete = function () { resolve(req && req.result); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  return {
    all: function () { return run('readonly', function (s) { return s.getAll(); }).catch(function () { return []; }); },
    put: function (p) { return run('readwrite', function (s) { return s.put(p); }); },
    remove: function (id) { return run('readwrite', function (s) { return s.delete(id); }); }
  };
})();

/* Anfragen aus dem Kontaktformular (Demo-Modus) liegen in localStorage. */
window.DemoInbox = {
  KEY: 'hs-anfragen',
  all: function () {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; }
  },
  add: function (entry) {
    var list = this.all();
    list.unshift(entry);
    try { localStorage.setItem(this.KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  },
  clear: function () { try { localStorage.removeItem(this.KEY); } catch (e) {} }
};
