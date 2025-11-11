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


// contacts.js
(() => {
  // 1) EmailJS initialisieren
  emailjs.init({ publicKey: "B_UNmss4zAYXa4JKZ" });

  // 2) IDs
  const SERVICE_ID = "service_8co67m8";
  const TEMPLATE_TO_OWNER = "template_to_owner";    // dein Kontakt-Template (Screenshot 1)
  const TEMPLATE_AUTO     = "template_auto_reply";  // dein Auto-Reply-Template (Screenshot 2)

  // 3) Form & Button
  const form = document.getElementById("contactForm");
  const btn  = form.querySelector(".btn");

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
      subject,
      vorname,
      nachname,
      from_email: fromEmail,
      message,
      name: `${vorname} ${nachname}`,
      email: fromEmail,
    };

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Senden …";

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_TO_OWNER, params);
      await emailjs.send(SERVICE_ID, TEMPLATE_AUTO, params);

      // ✅ Erfolg: grün leuchtender Button
      btn.textContent = "Gesendet!";
      btn.classList.add("success"); // ← CSS-Klasse aktivieren
      form.reset();

      // Nach 2 Sekunden Button zurücksetzen
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
})();


  const toggle = document.querySelector('.nav-toggle');
  const navInner = document.querySelector('.nav-inner');

  toggle.addEventListener('click', () => {
    const isOpen = navInner.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  
  //Für SmoothScrolling auf inddex.html
window.addEventListener('load', () => {
  // Prüfen, ob URL einen Hash enthält
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      const headerOffset = 70; // Höhe des fixen Headers
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Kurzes Timeout, damit Browser fertig geladen hat
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 50);
    }
  }
});

// Smooth scroll für interne Links auf der Startseite
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
