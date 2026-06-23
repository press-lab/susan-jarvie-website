// Content loader: fetches a JSON data file and injects values into the DOM.
// Elements with data-field="key" get their innerHTML set from the JSON.
// Elements with data-list="key" get their children rendered from JSON arrays.

async function loadContent(dataPath) {
  try {
    const res = await fetch(dataPath);
    if (!res.ok) return;
    const data = await res.json();
    injectFields(document, data);
    injectLists(document, data);
  } catch (e) {
    console.warn('Content load error:', e);
  }
}

function injectFields(root, data) {
  root.querySelectorAll('[data-field]').forEach(el => {
    const key = el.dataset.field;
    if (data[key] == null) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = data[key];
    } else if (el.tagName === 'IMG') {
      el.src = data[key];
      if (el.dataset.alt && data[el.dataset.alt]) el.alt = data[el.dataset.alt];
    } else if (el.tagName === 'A' && el.dataset.href) {
      el.href = data[el.dataset.href] || el.href;
      el.innerHTML = data[key];
    } else {
      el.innerHTML = data[key];
    }
  });

  // Set href attributes separately
  root.querySelectorAll('[data-href]').forEach(el => {
    const key = el.dataset.href;
    if (data[key]) el.href = data[key];
  });
}

function injectLists(root, data) {
  root.querySelectorAll('[data-list]').forEach(container => {
    const key = container.dataset.list;
    const items = data[key];
    if (!Array.isArray(items)) return;

    const template = container.querySelector('[data-template]');
    if (!template) return;

    container.innerHTML = '';
    items.forEach(item => {
      const clone = template.cloneNode(true);
      clone.removeAttribute('data-template');
      injectFields(clone, item);
      container.appendChild(clone);
    });
  });

  // Special renderer: schedule classes grouped by location
  const scheduleContainer = root.querySelector('[data-schedule]');
  if (scheduleContainer && data.classes) {
    renderSchedule(scheduleContainer, data.classes, data.mcc_link);
  }
}

function renderSchedule(container, classes, mccLink) {
  // Group by location
  const groups = {};
  classes.forEach(cls => {
    const loc = cls.location;
    if (!groups[loc]) groups[loc] = { address: cls.address || '', items: [] };
    groups[loc].items.push(cls);
  });

  container.innerHTML = Object.entries(groups).map(([loc, group]) => `
    <div class="schedule-group">
      <div class="schedule-group__header">
        ${loc}
        ${group.address ? `<div class="schedule-group__address">${group.address}</div>` : ''}
      </div>
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Day</th>
            <th>Time</th>
            <th>Dates</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${group.items.map(c => `
            <tr>
              <td data-label="Class">
                <span class="class-name">${c.name}</span>
                ${c.notes ? `<div class="class-note">${c.notes}</div>` : ''}
              </td>
              <td data-label="Day">${c.day}</td>
              <td data-label="Time">${c.time}</td>
              <td data-label="Dates">${c.dates}</td>
              <td data-label="Price"><span class="class-price">${c.price}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  if (mccLink) {
    const link = document.querySelector('[data-mcc-link]');
    if (link) link.href = mccLink;
  }
}

// Mark active nav link (relative-path aware — works on GitHub Pages subpaths)
function markActiveNav() {
  let current = window.location.pathname.split('/').pop();
  if (!current || current === '') current = 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    const target = href === '' ? 'index.html' : href;
    if (target === current && href !== '#') a.classList.add('active');
  });
}

// Mobile nav toggle
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
