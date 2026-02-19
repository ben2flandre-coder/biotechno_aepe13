(function () {
  const base = document.body.dataset.base || './';
  const page = document.body.dataset.page || 'index.html';
  const links = [
    ['index.html', 'Accueil'],
    ['sequences.html', '15 séquences'],
    ['parcours.html', 'Parcours capsules'],
    ['connaissances.html', 'Connaissances'],
    ['entrainement.html', 'Entraînement'],
    ['diagnostic.html', 'Diagnostic'],
    ['docs/index.html', 'Docs']
  ];

  const pathTo = (rel) => `${base}${rel}`;
  const logoBase = 'assets/img/logos';

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `<div class="topbar">
      <div class="brand">
        <h1>Biotechnologie — CAP AEPE</h1>
        <p>Bloc 1 / EP3 · Plateforme de formation adulte/pro</p>
      </div>
      <div class="logos">
        <img src="${pathTo(`${logoBase}/logo-republique.svg`)}" alt="Logo République Française">
        <img src="${pathTo(`${logoBase}/logo-greta-var.svg`)}" alt="Logo GRETA du Var">
        <img src="${pathTo(`${logoBase}/logo-academie-nice.svg`)}" alt="Logo Académie de Nice">
      </div>
      <div class="controls">
        <button class="btn secondary" id="themeToggle">Thème</button>
        <button class="btn secondary" id="projectionToggle">Projection</button>
      </div>
    </div>
    <nav class="nav-pills" aria-label="Navigation principale">${links.map(([href, label]) => `<a href="${pathTo(href)}" class="${page === href ? 'active' : ''}">${label}</a>`).join('')}</nav>`;
  document.body.prepend(header);

  const footer = document.createElement('footer');
  footer.innerHTML = `<div class="logos">
      <img src="${pathTo(`${logoBase}/logo-republique.svg`)}" alt="Logo République Française">
      <img src="${pathTo(`${logoBase}/logo-greta-var.svg`)}" alt="Logo GRETA du Var">
      <img src="${pathTo(`${logoBase}/logo-academie-nice.svg`)}" alt="Logo Académie de Nice">
    </div>
    <p><strong>Biotechnologie CAP AEPE</strong> — Formation professionnelle (Bloc 1 / EP3).</p>
    <p><strong>Conception pédagogique / intégration : Benoît Deflandre — 2026</strong></p>
    <p>Site statique, zéro collecte de données personnelles.</p>
    <p><a href="${pathTo('docs/credits.html')}">Crédits & sources</a> · <a href="${pathTo('docs/banque-medias.html')}">Banque médias</a></p>`;
  document.body.append(footer);

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  });

  document.getElementById('projectionToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('projection');
  });

  document.querySelectorAll('[data-overlay]').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.close')) overlay.classList.remove('open');
    });
  });

  const mediaOverlay = document.createElement('div');
  mediaOverlay.className = 'overlay media-overlay';
  mediaOverlay.id = 'mediaOverlay';
  mediaOverlay.innerHTML = `<article class="dialog media-dialog">
      <button class="close" aria-label="Fermer">✕</button>
      <div class="media-stage"><img id="mediaOverlayImg" alt="Agrandissement schéma"></div>
    </article>`;
  document.body.append(mediaOverlay);

  const mediaImg = mediaOverlay.querySelector('#mediaOverlayImg');
  const openMedia = (src, alt = '') => {
    mediaImg.src = src;
    mediaImg.alt = alt;
    mediaOverlay.classList.add('open');
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-zoom-src], .zoomable-img');
    if (trigger) {
      const src = trigger.dataset.zoomSrc || trigger.getAttribute('src');
      const alt = trigger.dataset.zoomAlt || trigger.getAttribute('alt') || 'Schéma agrandi';
      if (src) openMedia(src, alt);
      return;
    }
    if (e.target === mediaOverlay || e.target.closest('#mediaOverlay .close')) {
      mediaOverlay.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay.open').forEach((o) => o.classList.remove('open'));
    }
  });
})();
