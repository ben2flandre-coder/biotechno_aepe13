const fallbackSequences = [
  {id:'S01', title:'Évaluation des risques', tags:['risques'], objectif:'Identifier et hiérarchiser les risques.', essentiel:'Observer situation, identifier danger, évaluer gravité/probabilité.', protocoles:'Grille d’analyse en 3 niveaux.', redflags:['Danger non noté'], casPro:'Analyse d’un espace change.', quiz:[{q:'Première étape ?', options:['Tracer','Observer','Nettoyer','Stocker'], answer:1, explain:'Commencer par observer le contexte.'}], references:['INRS'], media:['IMG_RISK_SCHEMA']},
  {id:'S02', title:'Dangers chimiques & biologiques', tags:['chimie','microbio'], objectif:'Différencier les dangers et adapter la prévention.', essentiel:'Danger chimique = substance, biologique = agent vivant.', protocoles:'Pictogrammes + précautions standard.', redflags:['Mélange produits'], casPro:'Désinfection jouets.', quiz:[{q:'Danger biologique ?', options:['Acide','Virus','Eau','Savon'], answer:1, explain:'Un virus est un agent biologique.'}], references:['INRS'], media:['IMG_BIO_BASE']},
  {id:'S03', title:'EPI / EPC', tags:['prévention'], objectif:'Choisir EPI/EPC adaptés.', essentiel:'EPI protège l’individu, EPC protège collectivement.', protocoles:'Adapter gants, surblouse, ventilation.', redflags:['Gants continus'], casPro:'Change + nettoyage.', quiz:[{q:'EPC exemple ?', options:['Gants','Ventilation','Masque perso','Tablier'], answer:1, explain:'La ventilation est collective.'}], references:['INRS'], media:['IMG_HYGIENE_VISUAL']},
  {id:'S04', title:'Matériel & protocoles', tags:['méthodes'], objectif:'Associer matériel au protocole.', essentiel:'Code couleur et circuits limitent la contamination.', protocoles:'Plan de nettoyage par zone.', redflags:['Matériel non tracé'], casPro:'Préparation salle activité.', quiz:[{q:'Bonne pratique ?', options:['Même lavette partout','Code couleur','Aucune traçabilité','Matériel au sol'], answer:1, explain:'Le code couleur évite la contamination croisée.'}], references:['CPIAS'], media:['IMG_PROTO_BASE']},
  {id:'S05', title:'Produits & désinfectants', tags:['chimie'], objectif:'Sélectionner produit selon usage.', essentiel:'Respect concentration, spectre, temps de contact.', protocoles:'Lecture FDS + étiquette.', redflags:['Sous-dosage'], casPro:'Désinfection table repas.', quiz:[{q:'Condition clé ?', options:['Couleur','Temps contact','Marque','Parfum'], answer:1, explain:'Temps de contact indispensable.'}], references:['INRS'], media:['IMG_CHIMIE_BASE']},
  {id:'S06', title:'Échelle de pH', tags:['chimie'], objectif:'Interpréter pH et compatibilité.', essentiel:'pH <7 acide, >7 basique.', protocoles:'Choisir produit sans altérer support.', redflags:['Produit inadapté'], casPro:'Nettoyage sanitaire.', quiz:[{q:'pH 2 est ?', options:['Neutre','Acide','Basique','Inerte'], answer:1, explain:'2 correspond à acide.'}], references:['INRS'], media:['IMG_PH_SCHEMA']}
];

function renderQuizBlock(quiz = []) {
  return quiz.map((item, idx) => `<div class="card"><p><strong>Mini-quiz ${idx + 1} :</strong> ${item.q}</p>${item.options.map((opt, i) => `<label><input type="radio" name="mini${idx}" value="${i}"> ${opt}</label><br>`).join('')}<button class="btn secondary" data-check-mini="${idx}">Corriger</button><p class="mini-feedback" data-feedback="${idx}"></p></div>`).join('');
}

(async function () {
  const seqs = await loadData('data/sequences.json', 'sequences', fallbackSequences);
  const media = await loadData('data/media.json', 'media', []);
  const list = document.getElementById('seqList');
  const search = document.getElementById('searchSeq');
  const overlay = document.getElementById('seqOverlay');
  const body = document.getElementById('seqBody');

  function fullMedia(id) { return media.find((m) => m.id === id); }

  function render(items) {
    list.innerHTML = items.map((s) => `<article class="card item"><div class="meta">${s.id}</div><h3>${s.title}</h3><p>${s.essentiel || ''}</p><div>${(s.tags || []).map((t) => `<span class="badge">${t}</span>`).join('')}</div><button class="btn" data-open="${s.id}">Ouvrir</button></article>`).join('');
    list.querySelectorAll('[data-open]').forEach((btn) => btn.onclick = () => {
      const s = items.find((x) => x.id === btn.dataset.open);
      const mediaHtml = (s.media || []).map((id) => {
        const m = fullMedia(id);
        if (!m) return `<p>Media introuvable: ${id}</p>`;
        return `<figure><img src="${m.src}" alt="${m.alt}" style="max-width:220px"><figcaption>${m.credit}</figcaption></figure>`;
      }).join('') || '<p>Aucun média.</p>';
      body.innerHTML = `<h2>${s.title}</h2>
      <p><strong>Objectifs :</strong> ${s.objectif || ''}</p>
      <h3>Essentiel / Cours</h3>${softParagraphs(s.essentiel)}
      <h3>Protocoles / Méthodes</h3>${softParagraphs(s.protocoles)}
      <h3>Points de vigilance / Red flags</h3>${(s.redflags || []).map((r) => `<div class="alert">${r}</div>`).join('')}
      <h3>Cas pro contextualisé AEPE</h3>${softParagraphs(s.casPro)}
      <h3>Mini-quiz</h3>${renderQuizBlock(s.quiz)}
      <h3>Ressources / Références</h3><ul>${(s.references || []).map((r) => `<li>${r}</li>`).join('')}</ul>
      <h3>Médias</h3>${mediaHtml}`;
      overlay.classList.add('open');

      body.querySelectorAll('[data-check-mini]').forEach((b) => b.onclick = () => {
        const i = Number(b.dataset.checkMini);
        const q = s.quiz[i];
        const picked = body.querySelector(`input[name="mini${i}"]:checked`);
        const fb = body.querySelector(`[data-feedback="${i}"]`);
        if (!picked) { fb.textContent = 'Sélection requise.'; return; }
        fb.textContent = Number(picked.value) === q.answer ? `✅ Correct. ${q.explain}` : `❌ Incorrect. ${q.explain}`;
      });
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    render(seqs.filter((s) => `${s.title} ${(s.tags || []).join(' ')}`.toLowerCase().includes(q)));
  };
  render(seqs);
})();
