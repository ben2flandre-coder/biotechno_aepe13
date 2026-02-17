(async function () {
  const seqs = await loadData('data/sequences.json', 'sequences', []);
  const media = await loadData('data/media.json', 'media', []);
  const list = document.getElementById('seqList');
  const search = document.getElementById('searchSeq');
  const overlay = document.getElementById('seqOverlay');
  const body = document.getElementById('seqBody');
  const stats = document.getElementById('seqStats');

  const fullMedia = (id) => media.find((m) => m.id === id);

  function renderStats(items) {
    const minWords = Math.min(...items.map((s) => s.stats?.wordCount || 0));
    const distinct = new Set(items.map((s)=>s.title)).size;
    stats.innerHTML = `<span class="badge">Séquences: ${items.length}</span>
      <span class="badge">Min mots/séquence: ${minWords}</span>
      <span class="badge">Titres distincts: ${distinct}</span>`;
  }

  function render(items) {
    renderStats(items);
    list.innerHTML = items.map((s) => `<article class="card item" id="${s.id}">
      <div class="meta">${s.id} · ${s.stats?.wordCount || 0} mots</div>
      <h3>${s.title}</h3>
      <p><strong>Contexte EAJE :</strong> ${(s.bloc1_situationProfessionnelle?.situation1||'').slice(0,190)}...</p>
      <p><strong>Enjeu scientifique :</strong> ${s.bloc4_fondScientifique?.mecanismes || ''}</p>
      <button class="btn" data-open="${s.id}">Ouvrir la séquence</button>
    </article>`).join('');

    list.querySelectorAll('[data-open]').forEach((btn) => btn.onclick = () => {
      const s = items.find((x) => x.id === btn.dataset.open);
      const mediaHtml = (s.media || []).map((id) => {
        const m = fullMedia(id);
        if (!m) return `<p>Média introuvable: ${id}</p>`;
        return `<figure><img src="${m.src}" alt="${m.alt}" style="max-width:290px"><figcaption>${m.credit}</figcaption></figure>`;
      }).join('');

      const rows = (s.bloc6_tableauPedagogique || []).map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
      const options = (s.bloc7_tableauOptions || []).map((r)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
      const micro = (s.bloc5_microProtocoleOperationnel || []).map((m, i) => `<li><strong>Étape ${i + 1} :</strong> ${m.action}<br><em>Vigilance :</em> ${m.vigilance}<br><em>EPI :</em> ${m.epi}</li>`).join('');
      const b7 = s.bloc7_casGroupeArbitrage || {};
      const b8 = s.bloc8_lienEP3 || {};
      const f = s.bloc_formateur_arbitrage || {};

      body.innerHTML = `
      <h2>${s.title}</h2>
      <p><span class="badge">${s.stats?.wordCount || 0} mots utiles</span><span class="badge">2 situations</span><span class="badge">3 schémas</span></p>
      <h3>1) Situation professionnelle concrète (EAJE / école maternelle)</h3>
      <ul><li>${s.bloc1_situationProfessionnelle?.situation1 || ''}</li><li>${s.bloc1_situationProfessionnelle?.situation2 || ''}</li></ul>
      <h3>2) Problème métier à résoudre</h3>
      ${softParagraphs(s.bloc2_problemeMetier)}
      <h3>3) Analyse terrain</h3>
      <ul>${(s.bloc3_analyseTerrain || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>4) Apport théorique ciblé (pas encyclopédique)</h3>
      <p><strong>Mécanisme scientifique :</strong> ${s.bloc4_fondScientifique?.mecanismes || ''}</p>
      <p><strong>Variables d’influence :</strong> ${s.bloc4_fondScientifique?.variablesInfluence || ''}</p>
      <p><strong>Erreurs d’interprétation :</strong> ${s.bloc4_fondScientifique?.erreursInterpretation || ''}</p>
      <p><strong>Limites d’application :</strong> ${s.bloc4_fondScientifique?.limitesApplication || ''}</p>
      <ul>${(s.bloc4_apportTheoriqueCible || []).slice(0,14).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>5) Micro-protocole opérationnel numéroté</h3>
      <ol>${micro}</ol>
      <h3>6) Tableau pédagogique — Erreur → Risque → Conséquence → Prévention</h3>
      <table class="table"><thead><tr><th>Erreur</th><th>Risque</th><th>Conséquence</th><th>Prévention</th></tr></thead><tbody>${rows}</tbody></table>
      <h3>7) Cas groupe / arbitrage</h3>
      <p><strong>Situation alternative :</strong> ${b7.situation || ''}</p>
      <table class="table"><thead><tr><th>Option</th><th>Sécurité</th><th>Conformité</th><th>Justification</th><th>Risque résiduel</th></tr></thead><tbody>${options}</tbody></table>
      <p><strong>Décision plausible 1 :</strong> ${b7.decision1 || ''}</p>
      <p><strong>Décision plausible 2 :</strong> ${b7.decision2 || ''}</p>
      <p><strong>Invitation à argumenter :</strong> ${b7.debatePrompt || ''}</p>
      <p><strong>Justification attendue :</strong> ${b7.expected || ''}</p>
      <h3>8) Lien explicite EP3</h3>
      <p><strong>Compétence évaluée :</strong> ${b8.competence || ''}</p>
      <p><strong>Critère observable :</strong> ${b8.observable || ''}</p>
      <p><strong>Point de vigilance examinateur :</strong> ${b8.examVigilance || ''}</p>
      <div class="alert"><strong>Erreur fréquente candidat CAP :</strong> ${s.bloc8_erreurFrequenteCandidat || ''}</div>
      <h3>9) Mémo imprimable synthétique (10 lignes max)</h3>
      <ol>${(s.bloc9_memoImprimable || []).map((x) => `<li>${x}</li>`).join('')}</ol>
      <h3>Arbitrage formateur (animation)</h3>
      <ul><li>${f.debat||''}</li><li>${f.questionPiegeEP3||''}</li><li>${f.miseEnSituation||''}</li><li>${f.casGroupe||''}</li></ul>
      <h3>Schémas pédagogiques liés au contenu</h3>
      ${mediaHtml}`;
      overlay.classList.add('open');
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    render(seqs.filter((s) => `${s.id} ${s.title} ${s.bloc2_problemeMetier}`.toLowerCase().includes(q)));
  };

  render(seqs);
})();
