// ============================================================
// KONTAKTSEITE - HAUPTSKRIPT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------------------------------------
  // 1. GSAP Plugin Registrierung (Sicherheitshalber)
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

      // Scrollen verhindern, wenn Menü offen ist
      if (isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    hamburgerButton.addEventListener('click', toggleMenu);

    // Menü schließen, wenn man auf einen Link klickt
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && siteHeader.classList.contains('menu-open')) {
        toggleMenu();
      }
    });
  }

  // ------------------------------------------------------------
  // 3. Datenschutz Modal (Popup)
  // ------------------------------------------------------------
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const modal = document.getElementById('privacy-modal');
  const closePrivacyBtn = document.getElementById('close-privacy-btn');
  const backdrop = document.querySelector('.privacy-backdrop');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Scrollen der Seite sperren
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      // Nur entsperren, wenn das Hamburger Menü NICHT offen ist
      if (!siteHeader || !siteHeader.classList.contains('menu-open')) {
        document.body.style.overflow = '';
      }
    }
  };

  if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', openModal);
  if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Schließen mit ESC-Taste
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ------------------------------------------------------------
  // 4. EmailJS Formular Logik
  // ------------------------------------------------------------
  const form = document.getElementById("contactForm");

  // Nur ausführen, wenn EmailJS geladen ist und das Formular existiert
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

      // Daten sammeln
      const vorname = form.vorname.value.trim();
      const nachname = form.nachname.value.trim();
      const fromEmail = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = `Neue Kontaktanfrage: ${vorname} ${nachname}`;

      const params = {
        subject,
        vorname,
        nachname,
        from_email: fromEmail,
        message,
        name: `${vorname} ${nachname}`,
        email: fromEmail,
      };

      // Button Status ändern
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Senden …";

      try {
        // Mails senden
        await emailjs.send(SERVICE_ID, TEMPLATE_TO_OWNER, params);
        await emailjs.send(SERVICE_ID, TEMPLATE_AUTO, params);

        // Erfolg anzeigen
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
      // Ignoriere den Datenschutz-Link (wird vom Modal-Skript behandelt)
      if (this.id === 'open-privacy-btn') return;

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

}); // Ende DOMContentLoaded


// ============================================================
// WINDOW LOAD (Warten bis alles, inkl. CSS/Bilder, fertig ist)
// ============================================================
window.addEventListener('load', () => {
  // Wenn URL einen Hash hat (z.B. contacts.html#team), direkt dorthin scrollen
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 50);
    }
  }
});