// ============================================================
// SPIELPLAN - HAUPTSKRIPT (gameplan.js)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // 1. SETUP & KONSTANTEN
  // ------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  }

  const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";

  const statusEl = document.getElementById("plan-status");
  const table = document.getElementById("spielplan");
  const thead = table ? table.querySelector("thead") : null;
  // Fallback: Sucht tbody, ignoriert dabei aber das Skeleton, falls es im HTML so strukturiert ist
  const tbody = table ? (table.querySelector('tbody:not(#spielplan-skeleton)') || table.querySelector("tbody")) : null;
  const nextBox = document.getElementById("next-match");
  const loader = document.getElementById("plan-loader");
  const skeleton = document.getElementById("spielplan-skeleton");

  // Hilfsvariable für Animation
  let _rowsTimeline = null;


  // ------------------------------------------------------------
  // 2. HAMBURGER MENÜ LOGIK (mit Scroll-Sperre)
  // ------------------------------------------------------------
  const hamburgerButton = document.getElementById('hamburger-button');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelector('.nav-links');

  if (hamburgerButton && siteHeader && navLinks) {
    const toggleMenu = () => {
      const isExpanded = siteHeader.classList.toggle('menu-open');
      hamburgerButton.setAttribute('aria-expanded', isExpanded);

      // Scrollen verhindern, wenn Menü offen ist
      if (isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    hamburgerButton.addEventListener('click', toggleMenu);

    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && siteHeader.classList.contains('menu-open')) {
        toggleMenu();
      }
    });
  }


  // ------------------------------------------------------------
  // 3. HILFSFUNKTIONEN (Datum, Loader, Animation)
  // ------------------------------------------------------------
  
  function formatDE(dStr) {
    const d = new Date(dStr);
    if (isNaN(d)) return dStr || "";
    return d.toLocaleDateString('de-DE');
  }

  function toDate(dStr) {
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

  /**
   * animateRows
   * Animiert alle Zeilen im <tbody> nacheinander von oben nach unten.
   */
  function animateRows() {
    if (!tbody || typeof gsap === "undefined") return;

    // Selektiere nur sichtbare Zeilen
    const rows = Array.from(tbody.querySelectorAll("tr"));
    if (!rows.length) return;

    // Timeline vorher killen, falls vorhanden
    if (_rowsTimeline) {
      try { _rowsTimeline.kill(); } catch (e) { /* ignore */ }
      _rowsTimeline = null;
    }

    // Stellt sicher, dass Zeilen vor der Animation direkt sichtbar/neutral sind
    gsap.set(rows, { clearProps: "all" });

    // Erstelle eine neue Timeline mit ScrollTrigger
    _rowsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: table,
        start: "top 85%", 
        toggleActions: "play none none none",
      }
    });

    // Animation: von oben (y: -20) und transparent -> in Position
    _rowsTimeline.from(rows, {
      duration: 0.55,
      y: -20,
      opacity: 0,
      ease: "power2.out",
      stagger: 0.07,
      overwrite: true
    });
  }


  // ------------------------------------------------------------
  // 4. HAUPTLOGIK: SPIELPLAN LADEN
  // ------------------------------------------------------------
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

      // Sortieren nach Datum (aufsteigend)
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
      
      // Animation starten
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

  // Initialer Aufruf
  loadSpielplan();


  // ------------------------------------------------------------
  // 5. SMOOTH SCROLLING (Hash & Interne Links)
  // ------------------------------------------------------------
  function smoothScrollToHash(hash, headerOffset = 70) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }

  // Beim Laden prüfen ob Hash in URL
  if (window.location.hash) {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
      window.scrollTo(0, 0); // Sprung verhindern
      setTimeout(() => { smoothScrollToHash(hash, 70); }, 50); // Timeout etwas erhöht für Sicherheit
    }
  }

  // Interne Links abfangen
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === "#") return;
      e.preventDefault();
      smoothScrollToHash(href, 70);
      // Optional: Hash in URL aktualisieren ohne Sprung
      history.replaceState(null, "", href);
    });
  });

}); // Ende DOMContentLoaded