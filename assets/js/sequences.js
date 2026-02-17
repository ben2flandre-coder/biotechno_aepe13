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
    const avgWords = Math.round(items.reduce((a,s)=>a+(s.stats?.wordCount||0),0)/Math.max(1,items.length));
    stats.innerHTML = `<span class="badge">Séquences: ${items.length}</span><span class="badge">Min mots/séquence: ${minWords}</span><span class="badge">Moyenne mots: ${avgWords}</span>`;
  }

  function render(items) {
    renderStats(items);
    list.innerHTML = items.map((s) => `<article class="card item" id="${s.id}">
      <div class="meta">${s.id} · ${s.stats?.wordCount || 0} mots</div>
      <h3>${s.title}</h3>
      <p><strong>Lieu :</strong> ${s.stats?.location || ''}</p>
      <p><strong>Incident :</strong> ${s.stats?.incident || ''}</p>
      <button class="btn" data-open="${s.id}">Ouvrir la séquence</button>
    </article>`).join('');

    list.querySelectorAll('[data-open]').forEach((btn) => btn.onclick = () => {
      const s = items.find((x) => x.id === btn.dataset.open);
      const mediaHtml = (s.media || []).map((id) => {
        const m = fullMedia(id);
        return m ? `<figure class="schema-figure"><img class="zoomable-img" src="${m.src}" alt="${m.alt}"><figcaption>${m.credit}</figcaption><button class="btn secondary zoom-btn" data-zoom-src="${m.src}" data-zoom-alt="${m.alt}">🔍 Agrandir</button></figure>` : '';
      }).join('');

      const rowsErr = (s.bloc6_tableauPedagogique || []).map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
      const rowsOpt = (s.bloc7_tableauOptions || []).map((r)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
      const rowsVar = (s.bloc6_tableauVariables || []).map((r)=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
      const micro = (s.bloc5_microProtocoleOperationnel || []).map((m, i) => `<li><strong>Étape ${i + 1}</strong> — ${m.action}<br><em>Vigilance :</em> ${m.vigilance}<br><em>EPI :</em> ${m.epi}</li>`).join('');
      const b7 = s.bloc7_casGroupeArbitrage || {};
      const b8 = s.bloc8_lienEP3 || {};
      const bF = s.bloc_formateur_arbitrage || {};
      const e = s.miniEvaluation || {};

      body.innerHTML = `
      <h2>${s.title}</h2>
      <p><span class="badge">${s.stats?.wordCount || 0} mots utiles</span><span class="badge">${(s.media||[]).length} schémas</span><span class="badge">3 tableaux</span></p>
      <h3>1) Situation professionnelle concrète (EAJE / école maternelle)</h3>
      <ul><li>${s.bloc1_situationProfessionnelle?.situation1 || ''}</li><li>${s.bloc1_situationProfessionnelle?.situation2 || ''}</li></ul>
      <h3>2) Problème métier à résoudre</h3>${softParagraphs(s.bloc2_problemeMetier)}
      <h3>3) Analyse terrain</h3><ul>${(s.bloc3_analyseTerrain || []).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>4) Apport théorique ciblé (pas encyclopédique)</h3>
      <p><strong>Mécanismes :</strong> ${s.bloc4_fondScientifique?.mecanismes || ''}</p>
      <p><strong>Variables :</strong> ${s.bloc4_fondScientifique?.variablesInfluence || ''}</p>
      <p><strong>Erreurs d’interprétation :</strong> ${s.bloc4_fondScientifique?.erreursInterpretation || ''}</p>
      <p><strong>Limites :</strong> ${s.bloc4_fondScientifique?.limitesApplication || ''}</p>
      <ul>${(s.bloc4_apportTheoriqueCible || []).slice(0,12).map((x) => `<li>${x}</li>`).join('')}</ul>
      <h3>5) Micro-protocole opérationnel</h3><ol>${micro}</ol>
      <h3>6) Tableau pédagogique — Erreur → Risque → Conséquence → Prévention</h3>
      <table class="table"><thead><tr><th>Erreur</th><th>Risque</th><th>Conséquence</th><th>Prévention</th></tr></thead><tbody>${rowsErr}</tbody></table>
      <h3>Tableau variables d’influence (scientifique)</h3>
      <table class="table"><tbody>${rowsVar}</tbody></table>
      <h3>7) Cas groupe / arbitrage</h3>
      <p><strong>Situation :</strong> ${b7.situation || ''}</p>
      <table class="table"><thead><tr><th>Option</th><th>Sécurité</th><th>Conformité</th><th>Justification</th><th>Risque résiduel</th></tr></thead><tbody>${rowsOpt}</tbody></table>
      <ul>${(b7.questions || []).map(q=>`<li>${q}</li>`).join('')}</ul>
      <p><strong>Attendu :</strong> ${b7.attendu || ''}</p>
      <h3>8) Lien explicite EP3</h3>
      <p><strong>Compétence :</strong> ${b8.competence || ''}</p>
      <p><strong>Preuve attendue :</strong> ${b8.preuveAttendue || ''}</p>
      <div class="alert"><strong>Erreur fréquente candidat CAP :</strong> ${s.bloc8_erreurFrequenteCandidat || ''}</div>
      <div class="alert"><strong>Piège EP3 + preuve attendue :</strong> ${s.bloc8_piegeEP3Preuve || ''}</div>
      <h3>9) Mémo imprimable (10 lignes)</h3><ol>${(s.bloc9_memoImprimable || []).map((x)=>`<li>${x}</li>`).join('')}</ol>
      <h3>Arbitrage formateur</h3><ul><li>${bF.debat||''}</li><li>${bF.questionPiegeEP3||''}</li><li>${bF.miseEnSituation||''}</li><li>${bF.casGroupe||''}</li></ul>
      <h3>Mini-évaluation</h3>
      <p><strong>${e.q || ''}</strong></p><ul>${(e.options || []).map((o,i)=>`<li>${String.fromCharCode(65+i)}. ${o}</li>`).join('')}</ul>
      <p><strong>Corrigé argumenté :</strong> ${e.justification || ''}</p><p><strong>Erreur fréquente :</strong> ${e.erreurFrequente || ''}</p>
      <h3>Schémas pédagogiques</h3>${mediaHtml}
      <h3>Références institutionnelles mobilisées</h3><ul>${(s.institutionalReferences || []).map((r)=>`<li>${r}</li>`).join('')}</ul>`;
      overlay.classList.add('open');
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    render(seqs.filter((s) => `${s.id} ${s.title} ${s.stats?.location} ${s.stats?.incident}`.toLowerCase().includes(q)));
  };

  render(seqs);
})();
