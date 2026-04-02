/* ===========================
   GreenEdge Lawn Care — JS
   =========================== */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── Scroll reveal (service cards + general) ───────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.index ? parseInt(el.dataset.index) * 100 : 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card').forEach(card => {
  revealObserver.observe(card);
});

// ── Active nav link highlighting ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));

// ── Smooth scrolling for all anchor links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Quote form handling ───────────────────────────────────
const form = document.getElementById('quote-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Basic validation
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e53e3e';
      valid = false;
    }
  });

  // Email check
  const emailField = form.querySelector('#email');
  if (emailField.value && !validateEmail(emailField.value)) {
    emailField.style.borderColor = '#e53e3e';
    valid = false;
  }

  if (!valid) {
    const firstErr = form.querySelector('[style*="border-color: rgb(229"]');
    if (firstErr) firstErr.focus();
    shakeForm();
    return;
  }

  // Simulate submission
  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    form.style.display = 'none';
    formSuccess.classList.add('show');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 900);
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  const wrap = document.querySelector('.contact-form-wrap');
  wrap.style.animation = 'shake 0.4s ease';
  setTimeout(() => { wrap.style.animation = ''; }, 400);
}

// Inject shake keyframe
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// Clear red border on input
form.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.style.borderColor = '';
  });
});

// ── Phone number auto-format ──────────────────────────────
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 10);
    if (v.length >= 6) {
      v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
    } else if (v.length >= 3) {
      v = `(${v.slice(0,3)}) ${v.slice(3)}`;
    }
    this.value = v;
  });
}

// ── Grass blade sway on hero load ────────────────────────
// Already handled via CSS animation, nothing needed here

// ── Stat counter animation ────────────────────────────────
function animateCounters() {
  const stats = document.querySelectorAll('.stat-num');
  stats.forEach(stat => {
    const text = stat.textContent;
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');

    if (isNaN(num)) return;

    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = num / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        start = num;
        clearInterval(timer);
      }
      stat.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
    }, step);
  });
}

// Trigger on hero visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) heroObserver.observe(heroSection);

// ── Lazy-reveal feature cards (why-us) ───────────────────
const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      featureObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.45s ${i * 0.07}s ease, transform 0.45s ${i * 0.07}s ease`;
  featureObserver.observe(el);
});

// ── Testimonial reveal ────────────────────────────────────
const testimonialObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.classList.contains('featured')
        ? 'scale(1.03)'
        : 'translateY(0)';
      testimonialObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.testimonial-card').forEach((card, i) => {
  card.style.opacity = '0';
  const isFeatured = card.classList.contains('featured');
  card.style.transform = isFeatured ? 'scale(0.97)' : 'translateY(20px)';
  card.style.transition = `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease`;
  testimonialObserver.observe(card);
});

// ── BA card reveal ────────────────────────────────────────
const baObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      baObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.ba-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = `opacity 0.5s ${i * 0.15}s ease, transform 0.5s ${i * 0.15}s ease`;
  baObserver.observe(card);
});

console.log('GreenEdge Lawn Care — site loaded ✅');
