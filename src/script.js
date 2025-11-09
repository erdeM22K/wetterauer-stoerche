// WARTEN, bis das gesamte HTML-Dokument (DOM) geladen ist
 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger,ScrollSmoother)

  // 2. ScrollSmoother Instanz erstellen
  let smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.3,
    // Wir setzen effects auf 'false', da wir die Parallax manuell mit GSAP steuern
    effects: false 
  });

  // 3. Animation für den Dartpfeil (.dart)
  // WICHTIG: Wir fügen 'scroller: smoother.scroller' hinzu,
  // damit ScrollTrigger weiß, dass es den Smoother überwachen soll.
  gsap.to(".dart", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    x: "-20vw",
    y: "20vh", 
    rotation: -2,
    ease: "power2.out"
  });

  // 4. Animation für die Dartscheibe (.dartboard)
  gsap.to(".dartboard", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: 150, // Bewegt das Dartboard langsam nach unten (Parallax)
    ease: "none"
  });

    gsap.to(".hero-content", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: -150, // Bewegt das Dartboard langsam nach unten (Parallax)
    ease: "none"
  });

  gsap.to(".hero", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top", // Startet, wenn der Hero-Top auf den Viewport-Top trifft
      end: "bottom 50%",  // Der Blur ist weg, wenn der Hero zur Hälfte gescrollt ist
      scrub: true,
    },
    "--hero-blur": "2px", // Zielwert: kein Blur
    ease: "none"
  });

/* gsap.to("body", {
    scrollTrigger: {
      trigger: ".aktuelles",
      start: "top 80%",  // Starte den Fade, wenn die Sektion zu 20% im Bild ist
      end: "bottom 100%", // Beende den Fade, wenn 80% der Sektion durchgescrollt sind
      scrub: true,
    },
    backgroundColor: "#fff",
    ease: "none"
  });

  // Von .aktuelles (#fff) zu .ueberuns (#222)
  gsap.to("body", {
    scrollTrigger: {
      trigger: ".ueberuns",
      start: "top 100%",
      end: "bottom 100%",
      scrub: true,
    },
    backgroundColor: "#222",
    ease: "none"
  });

  // Von .ueberuns (#222) zu .team (#fff)
  gsap.to("body", {
    scrollTrigger: {
      trigger: ".team",
      start: "top 100%",
      end: "bottom 100%",
      scrub: true,
    },
    backgroundColor: "#fff",
    ease: "none"
  });

  // Von .team (#fff) zu .footer (#000)
  gsap.to("body", {
    scrollTrigger: {
      trigger: ".footer",
      start: "top 80%",
      end: "bottom 80%", 
      scrub: true,
    },
    backgroundColor: "#000",
    ease: "none"
  }); */

}); // Ende des DOMContentLoaded Listeners


//Für SektionScroll von anderen Seiten aus (Contacts oder Gameplan)
window.addEventListener('load', () => {
  // Prüfen, ob URL einen Hash enthält
  if (window.location.hash) {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Sofort auf 0 scrollen, um Sprung zu verhindern
      window.scrollTo(0, 0);

      // Dann smooth scrollen
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 10); // Kurzes Delay, 10ms reicht
    }
  }
});

// Smooth scroll für interne Links auf der Seite
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const headerOffset = 70;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});


/////////////////////////////////////////////////////
//  --- Script für "Aktuelles" auf landingpage --- //
/////////////////////////////////////////////////////
(async function() {
  // === ERSETZE DIES mit deiner Apps-Script-Webapp-URL ===
  const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv';

  const container = document.getElementById('aktuelles-list');

  function makeCard(item) {
  // Alle Keys lowercase & ohne Leerzeichen
  const cleanKeys = {};
  for (let k in item) {
    cleanKeys[k.trim().toLowerCase()] = item[k];
  }

  const imgUrl = cleanKeys['bild'] || '';
  const title  = cleanKeys['titel'] || '';
  const desc   = cleanKeys['beschreibung'] || '';

  const card = document.createElement('article');
  card.className = 'aktuelles-card';
  card.setAttribute('role','group');

  const img = document.createElement('img');
  img.className = 'aktuelles-card__img';
  img.alt = title || 'Aktuelles Bild';
  img.src = imgUrl;
  img.onerror = () => {
    img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-family="Arial" font-size="18">Kein Bild</text></svg>'
    );
  };

  const content = document.createElement('div');
  content.className = 'aktuelles-card__content';

  const h3 = document.createElement('h3');
  h3.className = 'aktuelles-card__title';
  h3.textContent = title || 'Kein Titel';

  const p = document.createElement('p');
  p.className = 'aktuelles-card__description';
  p.textContent = desc || '';

  content.appendChild(h3);
  content.appendChild(p);
  card.appendChild(img);
  card.appendChild(content);

  return card;
}

  function showError(msg) {
    container.innerHTML = '';
    const err = document.createElement('div');
    err.style.color = '#b00020';
    err.textContent = msg;
    container.appendChild(err);
  }

  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Netzwerkfehler: ' + res.status);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      showError('Keine Einträge gefunden.');
      return;
    }

    // wir nehmen die ersten 3 (oder weniger, falls nicht vorhanden)
    const items = data.slice(0, 3);

    // Leeren und füllen
    container.innerHTML = '';
    items.forEach(item => {
      const card = makeCard(item);
      container.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    showError('Fehler beim Laden der Daten. Prüfe die API-URL und die Veröffentlichung als Web-App.');
  }
})();


//Script für "Team" auf LandingPage
document.addEventListener("DOMContentLoaded", () => {
  const members = document.querySelectorAll(".team-member");
  const overlay = document.querySelector(".info-overlay");

  members.forEach(member => {
    const img = member.querySelector("img");
    const info = member.querySelector(".member-info");

    img.addEventListener("click", (e) => {
      const isMobile = window.innerWidth <= 1024;

      // andere Infos schließen
      document.querySelectorAll(".member-info.active").forEach(i => {
        if(i !== info) i.classList.remove("active");
      });

      // overlay toggle
      overlay.classList.add("active");
      info.classList.add("active");
    });
  });

  // Klick auf Overlay schließt alle Infokästen
  overlay.addEventListener("click", () => {
    document.querySelectorAll(".member-info.active").forEach(i => i.classList.remove("active"));
    overlay.classList.remove("active");
  });
});




////////////////////////////////////////////
//  --- Team-Sektion aus GoogleSheets --- //
////////////////////////////////////////////
(async function(){
  const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";

  const safe = v => (v === undefined || v === null) ? "" : String(v);

  const teamContent = document.getElementById("team-content");
  const overlay = document.getElementById("info-overlay");
  const modal = document.getElementById("modal-info");
  const modalAvatar = document.getElementById("modal-avatar");
  const modalName = document.getElementById("modal-name");
  const modalWalkon = document.getElementById("modal-walkon");
  const modalDob = document.getElementById("modal-dob");
  const modalDart = document.getElementById("modal-dart");
  const modalTown = document.getElementById("modal-hometown");
  const modalHigh = document.getElementById("modal-high");
  const modalRole = document.getElementById("modal-role");
  const modalClose = document.getElementById("modal-close");

  // === relevante Spalten für Team-Mitglieder ===
  const wantedHeaders = [
    "Profilbild", "Name", "Spitzname", "Walk-On Music",
    "Date of Birth", "Dart Used", "Hometown", "Highest Score", "Rolle"
  ];

  // fetch from API
  let data = [];
  try {
    const res = await fetch(API_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error("Netzwerk: " + res.status);
    data = await res.json();
    if (!Array.isArray(data)) {
      console.error("API returned non-array:", data);
      data = [];
    }
  } catch (err) {
    console.error("Fehler beim Laden der Teamdaten:", err);
    teamContent.innerHTML = "<p style='color:#333'>Fehler beim Laden der Teamdaten (Konsole).</p>";
    return;
  }
  console.log("Fetched data:", data);

  // Filter: nur Zeilen, die tatsächlich Team-Mitglieder enthalten
  data = data
    .map(member => {
      const filtered = {};
      wantedHeaders.forEach(h => { filtered[h] = member[h]; });
      return filtered;
    })
    .filter(member => member["Name"]);

  if (data.length === 0) {
    teamContent.innerHTML = "<p style='color:#333'>Keine Teamdaten gefunden.</p>";
    return;
  }

  // Create cards
  data.forEach(member => {
    const card = document.createElement("div");
    card.className = "team-member";
    
    // avatar
    const img = document.createElement("img");
    img.className = "avatar";
    const pic = safe(member["Profilbild"]);
    img.src = pic || ("data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#e9e9e9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#bdbdbd' font-size='24'>kein Bild</text></svg>`));
    img.alt = safe(member["Name"]) + " Profilbild";

    // visible name under avatar
    const nameEl = document.createElement("h3");
    nameEl.textContent = safe(member["Name"]) || safe(member["Spitzname"]) || "Unbekannt";

    // click behavior -> open modal
    card.addEventListener("click", () => openModal(member));

    // hidden info node (accessibility)
    const hiddenInfo = document.createElement("div");
    hiddenInfo.className = "member-info";
    hiddenInfo.setAttribute("aria-hidden", "true");
    hiddenInfo.innerHTML = `<div class="member-info-left"><img src="${img.src}" alt=""/></div>
                            <div class="member-info-right">
                              <h4>${safe(member["Name"])} ${safe(member["Spitzname"]) ? '"' + safe(member["Spitzname"]) + '"' : ""}</h4>
                            </div>`;

    card.appendChild(img);
    card.appendChild(nameEl);
    card.appendChild(hiddenInfo);
    teamContent.appendChild(card);
  });

  // Modal open
  function openModal(member) {
  modalAvatar.src = safe(member["Profilbild"]) || modalAvatar.src;
  modalAvatar.alt = safe(member["Name"]) + " Profilbild";
  modalName.textContent = safe(member["Name"]); // optional Spitzname entfernen, falls alles im Namen enthalten
  modalWalkon.textContent = safe(member["Walk-On Music"]);

  // Nur das Datum anzeigen, ohne Uhrzeit
  const dob = member["Date of Birth"];
  if (dob) {
    const d = new Date(dob);
    modalDob.textContent = isNaN(d) ? dob : d.toLocaleDateString('de-DE');
  } else {
    modalDob.textContent = "";
  }

  modalDart.textContent = safe(member["Dart Used"]);
  modalTown.textContent = safe(member["Hometown"]);
  modalHigh.textContent = safe(member["Highest Score"]);
  modalRole.textContent = safe(member["Rolle"]);

  overlay.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  teamContent.classList.add("blur");
  modalClose.focus();
}

  // Close modal
  function closeModal(){
    overlay.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    teamContent.classList.remove("blur");
  }

  overlay.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

})();


////////////////////////////////////////
//  --- Landingpage Ladeanimation --- //
////////////////////////////////////////
window.addEventListener('load', () => {
  // Overlay erstellen
  const loaderOverlay = document.createElement('div');
  loaderOverlay.id = 'loader-overlay';
  loaderOverlay.style.position = 'fixed';
  loaderOverlay.style.top = '0';
  loaderOverlay.style.left = '0';
  loaderOverlay.style.width = '100%';
  loaderOverlay.style.height = '100%';
  loaderOverlay.style.backgroundColor = '#fff';
  loaderOverlay.style.display = 'flex';
  loaderOverlay.style.flexDirection = 'column';
  loaderOverlay.style.justifyContent = 'center';
  loaderOverlay.style.alignItems = 'center';
  loaderOverlay.style.zIndex = '9999';

  // Logo erstellen
  const logo = document.createElement('img');
  logo.src = '../images/logo.png';
  logo.alt = 'Logo';
  logo.id = 'loader-logo';
  logo.style.animation = 'loader-pulse 1.5s infinite';

  loaderOverlay.appendChild(logo);
  document.body.appendChild(loaderOverlay);

  // CSS Animation + responsive Logo
  const style = document.createElement('style');
  style.textContent = `
    #loader-logo {
      width: 520px;
      height: 400px;
    }
    @keyframes loader-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
    }
    @media (max-width: 768px) {
      #loader-logo {
        width: 320px;
        height: 200px;
      }
    }
  `;
  document.head.appendChild(style);

  // Overlay nach 2.5 Sekunden ausblenden
  setTimeout(() => {
    loaderOverlay.style.transition = 'opacity 0.5s';
    loaderOverlay.style.opacity = '0';
    setTimeout(() => {
      loaderOverlay.remove();
    }, 500);
  }, 3500);
});

