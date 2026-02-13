// ============================================================
// KONTAKTSEITE - HAUPTSKRIPT (contacts.js)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // 1. GSAP Plugin Registrierung
  // ------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  }

  // ------------------------------------------------------------
  // 2. Hamburger Menü Logik (mit Scroll-Sperre)
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

  // ------------------------------------------------------------
  // 3. Datenschutz Modal & Auto-Open Logik
  // ------------------------------------------------------------
  const modal = document.getElementById('privacy-modal');
  const closePrivacyBtn = document.getElementById('close-privacy-btn');
  const backdrop = document.querySelector('.privacy-backdrop');
  const privacyTriggers = document.querySelectorAll('.open-privacy-trigger, #open-privacy-btn');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (!siteHeader || !siteHeader.classList.contains('menu-open')) {
        document.body.style.overflow = '';
      }
      history.replaceState(null, null, ' ');
    }
  };

  privacyTriggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (window.location.hash === '#datenschutz') {
    setTimeout(() => { openModal(); }, 100);
  }

  // ------------------------------------------------------------
  // 4. EmailJS Formular Logik
  // ------------------------------------------------------------
  const form = document.getElementById("contactForm");

  if (typeof emailjs !== 'undefined' && form) {
    emailjs.init({ publicKey: "B_UNmss4zAYXa4JKZ" });

    const SERVICE_ID = "service_8co67m8";
    const TEMPLATE_TO_OWNER = "template_to_owner";
    const TEMPLATE_AUTO = "template_auto_reply";
    const btn = form.querySelector(".btn");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (!form.consent.checked) {
        alert("Bitte bestätige die Datenschutzerklärung.");
        return;
      }

      const vorname = form.vorname.value.trim();
      const nachname = form.nachname.value.trim();
      const fromEmail = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = `Neue Kontaktanfrage: ${vorname} ${nachname}`;

      const params = {
        subject, vorname, nachname, from_email: fromEmail, message,
        name: `${vorname} ${nachname}`, email: fromEmail,
      };

      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Senden …";

      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_TO_OWNER, params);
        await emailjs.send(SERVICE_ID, TEMPLATE_AUTO, params);

        btn.textContent = "Gesendet!";
        btn.classList.add("success");
        form.reset();

        setTimeout(() => {
          btn.classList.remove("success");
          btn.disabled = false;
          btn.textContent = originalText;
        }, 2000);

      } catch (err) {
        console.error("EmailJS Error:", err);
        alert(`Senden fehlgeschlagen: ${err?.text || err?.message || "Unbekannter Fehler"}`);
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // ------------------------------------------------------------
  // 5. Smooth Scrolling für interne Links
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.id === 'open-privacy-btn' || this.classList.contains('open-privacy-trigger')) return;

      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ------------------------------------------------------------
  // 6. NEU: GSAP Animationen (Links/Rechts Slide-In)
  // ------------------------------------------------------------
  const leftSec = document.getElementById("left-section");
  const rightSec = document.getElementById("right-section");

  // Nur ausführen, wenn wir auf der Kontaktseite sind
  if (leftSec && rightSec && typeof gsap !== 'undefined') {
    
    // Linke Spalte: Kommt von links (-100px) und wird sichtbar
    gsap.fromTo(leftSec, 
      { x: -100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power2.out",
        delay: 0.2 // Kurze Verzögerung nach Laden
      }
    );

    // Rechte Spalte: Kommt von rechts (+100px) und wird sichtbar
    gsap.fromTo(rightSec, 
      { x: 100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power2.out",
        delay: 0.2 // Gleiche Verzögerung, damit sie gleichzeitig kommen
      }
    );
  }

}); // Ende DOMContentLoaded


// ============================================================
// WINDOW LOAD (Hash Navigation Fallback)
// ============================================================
window.addEventListener('load', () => {
  if (window.location.hash && window.location.hash !== '#datenschutz') {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      setTimeout(() => {
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 50);
    }
  }
});