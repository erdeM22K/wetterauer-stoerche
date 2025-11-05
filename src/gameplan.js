const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";

const statusEl = document.getElementById("plan-status");
const table = document.getElementById("spielplan");
const thead = table.querySelector("thead");
const tbody = table.querySelector("tbody");
const nextBox = document.getElementById("next-match"); // Karte oben

// Datum hübsch: 31.10.2025
function formatDE(dStr){
  const d = new Date(dStr);
  if (isNaN(d)) return dStr || "";
  return d.toLocaleDateString('de-DE');
}

function toDate(dStr){
  const d = new Date(dStr);
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

fetch(API_URL)
  .then(r => r.json())
  .then(rows => {
    if (!rows || !rows.length){
      statusEl.textContent = "Keine Einträge gefunden.";
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
        return `<td data-label="${c}">${val}</td>`;
      }).join("");
      return `<tr class="${isUpcoming ? "upcoming" : ""}">${tds}</tr>`;
    }).join("");

    // Nächstes Spiel finden
    const nextRowEl = tbody.querySelector("tr.upcoming");
    if (nextRowEl) {
      nextRowEl.classList.add("next");

      const idx = Array.from(tbody.children).indexOf(nextRowEl);
      const nextObj = data[idx];

      // Werte für Karte
      const heim = nextObj["Heim-Team"] ?? "";
      const gast = nextObj["Gast-Team"] ?? "";
      const tag  = nextObj["Tag"] ?? "";
      const dat  = formatDE(nextObj["Datum"]);
      const res  = nextObj["Ergebnis"] ? ` | Ergebnis: ${nextObj["Ergebnis"]}` : "";

      // Karte rendern
      nextBox.innerHTML = `
        <p class="title">Nächstes Spiel</p>
        <div class="meta">
          <span class="chip">${heim}</span>
          <span style="align-self:center;">vs.</span>
          <span class="chip">${gast}</span>
          <span class="chip">${tag}, ${dat}${res}</span>
        </div>
      `;
      nextBox.hidden = false;
    } else {
      nextBox.hidden = true;
    }

    statusEl.textContent = ""; // alles ok
  })
  .catch(err => {
    console.error(err);
    statusEl.textContent = "Fehler beim Laden des Spielplans.";
  });
