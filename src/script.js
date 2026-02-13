// ============================================================
// LANDINGPAGE - HAUPTSKRIPT (script.js)
// ============================================================

document.addEventListener("DOMContentLoaded", (event) => {

  // ------------------------------------------------------------
  // 1. SETUP: GSAP & ScrollSmoother
  // ------------------------------------------------------------
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // ScrollSmoother Instanz erstellen
  // Diese Variable ist nun im gesamten Block verfügbar!
  let smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.3,
    effects: false // Parallax wird manuell gesteuert
  });

  // ------------------------------------------------------------
  // 2. HERO ANIMATIONEN
  // ------------------------------------------------------------
  gsap.set(".hero-content", { xPercent: -50, yPercent: -50 });

  // Dartpfeil (.dart)
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

  // Dartscheibe (.dartboard) - Parallax
  gsap.to(".dartboard", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: 150,
    ease: "none"
  });

  // Hero Content Parallax
  gsap.to(".hero-content", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    y: -150,
    ease: "none"
  });

  // ------------------------------------------------------------
  // 3. DART GAME (Interaktion)
  // ------------------------------------------------------------
  const logo = document.querySelector('.logo-title');
  const container = document.querySelector('.dart-stage');

  if (logo && container) {
    logo.addEventListener('click', (event) => {
      const dart = document.createElement('img');
      dart.src = '/images/dartpfeil.png';
      dart.className = 'flying-dart';
      container.appendChild(dart);

      const containerRect = container.getBoundingClientRect();
      const targetX = event.clientX - containerRect.left;
      const targetY = event.clientY - containerRect.top;
      const targetYOffset = targetY - 10;

      const startX = container.offsetWidth + 2550;
      const startY = container.offsetHeight + 100;
      const deltaX = targetX - startX;
      const deltaY = targetYOffset - startY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;

      gsap.fromTo(dart, {
        x: startX,
        y: startY,
        rotation: angle
      }, {
        x: targetX,
        y: targetYOffset,
        rotation: angle,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(dart, {
            rotation: angle + 2,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.to(dart, {
                opacity: 0,
                duration: 0.5,
                delay: 0.5,
                onComplete: () => dart.remove()
              });
            }
          });
        }
      });
    });
  }

  // ------------------------------------------------------------
  // 4. HAMBURGER MENÜ LOGIK (Integriert)
  // ------------------------------------------------------------
  const hamburgerButton = document.getElementById('hamburger-button');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelector('.nav-links');

  if (hamburgerButton && siteHeader && navLinks) {
    const toggleMenu = () => {
      const isExpanded = siteHeader.classList.toggle('menu-open');
      hamburgerButton.setAttribute('aria-expanded', isExpanded);

      // ScrollSmoother pausieren, wenn Menü offen
      if (smoother) {
        if (isExpanded) {
          smoother.paused(true);
          document.body.style.overflow = 'hidden';
        } else {
          smoother.paused(false);
          document.body.style.overflow = '';
        }
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
  // 5. ÜBER UNS - SLIDESHOW
  // ------------------------------------------------------------
  const teamFoto = document.querySelector(".ueberuns-left img.teamfoto");
  if (teamFoto) {
    let images = [];
    let currentIndex = 0;

    fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv")
      .then(res => res.json())
      .then(data => {
        images = data
          .map(row => row["Über-uns Bild"])
          .filter(url => url);

        if (!images.length) return;

        teamFoto.src = images[0];
        //teamFoto.style.width = "600px";
        //teamFoto.style.height = "500px";
        teamFoto.style.objectFit = "cover";

        setInterval(() => {
          const nextIndex = (currentIndex + 1) % images.length;
          const nextSrc = images[nextIndex];

          gsap.to(teamFoto, {
            duration: 0.5,
            x: -100,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
              teamFoto.src = nextSrc;
              gsap.fromTo(teamFoto,
                { x: 100, opacity: 0 },
                { duration: 0.5, x: 0, opacity: 1, ease: "power2.out" }
              );
              currentIndex = nextIndex;
            }
          });
        }, 3000);
      })
      .catch(err => console.error("Fehler beim Laden der Bilder:", err));
  }

  // ------------------------------------------------------------
  // 6. AKTUELLES - GOOGLE SHEETS
  // ------------------------------------------------------------
  (async function() {
    const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv';
    const container = document.getElementById('aktuelles-list');
    if (!container) return;

    function makeCard(item) {
      const cleanKeys = {};
      for (let k in item) {
        cleanKeys[k.trim().toLowerCase()] = item[k];
      }
      const imgUrl = cleanKeys['bild'] || '';
      const title = cleanKeys['titel'] || '';
      const desc = cleanKeys['beschreibung'] || '';

      const card = document.createElement('article');
      card.className = 'aktuelles-card';
      card.setAttribute('role', 'group');

      const img = document.createElement('img');
      img.className = 'aktuelles-card__img';
      img.alt = title || 'Aktuelles Bild';
      img.src = imgUrl;
      img.onerror = () => {
        img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-family="Arial" font-size="18">Kein Bild</text></svg>');
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

    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Netzwerkfehler');
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return;

      const items = data.slice(0, 3);
      container.innerHTML = '';
      items.forEach(item => {
        container.appendChild(makeCard(item));
      });
    } catch (err) {
      console.error(err);
    }
  })();

  // ------------------------------------------------------------
  // 7. TEAM - KARTEN LAYOUT
  // ------------------------------------------------------------
  (async function() {
    const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhkv0mLnP_wSeC9n4yrgF9_QINqGDdYnSfC2nC-cNrggjqETlrSCLOT48cgxPtGMmTbuLYieHboahxXZL5lrOcup5gnpcf-PnVagQx4vXxNqc1qBdxNte2hwriwmMUDTIKmU14PNycBcckGU0iPIEgdnXfcP3SQfrlSQ0-pDBn9ML5vbcBf3wXveZdDyQ2KAtEjKLhCIbXmO8vV7GSLNwNoWWQpsGFAyk1SVguHPXgUVpcC2CATtCO-n5MRmm800s2aZaYcVJzBIMKcA26Bc85HtZm6Dg&lib=MbIlc9TiEEKieF6w4ibl9dJ2Ei9Gn_agv";
    const safe = v => (v === undefined || v === null || String(v).trim() === "") ? "–" : String(v);
    const clean = v => (v === undefined || v === null) ? "" : String(v);
    
    const teamContent = document.getElementById("team-content");
    if (!teamContent) return;

    teamContent.innerHTML = '<p style="text-align:center; width:100%;">Lade Team...</p>';

    let data = [];
    try {
      const res = await fetch(API_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error("Netzwerk");
      data = await res.json();
      if (!Array.isArray(data)) data = [];
    } catch (err) {
      teamContent.innerHTML = "<p style='color:#333; text-align:center;'>Daten konnten nicht geladen werden.</p>";
      return;
    }

    data = data.filter(member => member["Name"]);
    if (data.length === 0) {
      teamContent.innerHTML = "<p style='color:#333; text-align:center;'>Keine Teamdaten gefunden.</p>";
      return;
    }

    teamContent.innerHTML = '';

    data.forEach(member => {
      const card = document.createElement("div");
      card.className = "team-member";

      const picUrl = clean(member["Profilbild"]);
      const imgSrc = picUrl || "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23888'%3EKein Bild%3C/text%3E%3C/svg%3E";

      let dob = safe(member["Date of Birth"]);
      if (dob !== "–" && dob !== "") {
        const d = new Date(dob);
        if (!isNaN(d)) dob = d.toLocaleDateString('de-DE');
      }

      const nicknameHTML = member["Spitzname"] ? `<span class="nickname">"${clean(member["Spitzname"])}"</span>` : "";

      card.innerHTML = `
        <div class="member-image-wrapper">
          <img src="${imgSrc}" alt="${clean(member["Name"])}" loading="lazy">
        </div>
        <div class="member-details">
          <div class="member-header">
              <h3>${clean(member["Name"])}</h3>
              ${nicknameHTML}
          </div>
          <div class="info-grid">
              <span class="info-label">Rolle</span>
              <span class="info-value">${safe(member["Rolle"])}</span>
              <span class="info-label">Hometown</span>
              <span class="info-value">${safe(member["Hometown"])}</span>
              <span class="info-label">Walk-On</span>
              <span class="info-value">${safe(member["Walk-On Music"])}</span>
              <span class="info-label">Darts</span>
              <span class="info-value">${safe(member["Dart Used"])}</span>
              <span class="info-label">Highscore</span>
              <span class="info-value">${safe(member["Highest Score"])}</span>
              <span class="info-label">Geboren</span>
              <span class="info-value">${dob}</span>
          </div>
        </div>
      `;
      teamContent.appendChild(card);
    });
  })();

  // ------------------------------------------------------------
  // 8. INTERNE LINKS (Smooth Scroll)
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      
      // GSAP Smooth Scroll nutzen
      smoother.scrollTo(target, true, "top 70px");
    });
  });

}); // Ende DOMContentLoaded


// ============================================================
// WINDOW LOAD (Loader & Hash Navigation)
// ============================================================
window.addEventListener('load', () => {
  
  // 1. Loader Animation
  if (document.querySelector('.hero-content')) {
    document.body.style.overflow = 'hidden';
    
    const loaderOverlay = document.createElement('div');
    loaderOverlay.id = 'loader-overlay';
    loaderOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#fff; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999;';
    
    const logo = document.createElement('img');
    logo.src = '/images/logo.png'; // Pfad angepasst (mit / am Anfang ist sicherer)
    logo.alt = 'Logo';
    logo.id = 'loader-logo';
    logo.style.animation = 'loader-pulse 1.5s infinite';
    
    loaderOverlay.appendChild(logo);
    document.body.appendChild(loaderOverlay);

    const style = document.createElement('style');
    style.textContent = `
      #loader-logo { width: 520px; height: 400px; }
      @keyframes loader-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
      }
      @media (max-width: 768px) { #loader-logo { width: 320px; height: 200px; } }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      loaderOverlay.style.transition = 'opacity 0.5s';
      loaderOverlay.style.opacity = '0';
      setTimeout(() => {
        loaderOverlay.remove();
        document.body.style.overflow = ''; 

        // Start Animationen nach Loader
        gsap.fromTo(".hero-content", {opacity: 0, x: -100}, {
          duration: 1.5, opacity: 1, x: 0, ease: "power2.out",
          onComplete: () => {
            gsap.set(".dart-title-animation", { x: "1150px", opacity: 0 });
            
            const tl = gsap.timeline({ delay: 1 });
            tl.to(".dart-title-animation", { duration: 1, x: "-300px", ease: "none" });
            tl.to(".dart-title-animation", { duration: 0.5, opacity: 0.5, ease: "power1.in" }, "<");
            tl.to(".dart-title-animation", { duration: 0.2, opacity: 0, ease: "power1.out" }, "<0.7");

            gsap.fromTo(".logo-title", { opacity: 0 }, {
              opacity: 1, y: 0, ease: "power2.out",
              onComplete: () => {
                gsap.fromTo(".cta-wrapper", { y: -200, opacity: 0 }, {
                  opacity: 1, y: 0, ease: "power2.out",
                  onComplete: () => ScrollTrigger.refresh()
                });
              }
            });
          }
        });

        // Sektionen Einblenden
        const sections = [".aktuelles", ".ueberuns", ".team"];
        sections.forEach(section => {
          const h2 = document.querySelector(`${section} h2`);
          if (!h2) return;
          gsap.fromTo(h2, 
            { opacity: 0, y: -60 }, 
            { opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 60%",
                scrub: true,
              }
            }
          );
        });

      }, 500);
    }, 3500);
  }

  // 2. Hash Navigation (z.B. von anderen Seiten kommend)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        // Falls Smoother existiert, nutzen wir ihn (Zugriff via Global oder Instanz)
        const smoother = ScrollSmoother.get();
        if(smoother) {
           smoother.scrollTo(target, true, "top 70px");
        } else {
           target.scrollIntoView();
        }
      }, 500); // Etwas mehr Zeit wegen Loader
    }
  }
});