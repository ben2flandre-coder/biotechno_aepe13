(async function(){
  const listEl = document.getElementById('capsulesList');
  const searchEl = document.getElementById('searchCapsules');
  const overlay = document.getElementById('capsuleOverlay');
  const body = document.getElementById('capsuleBody');
  const media = await loadData('data/media.json','media',[]);
  const capsules = await loadData('data/capsules.json', 'capsules', []);

  const getMedia = (id) => media.find((m)=>m.id===id);

  function render(items){
    listEl.innerHTML = items.map(c => `<article class="card item">
      <div class="meta">${c.id}</div>
      <h3>${c.title}</h3>
      <p><strong>Micro-thème :</strong> ${c.microTheme || ''}</p>
      <p><strong>Erreur fréquente :</strong> ${c.frequentError || ''}</p>
      <button class="btn" data-open="${c.id}">Ouvrir</button>
    </article>`).join('');

    listEl.querySelectorAll('[data-open]').forEach(btn => btn.onclick = () => {
      const c = items.find(x => x.id === btn.dataset.open);
      const m = getMedia(c.schemaId);
      body.innerHTML = `<h2>${c.title}</h2>
      <p><strong>Micro-thème :</strong> ${c.microTheme}</p>
      <p><strong>Erreur fréquente :</strong> ${c.frequentError}</p>
      <h3>Explication scientifique courte et dense</h3>
      ${softParagraphs(c.scienceDense)}
      <h3>Application terrain EAJE</h3>
      <p>En situation réelle, l’équipe applique ce principe dans la séquence <strong>${c.sequenceLink}</strong> avec contrôle croisé, traçabilité et adaptation au rythme du groupe.</p>
      <h3>Erreur fréquente</h3>
      <p>${c.frequentError}</p>
      <h3>Point inspection / conformité</h3>
      <p>Preuve attendue : protocole respecté, décision argumentée et trace écrite exploitable lors d’un contrôle EP3.</p>
      <h3>Schéma explicatif</h3>
      ${m ? `<figure class="schema-figure"><img loading="lazy" class="zoomable-img" src="${m.src}" alt="${m.alt}"><figcaption>${m.credit}</figcaption><button class="btn secondary zoom-btn" data-zoom-src="${m.src}" data-zoom-alt="${m.alt}">🔍 Agrandir</button></figure>` : '<p>Schéma indisponible</p>'}
      <h3>Mini QCU intelligent</h3>
      <p><strong>${c.miniQCU?.q || ''}</strong></p>
      <ul>${(c.miniQCU?.options||[]).map((o,i)=>`<li>${String.fromCharCode(65+i)}. ${o}</li>`).join('')}</ul>
      <p><strong>Corrigé argumenté :</strong> ${c.miniQCU?.correction || ''}</p>
      <p><strong>Lien vers séquence approfondie :</strong> <a href="sequences.html#${c.sequenceLink}">${c.sequenceLink}</a></p>`;
      overlay.classList.add('open');
    });
  }

  searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase();
    render(capsules.filter(c => [c.title,c.microTheme,c.frequentError,c.sequenceLink].join(' ').toLowerCase().includes(q)));
  });
  render(capsules);
})();
