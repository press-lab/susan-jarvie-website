// Active nav highlight (relative-path aware — works on GitHub Pages subpaths)
function markActiveNav() {
  let current = window.location.pathname.split('/').pop();
  if (!current || current === '') current = 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    const target = href === '' ? 'index.html' : href;
    if (target === current && href !== '#') a.classList.add('active');
  });
}

// Mobile hamburger toggle
function initNav() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobile = document.querySelector('.navbar__mobile');
  if (!hamburger || !mobile) return;
  hamburger.addEventListener('click', () => mobile.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  initNav();
});
