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
