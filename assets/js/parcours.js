const fallbackCapsules = [
  { id:'CAP-01', title:'Hygiène des mains', macro:'Hygiène', summary:'Pourquoi, quand et comment réaliser une friction hydroalcoolique.', objectif:'Appliquer les 5 moments d’hygiène des mains.', level:'Fondamental', content:'Étapes :\n\n1. Retirer les bijoux.\n2. Friction 30 secondes.\n3. Séchage naturel.', redflags:['Bijoux conservés','Durée insuffisante'], tags:['SHA','prévention'], media:['assets/media/diagrams/schema-contamination.svg','assets/media/bank/picto-hygiene.svg'] },
  { id:'CAP-02', title:'Nettoyage-désinfection', macro:'Protocole', summary:'Différence entre nettoyer et désinfecter.', objectif:'Séparer les étapes pour sécuriser les surfaces.', level:'Intermédiaire', content:'Nettoyage = retrait des salissures.\n\nDésinfection = réduction des micro-organismes.', redflags:['Produit mal dosé'], tags:['bionettoyage'], media:['assets/media/bank/picto-protocole.svg'] },
  { id:'CAP-03', title:'Chaîne de transmission', macro:'Microbiologie', summary:'Comprendre les maillons pour casser la transmission.', objectif:'Identifier un maillon et proposer une barrière.', level:'Fondamental', content:'La prévention agit sur chaque maillon.', redflags:['Non port de gants'], tags:['chaîne','transmission'], media:['assets/media/diagrams/chaine-transmission.svg'] },
  { id:'CAP-04', title:'Flore cutanée', macro:'Microbiologie', summary:'Rôle de la flore résidente et transitoire.', objectif:'Distinguer flore utile et opportuniste.', level:'Intermédiaire', content:'La flore résidente est globalement protectrice.', redflags:['Sur-lavage irritant'], tags:['flore','peau'], media:['assets/media/diagrams/flore-microbienne.svg'] },
  { id:'CAP-05', title:'Tenue professionnelle', macro:'Hygiène', summary:'Adapter la tenue selon les gestes et zones.', objectif:'Prévenir contamination des vêtements.', level:'Fondamental', content:'Tenue propre, changée régulièrement, manches courtes.', redflags:['Manches longues'], tags:['tenue'], media:['assets/media/bank/picto-evaluation.svg'] },
  { id:'CAP-06', title:'Traçabilité', macro:'Qualité', summary:'Pourquoi tracer les actions d’hygiène.', objectif:'Compléter une fiche simple de traçabilité.', level:'Avancé', content:'Date, action, produit, signature : éléments clés.', redflags:['Oubli de signature'], tags:['qualité','preuve'], media:['assets/media/bank/picto-protocole.svg'] }
];

(async function(){
  const listEl = document.getElementById('capsulesList');
  const searchEl = document.getElementById('searchCapsules');
  const overlay = document.getElementById('capsuleOverlay');
  const body = document.getElementById('capsuleBody');
  const capsules = await loadData('data/capsules.json', 'capsules', fallbackCapsules);

  function render(items){
    listEl.innerHTML = items.map(c => `<article class="card item">
      <div class="meta">${c.id || 'Sans ID'} · ${c.macro || 'Général'} · Niveau ${c.level || 'N/A'}</div>
      <h3>${c.title || 'Capsule sans titre'}</h3>
      <p>${c.summary || 'Résumé pédagogique à compléter.'}</p>
      <div>${(c.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}</div>
      <button class="btn" data-open="${c.id}">Ouvrir</button>
    </article>`).join('');

    listEl.querySelectorAll('[data-open]').forEach(btn => btn.onclick = () => {
      const c = items.find(x => x.id === btn.dataset.open);
      const media = (c.media||[]).map(m => `<a href="${m}" target="_blank" rel="noopener"><img src="${m}" alt="Média ${c.title}" style="max-width:180px;margin:.3rem"></a>`).join('');
      body.innerHTML = `<h2>${c.title}</h2><p><strong>Objectif :</strong> ${c.objectif || 'Consolider les fondamentaux.'}</p>${softParagraphs(c.content)}
      <h3>Points de vigilance</h3>${(c.redflags||['Aucun redflag renseigné']).map(r=>`<div class="alert">${r}</div>`).join('')}
      <h3>Médias pédagogiques</h3><div>${media || '<p>Aucun média associé.</p>'}</div>`;
      overlay.classList.add('open');
    });
  }

  searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase();
    render(capsules.filter(c => [c.title,c.macro,c.summary,(c.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)));
  });
  render(capsules);
})();
