const DATA_URL = 'data.json';
let DATA = { subjects: [], lectures: [] };

const icons = {
  'internal': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  'toxicology': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96"/></svg>',
  'meat': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.5 21a6 6 0 0 0 6-6c0-4-4-8-9-8-3 0-5 2-5 5a6 6 0 0 0 6 6z"/><path d="M6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>',
  'poultry': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 11h.01M11 15h.01M16 16a4 4 0 0 0-8 0M6 8a6 6 0 0 1 12 0c0 4-3 6-6 6s-6-2-6-6z"/></svg>',
  'dairy': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8l-1 9H9L8 2zM6 13h12v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-8z"/></svg>',
  'infectious': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20"/></svg>',
  'transboundary': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
};

const iconMap = {
  'internal-medicine': 'internal',
  'toxicology': 'toxicology',
  'meat-hygiene': 'meat',
  'poultry': 'poultry',
  'dairy-hygiene': 'dairy',
  'infectious': 'infectious',
  'transboundary': 'transboundary'
};

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function load() {
  try {
    const r = await fetch(DATA_URL + '?t=' + Date.now());
    DATA = await r.json();
    render();
  } catch (e) {
    document.getElementById('subjects').innerHTML =
      '<p class="empty-state">تعذّر تحميل البيانات. حدّث الصفحة.</p>';
  }
}

function render() {
  const grid = document.getElementById('subjects');
  if (!DATA.subjects.length) {
    grid.innerHTML = '<p class="empty-state">لا توجد مواد بعد.</p>';
    return;
  }

  grid.innerHTML = DATA.subjects.map(s => {
    const count = DATA.lectures.filter(l => l.subject_id === s.id).length;
    const iconKey = iconMap[s.id] || 'internal';
    return `
      <a href="subject.html?id=${encodeURIComponent(s.id)}" class="subject-card">
        <div class="subject-icon">${icons[iconKey]}</div>
        <div class="subject-name-ar">${escapeHtml(s.name_ar)}</div>
        <div class="subject-name-en">${escapeHtml(s.name_en)}</div>
        <div class="subject-meta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>${count} محاضرة</span>
        </div>
      </a>
    `;
  }).join('');

  document.getElementById('statLectures').textContent = DATA.lectures.length;
  document.getElementById('statSubjects').textContent = DATA.subjects.length;
}

function setupSearch() {
  const input = document.getElementById('search');
  const results = document.getElementById('searchResults');
  const grid = document.getElementById('subjects');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.hidden = true;
      grid.style.display = '';
      return;
    }

    grid.style.display = 'none';
    results.hidden = false;

    const hits = DATA.lectures.filter(l =>
      (l.title_ar + ' ' + (l.title_en || '')).toLowerCase().includes(q)
    );

    if (!hits.length) {
      results.innerHTML = '<div class="search-empty">لا توجد نتائج لـ "' + escapeHtml(input.value) + '"</div>';
      return;
    }

    results.innerHTML = `
      <div class="search-title">نتائج البحث (${hits.length})</div>
      <div class="search-list">
        ${hits.map(l => {
          const s = DATA.subjects.find(x => x.id === l.subject_id);
          return `
            <a href="subject.html?id=${encodeURIComponent(l.subject_id)}" class="search-item">
              <div>
                <div class="search-item-title">${escapeHtml(l.title_ar)}</div>
                <div class="search-item-subject">${escapeHtml(s ? s.name_ar : '')}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </a>
          `;
        }).join('')}
      </div>
    `;
  });
}

load();
setupSearch();