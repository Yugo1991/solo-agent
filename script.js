/* ====== Mobile nav ====== */
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

function setMenu(open) {
  primaryNav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}
menuToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.contains('open');
  setMenu(!isOpen);
});
primaryNav?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => setMenu(false))
);

/* ====== Year ====== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ====== Reveal on scroll ====== */
const revealGroups = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      [...entry.target.children].forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), i * 80);
      });
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealGroups.forEach(g => io.observe(g));

/* ====== Listings filter ====== */
const filterInput = document.getElementById('filterInput');
const clearFilter = document.getElementById('clearFilter');
const listingGrid = document.getElementById('listingGrid');
const listingCards = listingGrid ? [...listingGrid.querySelectorAll('.listing-card')] : [];

function applyFilter() {
  const q = filterInput.value.trim().toLowerCase();
  listingCards.forEach(card => {
    const hay = (card.dataset.tags || '').toLowerCase();
    card.style.display = hay.includes(q) ? '' : 'none';
  });
}
filterInput?.addEventListener('input', applyFilter);
clearFilter?.addEventListener('click', () => {
  filterInput.value = '';
  applyFilter();
  filterInput.focus();
});

/* ====== Simple modals for listings ====== */
const openers = document.querySelectorAll('.open-modal');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('[data-close]');

openers.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.modal;
    const modal = document.getElementById(id);
    if (modal) {
      modal.hidden = false;
      // focus trap (very light)
      const close = modal.querySelector('[data-close]');
      close?.focus();
      function onKey(e) {
        if (e.key === 'Escape') hide();
      }
      function hide() {
        modal.hidden = true;
        document.removeEventListener('keydown', onKey);
      }
      modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
      close?.addEventListener('click', hide, { once: true });
      document.addEventListener('keydown', onKey);
    }
  });
});

/* ====== Contact form (validation + EmailJS hook) ====== */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

function setError(name, msg='') {
  const el = document.querySelector(`.error[data-for="${name}"]`);
  if (el) el.textContent = msg;
}

function validate(formData) {
  let ok = true;
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const type = formData.get('type');
  const timeline = formData.get('timeline');
  const fiverr = formData.get('fiverr');

  setError('name'); setError('email'); setError('type'); setError('timeline'); setError('fiverr');

  if (!name) { setError('name', 'Please enter your name.'); ok = false; }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setError('email', 'Enter a valid email.'); ok = false; }
  if (!type) { setError('type', 'Select one.'); ok = false; }
  if (!timeline) { setError('timeline', 'Select a timeline.'); ok = false; }
  if (!fiverr) { setError('fiverr', 'Choose Yes or No.'); ok = false; }

  return ok;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  formNote.textContent = '';
  const fd = new FormData(form);
  if (!validate(fd)) return;

  // 👉 EmailJS integration (uncomment + fill with your IDs)
  // emailjs.init('YOUR_PUBLIC_KEY');
  // emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID', {
  //   name: fd.get('name'),
  //   email: fd.get('email'),
  //   type: fd.get('type'),
  //   timeline: fd.get('timeline'),
  //   message: fd.get('message'),
  //   fiverr: fd.get('fiverr'),
  // }).then(() => {
  //   form.reset();
  //   formNote.textContent = 'Thanks! I’ll be in touch shortly.';
  // }).catch(() => {
  //   formNote.textContent = 'Something went wrong. Please try again.';
  // });

  // Mock success (remove when EmailJS is connected)
  await new Promise(r => setTimeout(r, 500));
  form.reset();
  formNote.textContent = 'Thanks! I’ll be in touch shortly.';
});
