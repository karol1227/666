// Dilemma card expand/collapse
document.querySelectorAll('.dilemma-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.dilemma-card');
    const expanded = card.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', expanded);
    btn.textContent = expanded ? '收起' : '展开思考';
  });
});

// Spectrum slider
const spectrumData = [
  {
    title: '完全隐瞒',
    desc: '不透露任何相关信息，以维护对方当前的心理稳定或关系的表面和平。代价是：对方在不知情中做决策，信任可能在日后崩塌。'
  },
  {
    title: '选择性透露',
    desc: '告知核心事实，省略可能摧毁对方的细节。常见于医疗沟通、坏消息传递——在真实与保护之间取平衡。'
  },
  {
    title: '渐进告知',
    desc: '分阶段、按承受力逐步传递信息，让对方参与「想知道多少」的过程。尊重自主，也留出消化空间。'
  },
  {
    title: '完全坦诚',
    desc: '毫无保留地陈述所知一切。适用于强调自主与信任的关系，但要求时机、方式与后续支持都到位。'
  }
];

const slider = document.getElementById('spectrumSlider');
const thumb = document.getElementById('spectrumThumb');
const titleEl = document.getElementById('spectrumTitle');
const descEl = document.getElementById('spectrumDesc');

function updateSpectrum(value) {
  thumb.style.left = value + '%';
  const index = Math.min(3, Math.floor(value / 34));
  const data = spectrumData[index];
  titleEl.textContent = data.title;
  descEl.textContent = data.desc;
}

slider.addEventListener('input', (e) => updateSpectrum(e.target.value));
updateSpectrum(slider.value);

// Lens tabs
document.querySelectorAll('.lens-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.lens-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.lens-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.lens).classList.add('active');
  });
});

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Journal (localStorage)
const STORAGE_KEY = 'truth-boundary-journal';
const journalInput = document.getElementById('journalInput');
const journalSave = document.getElementById('journalSave');
const journalClear = document.getElementById('journalClear');
const journalSaved = document.getElementById('journalSaved');
const journalEntries = document.getElementById('journalEntries');

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  const entries = loadEntries();
  journalEntries.innerHTML = '';

  if (entries.length === 0) {
    journalSaved.hidden = true;
    return;
  }

  journalSaved.hidden = false;
  entries.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'journal-entry';
    div.innerHTML = `
      <button class="entry-delete" data-index="${index}" aria-label="删除">删除</button>
      <time>${entry.date}</time>
      <p>${escapeHtml(entry.text)}</p>
    `;
    journalEntries.appendChild(div);
  });

  journalEntries.querySelectorAll('.entry-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const entries = loadEntries();
      entries.splice(Number(btn.dataset.index), 1);
      saveEntries(entries);
      renderEntries();
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

journalSave.addEventListener('click', () => {
  const text = journalInput.value.trim();
  if (!text) return;

  const entries = loadEntries();
  entries.unshift({
    text,
    date: new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  });
  saveEntries(entries);
  journalInput.value = '';
  renderEntries();
});

journalClear.addEventListener('click', () => {
  journalInput.value = '';
});

renderEntries();

// Nav scroll highlight
const sections = document.querySelectorAll('.section[id], .hero');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id') || '';
    }
  });

  navItems.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
}, { passive: true });
