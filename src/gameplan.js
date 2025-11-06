// ----- Konfiguration / Konstanten -----
const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";

const statusEl = document.getElementById("plan-status");
const table = document.getElementById("spielplan");
const thead = table ? table.querySelector("thead") : null;
// Falls du ein Skeleton tbody mit id "spielplan-skeleton" verwendest, wähle das echte tbody:
const tbody = table ? (table.querySelector('tbody:not(#spielplan-skeleton)') || table.querySelector("tbody")) : null;
const nextBox = document.getElementById("next-match"); // Karte oben

const loader = document.getElementById("plan-loader");           // Overlay (optional)
const skeleton = document.getElementById("spielplan-skeleton");  // optional skeleton tbody

// ----- Hilfsfunktionen -----
function formatDE(dStr){
  const d = new Date(dStr);
  if (isNaN(d)) return dStr || "";
  return d.toLocaleDateString('de-DE');
}

function toDate(dStr){
  const d = new Date(dStr);
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function showLoader() {
  if (loader) {
    loader.hidden = false;
    loader.setAttribute("aria-hidden", "false");
  }
  if (skeleton) {
    skeleton.hidden = false;
    skeleton.setAttribute("aria-hidden", "false");
  }
  if (table) {
    table.classList.add("loading");
    table.setAttribute("aria-busy", "true");
  }
  if (statusEl) statusEl.textContent = "Lädt…";
}

function hideLoader() {
  if (loader) {
    loader.hidden = true;
    loader.setAttribute("aria-hidden", "true");
  }
  if (skeleton) {
    skeleton.hidden = true;
    skeleton.setAttribute("aria-hidden", "true");
  }
  if (table) {
    table.classList.remove("loading");
    table.removeAttribute("aria-busy");
  }
  if (statusEl) statusEl.textContent = "";
}

// ----- Laden des Spielplans (async) -----
async function loadSpielplan() {
  // Fallbacks: wenn essentielle Elemente fehlen, abbrechen
  if (!table || !thead || !tbody) {
    console.warn("Spielplan-Elemente fehlen (table/thead/tbody).");
    return;
  }

  showLoader();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Netzwerkfehler ${res.status}`);
    const rows = await res.json();

    if (!rows || !rows.length) {
      statusEl.textContent = "Keine Einträge gefunden.";
      tbody.innerHTML = "";
      return;
    }

    // Spaltenreihenfolge (anpassen falls nötig)
    const cols = ["Heim-Team","Gast-Team","Tag","Datum","Ergebnis"];

    // Kopfzeile
    thead.innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>`;

    // sortieren nach Datum (aufsteigend)
    const data = rows.slice().sort(
      (a,b) => (toDate(a["Datum"])||0) - (toDate(b["Datum"])||0)
    );

    const today = new Date();
    today.setHours(0,0,0,0);

    // Tabelle rendern
    tbody.innerHTML = data.map(r => {
      const d = toDate(r["Datum"]);
      const isUpcoming = d && d >= today;
      const tds = cols.map(c => {
        const val = c === "Datum" ? formatDE(r[c]) : (r[c] ?? "");
        // data-label für responsive Tabellen
        return `<td data-label="${c}">${val}</td>`;
      }).join("");
      return `<tr class="${isUpcoming ? "upcoming" : ""}">${tds}</tr>`;
    }).join("");

    // Nächstes Spiel finden (erste Zeile mit Klasse upcoming)
    const nextRowEl = tbody.querySelector("tr.upcoming");
    if (nextRowEl && nextBox) {
      nextRowEl.classList.add("next");

      // Index der nextRow im gerenderten data-Array
      const idx = Array.from(tbody.children).indexOf(nextRowEl);
      const nextObj = data[idx];

      const heim = nextObj["Heim-Team"] ?? "";
      const gast = nextObj["Gast-Team"] ?? "";
      const tag  = nextObj["Tag"] ?? "";
      const dat  = formatDE(nextObj["Datum"]);
      const resTxt  = nextObj["Ergebnis"] ? ` | Ergebnis: ${nextObj["Ergebnis"]}` : "";

      // Karte rendern
      nextBox.innerHTML = `
        <p class="title">Nächstes Spiel</p>
        <div class="meta">
          <span class="chip">${heim}</span>
          <span style="align-self:center;">vs.</span>
          <span class="chip">${gast}</span>
          <span class="chip">${tag}, ${dat}${resTxt}</span>
        </div>
      `;
      nextBox.hidden = false;
    } else if (nextBox) {
      nextBox.hidden = true;
    }

    if (statusEl) statusEl.textContent = "";
  } catch (err) {
    console.error("Fehler beim Laden des Spielplans:", err);
    if (statusEl) statusEl.textContent = "Fehler beim Laden des Spielplans.";
    // optional: tbody.innerHTML = '<tr><td colspan="5">Fehler beim Laden</td></tr>';
  } finally {
    // kleine Verzögerung für bessere UX (optional)
    setTimeout(hideLoader, 200);
  }
}

// Startet das Laden beim Skript-Aufruf
loadSpielplan();

// ----- Smooth Scroll: Links auf derselben Seite & Scroll-to-Hash beim Laden -----
// Funktion zum Smooth-Scrollen zu einem Ziel mit Header-Offset
function smoothScrollToHash(hash, headerOffset = 70) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

// Wenn die Seite mit einem Hash geladen wird (z.B. von anderer Seite index.html#ueberuns)
window.addEventListener('load', () => {
  if (window.location.hash) {
    // Verhindere kurz den Browser-Sprung (setzt Ansicht oben), dann smooth scrollen
    // Nur wenn das Ziel existiert
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
      // Sofort nach oben setzen, damit der Browser-Sprung nicht sichtbar ist
      window.scrollTo(0, 0);
      // Kleines Delay, dann smooth scrollen
      setTimeout(() => {
        smoothScrollToHash(hash, 70);
      }, 10);
    }
  }
});

// Smooth scroll für interne Links auf der Seite (nur hrefs die mit # beginnen)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // Falls der Link einen leeren Hash hat (href="#"), ignoriere
    const href = this.getAttribute('href');
    if (!href || href === "#") return;

    // Wenn der Link auf ein Ziel auf derselben Seite verweist -> preventDefault + smooth scroll
    // (dies verhindert nicht Links, die z.B. auf index.html#... zeigen, da diese nicht mit '#' beginnen)
    e.preventDefault();
    smoothScrollToHash(href, 70);
    // optional: update URL ohne springen
    history.replaceState(null, "", href);
  });
});
