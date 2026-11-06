const DATA_URL = 'data.json';
let DATA = { subjects: [], lectures: [] };

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
    document.getElementById('lectures').innerHTML =
      '<p class="empty-state">تعذّر تحميل البيانات.</p>';
  }
}

function render() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const subject = DATA.subjects.find(s => s.id === id);

  if (!subject) {
    document.getElementById('subjectHeader').innerHTML =
      '<h1>المادة غير موجودة</h1>';
    return;
  }

  document.title = subject.name_ar + ' — Vet Library';
  document.getElementById('pageDesc').content = 'محاضرات ' + subject.name_ar;

  const lectures = DATA.lectures.filter(l => l.subject_id === id);

  document.getElementById('subjectHeader').innerHTML = `
    <h1>${escapeHtml(subject.name_ar)}</h1>
    <div class="en">${escapeHtml(subject.name_en)}</div>
    <span class="count">${lectures.length} محاضرة</span>
  `;

  const list = document.getElementById('lectures');

  if (!lectures.length) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
        <p>لم تُضف محاضرات لهذه المادة بعد</p>
      </div>
    `;
    return;
  }

  list.innerHTML = lectures.map(l => {
    const buttons = [];
    if (l.html) buttons.push(`<a href="${escapeHtml(l.html)}" target="_blank" class="btn">الشرح</a>`);
    if (l.pdf) buttons.push(`<a href="${escapeHtml(l.pdf)}" target="_blank" class="btn btn-ghost">PDF</a>`);
    if (l.extra) buttons.push(`<a href="${escapeHtml(l.extra)}" target="_blank" class="btn btn-ghost">مصدر</a>`);

    return `
      <div class="lecture-card">
        <div>
          <div class="lecture-title">${escapeHtml(l.title_ar)}</div>
          ${l.title_en ? `<div class="lecture-title-en">${escapeHtml(l.title_en)}</div>` : ''}
          ${l.notes ? `<span class="lecture-note">${escapeHtml(l.notes)}</span>` : ''}
        </div>
        <div class="lecture-actions">
          ${buttons.length ? buttons.join('') : '<span class="lecture-note">لا يوجد محتوى بعد</span>'}
        </div>
      </div>
    `;
  }).join('');
}

load();