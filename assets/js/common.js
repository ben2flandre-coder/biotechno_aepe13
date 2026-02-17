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
    <p>Technique : site statique GitHub Pages, sans tracking.</p>
    <p><strong>Zéro donnée personnelle collectée.</strong></p>
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach((o) => o.classList.remove('open'));
  });
})();
