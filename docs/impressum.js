// ============================================================
// IMPRESSUM / DATENSCHUTZ - SCRIPTS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // 1. GSAP SETUP & SMOOTH SCROLL
  // ------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    
    // Wenn du ScrollSmoother auf der Seite nutzen willst:
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true // Nötig für ScrollTrigger-Effekte im Smoother
    });


    // ------------------------------------------------------------
    // 2. ANIMATIONEN FÜR TEXTBLÖCKE
    // ------------------------------------------------------------
    
    // A) Die Hauptüberschrift animieren (direkt beim Laden)
    const mainTitle = document.querySelector('.legal-container h1');
    if (mainTitle) {
      gsap.fromTo(mainTitle, 
        { 
          opacity: 0, 
          y: 50 // Startet 50px tiefer
        }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          delay: 0.3, // Kurze Wartezeit nach Laden
          ease: "power3.out" // Sehr sanftes Abbremsen
        }
      );
    }

    // B) Die einzelnen Blöcke beim Scrollen animieren
    const blocks = document.querySelectorAll('.legal-block');
    
    blocks.forEach((block) => {
      // Für jeden Block eine eigene ScrollTrigger-Animation erstellen
      gsap.fromTo(block,
        {
          opacity: 0,
          y: 60, // Kommt von etwas weiter unten
          filter: "blur(5px)" // Optional: leichter Unschärfe-Effekt beim Reinkommen
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%", // Animation startet, wenn das Element im unteren Drittel des Bildschirms auftaucht
            toggleActions: "play none none none" // Spielt die Animation nur einmal ab (wirkt ruhiger)
          }
        }
      );
    });
  }


  // ------------------------------------------------------------
  // 3. HAMBURGER MENÜ LOGIK (Standard)
  // ------------------------------------------------------------
  const hamburgerButton = document.getElementById('hamburger-button');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelector('.nav-links');

  if (hamburgerButton && siteHeader && navLinks) {
    const toggleMenu = () => {
      const isExpanded = siteHeader.classList.toggle('menu-open');
      hamburgerButton.setAttribute('aria-expanded', isExpanded);

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
});