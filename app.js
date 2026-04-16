document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // LANGUAGE SYSTEM (tu original)
  // =========================

  const btnEn = document.getElementById("lang-en");
  const btnEs = document.getElementById("lang-es");

  function setLanguage(language) {
    const enTexts = document.querySelectorAll(".lang.en");
    const esTexts = document.querySelectorAll(".lang.es");

    if (language === "es") {
      enTexts.forEach(el => el.style.display = "none");
      esTexts.forEach(el => el.style.display = "inline");
      btnEn.classList.remove("active");
      btnEs.classList.add("active");
    } else {
      enTexts.forEach(el => el.style.display = "inline");
      esTexts.forEach(el => el.style.display = "none");
      btnEs.classList.remove("active");
      btnEn.classList.add("active");
    }

    localStorage.setItem("siteLanguage", language);
  }

  btnEn?.addEventListener("click", () => setLanguage("en"));
  btnEs?.addEventListener("click", () => setLanguage("es"));

  setLanguage(localStorage.getItem("siteLanguage") || "en");


  // =========================
  // 🔥 SCROLL ANIMATIONS (PRO)
  // =========================

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(
    ".service-card, .why-card, .before-after-card, .hero-card"
  ).forEach(el => {
    el.classList.add("hidden");
    observer.observe(el);
  });


  // =========================
  // 🔥 HEADER EFFECT
  // =========================

  const header = document.querySelector(".site-header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "#000";
      header.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    } else {
      header.style.background = "#111";
      header.style.boxShadow = "none";
    }
  });


  // =========================
  // 🔥 PARALLAX HERO
  // =========================

  const hero = document.querySelector(".hero");

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    if (hero) {
      hero.style.backgroundPositionY = scroll * 0.5 + "px";
    }
  });


  // =========================
  // 🔥 NAV SMOOTH SCROLL
  // =========================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

});
