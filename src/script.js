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

