(function () {
  const base = document.body.dataset.base || './';
  const page = document.body.dataset.page || 'index.html';
  const links = [
    ['index.html', 'Accueil'],
    ['parcours.html', 'Parcours capsules'],
    ['connaissances.html', 'Connaissances'],
    ['entrainement.html', 'Entraînement'],
    ['diagnostic.html', 'Diagnostic'],
    ['docs/index.html', 'Docs']
  ];

  function pathTo(rel) { return `${base}${rel}`; }

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `<div class="topbar">
      <div class="brand">
        <h1>Biotechnologie — CAP AEPE</h1>
        <p>Plateforme de formation adulte/pro en hygiène, microbiologie et protocoles.</p>
      </div>
      <div class="logos">
        <img src="${pathTo('assets/media/logos/logo-republique.svg')}" alt="Logo République Française">
        <img src="${pathTo('assets/media/logos/logo-greta-var.svg')}" alt="Logo GRETA du Var">
        <img src="${pathTo('assets/media/logos/logo-academie-nice.svg')}" alt="Logo Académie de Nice">
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
      <img src="${pathTo('assets/media/logos/logo-republique.svg')}" alt="Logo République Française">
      <img src="${pathTo('assets/media/logos/logo-greta-var.svg')}" alt="Logo GRETA du Var">
      <img src="${pathTo('assets/media/logos/logo-academie-nice.svg')}" alt="Logo Académie de Nice">
    </div>
    <p><strong>Biotechnologie CAP AEPE</strong> — support de formation professionnelle.</p>
    <p>Technique : site statique compatible GitHub Pages, sans tracking.</p>
    <p><strong>Zéro donnée personnelle collectée.</strong></p>`;
  document.body.append(footer);

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  });

  document.getElementById('projectionToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('projection');
  });

  function setupOverlay() {
    document.querySelectorAll('[data-overlay]').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.close')) overlay.classList.remove('open');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
    });
  }
  setupOverlay();
})();
