// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const siteHeader = document.getElementById("siteHeader");

function setMenuExpanded(isOpen) {
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  setMenuExpanded(isOpen);
});

// Close menu when clicking a link (mobile)
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    setMenuExpanded(false);
  });
});

// Close menu if clicking outside (mobile)
document.addEventListener("click", (e) => {
  const clickedInsideNav = navLinks.contains(e.target) || menuToggle.contains(e.target);
  if (!clickedInsideNav && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    setMenuExpanded(false);
  }
});

// Reveal on scroll (fade + blur)
const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach(el => io.observe(el));

// HERO parallax "fade away"
const hero = document.querySelector(".hero");
function onScrollEffects() {
  const y = window.scrollY || 0;

  // Header glass when scrolled
  if (y > 10) siteHeader.classList.add("scrolled");
  else siteHeader.classList.remove("scrolled");

  // Hero background parallax + fade
  // We target the ::before by setting CSS variables on .hero
  const max = hero ? hero.offsetHeight : 1;
  const t = Math.min(y / max, 1);       // 0..1
  const parallax = Math.min(y * 0.18, 60); // px

  if (hero) {
    hero.style.setProperty("--parallax", `${parallax}px`);
    hero.style.setProperty("--heroFade", `${1 - t * 0.55}`);
  }
}

window.addEventListener("scroll", onScrollEffects, { passive: true });
onScrollEffects();

// Apply the hero CSS vars to the background
// (kept in JS so it runs even if you change hero height)
const style = document.createElement("style");
style.innerHTML = `
  .hero::before{
    transform: translate3d(0, var(--parallax, 0px), 0);
    opacity: var(--heroFade, .55);
  }
`;
document.head.appendChild(style);

// Gallery Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-item").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);

// Close if clicking the dark background
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Close on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
