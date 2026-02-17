(async function () {
  const seqs = await loadData('data/sequences.json', 'sequences', []);
  const media = await loadData('data/media.json', 'media', []);
  const list = document.getElementById('seqList');
  const search = document.getElementById('searchSeq');
  const overlay = document.getElementById('seqOverlay');
  const body = document.getElementById('seqBody');
  const stats = document.getElementById('seqStats');

  function fullMedia(id) { return media.find((m) => m.id === id); }

  function renderStats(items) {
    const totalSchemas = items.reduce((acc, s) => acc + (s.stats?.schemaCount || 0), 0);
    stats.innerHTML = `<span class="badge">Séquences: ${items.length}</span>
      <span class="badge">Durée cible: 2h à 3h / séquence</span>
      <span class="badge">Schémas totaux: ${totalSchemas}</span>`;
  }

  function render(items) {
    renderStats(items);
    list.innerHTML = items.map((s) => `<article class="card item">
      <div class="meta">${s.id} · Animation ${s.animationDuration || '2h30'}</div>
      <h3>${s.title}</h3>
      <p><strong>Situation 1 :</strong> ${s.situations?.[0] || ''}</p>
      <p><strong>Problème métier :</strong> ${s.probleme || ''}</p>
      <div><span class="badge">2 situations concrètes</span><span class="badge">1 arbitrage</span><span class="badge">1 cas groupe</span><span class="badge">1 piège EP3</span></div>
      <button class="btn" data-open="${s.id}">Ouvrir la séquence formateur</button>
    </article>`).join('');

    list.querySelectorAll('[data-open]').forEach((btn) => btn.onclick = () => {
      const s = items.find((x) => x.id === btn.dataset.open);
      const mediaHtml = (s.media || []).map((id) => {
        const m = fullMedia(id);
        if (!m) return `<p>Média introuvable: ${id}</p>`;
        return `<figure><img src="${m.src}" alt="${m.alt}" style="max-width:280px"><figcaption>${m.credit}</figcaption></figure>`;
      }).join('') || '<p>Aucun média.</p>';

      const riskRows = (s.riskRows || []).map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');

      body.innerHTML = `
      <h2>${s.title}</h2>
      <p><span class="badge">Durée animation: ${s.animationDuration || '2h30'}</span></p>
      <h3>1) Situation réelle d’ouverture (EAJE)</h3>
      <ul>${(s.situations || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>2) Problème métier</h3>
      ${softParagraphs(s.probleme)}
      <h3>3) Analyse technique</h3>
      ${softParagraphs(s.analyse)}
      <h3>4) Apport théorique structuré relié terrain</h3>
      <ul>${(s.theorie || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>5) Micro-protocole concret (étapes numérotées)</h3>
      <ol>${(s.microProtocol || []).map((x) => `<li>${x}</li>`).join('')}</ol>
      <h3>6) Tableau erreur → risque → conséquence → prévention</h3>
      <table class="table"><thead><tr><th>Erreur</th><th>Risque</th><th>Conséquence</th><th>Prévention</th></tr></thead><tbody>${riskRows}</tbody></table>
      <h3>7) Exemple de non-conformité CAP AEPE (EP3)</h3>
      ${softParagraphs(s.ep3)}
      <h3>8) Point vigilance inspectable</h3>
      ${softParagraphs(s.vigilance)}
      <h3>9) Mémo imprimable synthétique</h3>
      <ul>${(s.memo || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>Éléments d’animation exigés</h3>
      <p><strong>Arbitrage décisionnel :</strong> ${s.arbitrage || ''}</p>
      <p><strong>Cas pratique groupe :</strong> ${s.groupCase || ''}</p>
      <p><strong>Piège d’examen :</strong> ${s.examTrap || ''}</p>
      <h3>Plan d’animation 2–3h</h3>
      <ul>${(s.sessionPlan || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>Schémas pédagogiques</h3>
      ${mediaHtml}`;
      overlay.classList.add('open');
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    render(seqs.filter((s) => `${s.title} ${s.id} ${s.probleme}`.toLowerCase().includes(q)));
  };

  render(seqs);
})();
