// ----- Konfiguration / Konstanten -----
const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";

const statusEl = document.getElementById("plan-status");
const table = document.getElementById("spielplan");
const thead = table ? table.querySelector("thead") : null;
const tbody = table ? (table.querySelector('tbody:not(#spielplan-skeleton)') || table.querySelector("tbody")) : null;
const nextBox = document.getElementById("next-match");

const loader = document.getElementById("plan-loader");
const skeleton = document.getElementById("spielplan-skeleton");

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
  if (loader) { loader.hidden = false; loader.setAttribute("aria-hidden", "false"); }
  if (skeleton) { skeleton.hidden = false; skeleton.setAttribute("aria-hidden", "false"); }
  if (table) { table.classList.add("loading"); table.setAttribute("aria-busy", "true"); }
  if (statusEl) statusEl.textContent = "Lädt…";
}

function hideLoader() {
  if (loader) { loader.hidden = true; loader.setAttribute("aria-hidden", "true"); }
  if (skeleton) { skeleton.hidden = true; skeleton.setAttribute("aria-hidden", "true"); }
  if (table) { table.classList.remove("loading"); table.removeAttribute("aria-busy"); }
  if (statusEl) statusEl.textContent = "";
}

// ----- Laden des Spielplans (async) -----
async function loadSpielplan() {
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

    // Relevante Spalten
    const cols = ["Heim-Team","Gast-Team","Tag","Datum","Ergebnis"];

    // Filter: nur Zeilen mit Inhalt in mindestens einer relevanten Spalte
    const filteredRows = rows.filter(r => 
      cols.some(c => r[c] !== undefined && r[c] !== null && r[c].toString().trim() !== "")
    );

    // Kopfzeile
    thead.innerHTML = `<tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr>`;

    // sortieren nach Datum (aufsteigend)
    const data = filteredRows.slice().sort(
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
        return `<td data-label="${c}">${val}</td>`;
      }).join("");
      return `<tr class="${isUpcoming ? "upcoming" : ""}">${tds}</tr>`;
    }).join("");
    animateRows();

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
  } finally {
    setTimeout(hideLoader, 200);
  }
}

// Startet das Laden beim Skript-Aufruf
loadSpielplan();

// ----- Smooth Scroll: interne Links -----
function smoothScrollToHash(hash, headerOffset = 70) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
}

window.addEventListener('load', () => {
  if (window.location.hash) {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
      window.scrollTo(0, 0);
      setTimeout(() => { smoothScrollToHash(hash, 70); }, 10);
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === "#") return;
    e.preventDefault();
    smoothScrollToHash(href, 70);
    history.replaceState(null, "", href);
  });
});


// === GSAP Setup ===
// (sollte einmal ausgeführt werden; die GSAP-Skripte lädst du ja bereits in HTML)
if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Hilfsvariable für Timeline (um mehrfaches Animieren sauber zu handhaben) ---
let _rowsTimeline = null;

/**
 * animateRows
 * Animiert alle Zeilen im <tbody> nacheinander von oben nach unten.
 * Wird nach dem Rendern der Tabelle aufgerufen.
 */
function animateRows() {
  if (!tbody) return;

  // Selektiere nur sichtbare Zeilen (falls du z.B. Skeleton o.Ä. nutzt)
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (!rows.length) return;

  // Timeline vorher killen, falls vorhanden
  if (_rowsTimeline) {
    try { _rowsTimeline.kill(); } catch (e) { /* ignore */ }
    _rowsTimeline = null;
  }

  // Stellt sicher, dass Zeilen vor der Animation direkt sichtbar/neutral sind
  gsap.set(rows, { clearProps: "all" }); // entfernt alte inline-styles

  // Erstelle eine neue Timeline mit ScrollTrigger: animiert, wenn die Tabelle in Sicht kommt
  _rowsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: table,
      start: "top 85%",    // passt an: "top 85%" bedeutet: wenn obere Kante der Tabelle 85% von viewport-top erreicht
      toggleActions: "play none none none",
      //markers: true, // zum Debuggen aktivieren
    }
  });

  // Animation: von oben (y: -20) und transparent -> in Position
  _rowsTimeline.from(rows, {
    duration: 0.55,
    y: -20,
    opacity: 0,
    ease: "power2.out",
    stagger: 0.07,      // Abstand zwischen den Zeilen (gestaffelt)
    overwrite: true
  });
}

// WARTEN, bis das gesamte HTML-Dokument (DOM) geladen ist
document.addEventListener("DOMContentLoaded", (event) => {
  
  // --- START: Hamburger Menü Code ---
  const hamburgerButton = document.getElementById('hamburger-button');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelector('.nav-links'); // Wir brauchen die Links

  if (hamburgerButton && siteHeader && navLinks) {
    
    // Haupt-Toggle-Funktion
    const toggleMenu = () => {
      const isExpanded = siteHeader.classList.toggle('menu-open');
      hamburgerButton.setAttribute('aria-expanded', isExpanded);
    };
    
    // Klick auf den Button öffnet/schließt das Menü
    hamburgerButton.addEventListener('click', toggleMenu);

    // Klick auf einen Menü-Link (im offenen Menü) schließt das Menü
    // Nützlich für On-Page-Navigation (z.B. #aktuelles)
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && siteHeader.classList.contains('menu-open')) {
        toggleMenu();
      }
    });
  }
  // --- ENDE: Hamburger Menü Code ---


  // Dein bestehender GSAP-Code beginnt hier...
  gsap.registerPlugin(ScrollTrigger,ScrollSmoother)

  // ... (Rest deiner script.js-Datei)
  
}); // Ende des DOMContentLoaded Listeners
