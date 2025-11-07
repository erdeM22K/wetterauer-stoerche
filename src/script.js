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


//Script für "Aktuelles" auf landingpage:

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

