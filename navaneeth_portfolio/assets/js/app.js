'use strict';

/* ══ CANVAS BACKGROUND ══ */
(function () {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.35 + 0.05,
    };
  }

  for (let i = 0; i < 90; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(232,164,39,0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 72) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 72) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,164,39,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ SIDEBAR CONTACTS TOGGLE ══ */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

/* ══ PAGE NAVIGATION ══ */
const navItems = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navItems.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const label = btn.textContent.trim().toLowerCase();
    navItems.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.querySelector(`[data-page="${label}"]`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Trigger skill animation when resume page opens
      if (label === 'resume') animateSkills();
    }
  });
});

/* ══ SKILL BAR ANIMATION ══ */
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.dataset.width;
    setTimeout(() => { bar.style.width = w + '%'; }, 100);
  });
}

/* ══ TESTIMONIALS SLIDER ══ */
const tTrack = document.getElementById('testimonialsTrack');
const tPrev = document.getElementById('tPrev');
const tNext = document.getElementById('tNext');
const tDotsContainer = document.getElementById('tDots');

let tItems, tTotal, tCurrent = 0;

function initTestimonialSlider() {
  if (!tTrack) return;
  tItems = tTrack.querySelectorAll('.testimonial-card');
  tTotal = tItems.length;
  if (tDotsContainer) {
    tDotsContainer.innerHTML = '';
    for (let i = 0; i < tTotal; i++) {
      const d = document.createElement('div');
      d.className = 'sdot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => scrollToTestimonial(i));
      tDotsContainer.appendChild(d);
    }
  }
}

function scrollToTestimonial(idx) {
  tCurrent = Math.max(0, Math.min(idx, tTotal - 1));
  const item = tItems[tCurrent];
  if (item) tTrack.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
  updateTDots();
}

function updateTDots() {
  if (!tDotsContainer) return;
  tDotsContainer.querySelectorAll('.sdot').forEach((d, i) => {
    d.classList.toggle('active', i === tCurrent);
  });
}

if (tPrev) tPrev.addEventListener('click', () => scrollToTestimonial(tCurrent - 1));
if (tNext) tNext.addEventListener('click', () => scrollToTestimonial(tCurrent + 1));
initTestimonialSlider();

/* ══ TESTIMONIAL MODAL ══ */
const modalBg = document.querySelector('[data-modal-container]');
const modalOverlay = document.querySelector('[data-overlay]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

document.querySelectorAll('[data-testimonials-item]').forEach(card => {
  card.addEventListener('click', () => {
    if (modalImg) modalImg.src = card.querySelector('[data-testimonials-avatar]').src;
    if (modalTitle) modalTitle.textContent = card.querySelector('[data-testimonials-title]').textContent;
    if (modalText) modalText.textContent = card.querySelector('[data-testimonials-text]').textContent;
    if (modalBg) modalBg.classList.add('active');
  });
});

function closeModal() { if (modalBg) modalBg.classList.remove('active'); }
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

/* ══ CLIENTS SLIDER ══ */
const cTrack = document.getElementById('clientsTrack');
const cPrev = document.getElementById('cPrev');
const cNext = document.getElementById('cNext');

if (cPrev && cNext && cTrack) {
  cPrev.addEventListener('click', () => cTrack.scrollBy({ left: -260, behavior: 'smooth' }));
  cNext.addEventListener('click', () => cTrack.scrollBy({ left: 260, behavior: 'smooth' }));
}

/* ══ PORTFOLIO FILTER ══ */
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');
const filterSelect = document.getElementById('filterSelect');

function filterProjects(value) {
  const v = value.toLowerCase();
  filterItems.forEach(item => {
    const cat = (item.dataset.category || '').toLowerCase();
    item.style.display = (v === 'all' || cat === v) ? '' : 'none';
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProjects(btn.textContent.trim());
  });
});

if (filterSelect) {
  filterSelect.addEventListener('change', () => filterProjects(filterSelect.value));
}

/* ══ CONTACT FORM VALIDATION ══ */
const contactForm = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (formInputs.length && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      const allFilled = Array.from(formInputs).every(i => {
        if (i.hasAttribute('required')) return i.value.trim().length > 0;
        return true;
      });
      formBtn.disabled = !allFilled;
    });
  });
}

/* ══ INTERSECTION OBSERVER for skill bars ══ */
const resumeArticle = document.querySelector('[data-page="resume"]');
let skillsAnimated = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      animateSkills();
    }
  });
});
if (resumeArticle) observer.observe(resumeArticle);

/* ══ TOUCH SWIPE for testimonials ══ */
if (tTrack) {
  let touchStartX = 0;
  tTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; });
  tTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) scrollToTestimonial(tCurrent + 1);
      else scrollToTestimonial(tCurrent - 1);
    }
  });
}
