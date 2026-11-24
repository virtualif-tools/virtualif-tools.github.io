(function () {
  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Lightbox do print da extensão
  const openBtn = document.getElementById('openLightbox');
  const closeBtn = document.getElementById('closeLightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  const lightbox = document.getElementById('lightbox');

  function openLightbox() {
    if (!lightbox) return;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // Toggles interativos de destaque da chamada (F, I, E)
  document.querySelectorAll('[data-toggle-chamada]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const type = checkbox.getAttribute('data-toggle-chamada');
      const badge = document.querySelector(`.chamada-badge[data-type="${type}"]`);
      if (badge) {
        badge.classList.toggle('is-off', !checkbox.checked);
      }
    });
  });

  // Simulador do parser e filtros de correspondência
  const sandboxInput = document.getElementById('sandboxInput');
  const sandboxBody = document.getElementById('sandboxBody');
  const sandboxCount = document.getElementById('sandboxCount');
  const simCase = document.getElementById('simCase');
  const simAccents = document.getElementById('simAccents');
  const simSpaces = document.getElementById('simSpaces');

  function normalizeName(name) {
    let result = String(name || '');
    if (simSpaces && simSpaces.checked) {
      result = result.replace(/\s+/g, ' ').trim();
    }
    if (simAccents && simAccents.checked) {
      result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    if (simCase && simCase.checked) {
      result = result.toLowerCase();
    }
    return result;
  }

  function renderSandbox() {
    if (!sandboxInput || !sandboxBody || !sandboxCount) return;

    const lines = sandboxInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const rows = [];
    for (const line of lines) {
      const parts = line.includes('\t')
        ? line.split('\t')
        : line.includes(';')
          ? line.split(';')
          : line.split(',');

      if (parts.length >= 2) {
        const rawName = parts.slice(0, -1).join(' ');
        const grade = parts[parts.length - 1].trim();
        rows.push({ name: normalizeName(rawName), grade });
      }
    }

    sandboxBody.innerHTML = '';
    if (rows.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 3;
      td.textContent = 'Cole linhas com Nome e Nota separados por Tab, ; ou ,';
      tr.appendChild(td);
      sandboxBody.appendChild(tr);
    } else {
      rows.forEach((row, index) => {
        const tr = document.createElement('tr');

        const tdIdx = document.createElement('td');
        tdIdx.textContent = String(index + 1);

        const tdName = document.createElement('td');
        tdName.textContent = row.name;

        const tdGrade = document.createElement('td');
        tdGrade.textContent = row.grade;

        tr.append(tdIdx, tdName, tdGrade);
        sandboxBody.appendChild(tr);
      });
    }

    sandboxCount.textContent = `${rows.length} ${rows.length === 1 ? 'aluno' : 'alunos'}`;
  }

  if (sandboxInput) {
    sandboxInput.addEventListener('input', renderSandbox);
    [simCase, simAccents, simSpaces].forEach((el) => {
      if (el) el.addEventListener('change', renderSandbox);
    });
    renderSandbox();
  }
})();
