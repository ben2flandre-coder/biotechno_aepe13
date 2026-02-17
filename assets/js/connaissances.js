(async function(){
  const notions = await loadData('data/notions.json', 'notions', []);
  const raw = await fetch(dataPath('data/notions.json')).then(r=>r.json()).catch(()=>({}));
  const glossaire = raw.glossaire || [];
  const protocoles = raw.microprotocoles || [];
  const pieges = raw.pieges_ep3 || [];

  const list = document.getElementById('notionsList');
  const search = document.getElementById('searchNotions');
  const overlay = document.getElementById('notionOverlay');
  const body = document.getElementById('notionBody');

  const glossList = document.getElementById('glossaireList');
  const glossSearch = document.getElementById('searchGloss');
  const protList = document.getElementById('protocolesList');
  const piegesList = document.getElementById('piegesList');

  function renderNotions(items){
    list.innerHTML = items.map(n => `<article class="card item" id="${n.id}">
      <div class="meta">${n.id} · ${n.domain}</div>
      <h3>${n.title}</h3>
      <p>${n.definition_operationnelle}</p>
      <button class="btn" data-id="${n.id}">Ouvrir la fiche</button>
    </article>`).join('');

    list.querySelectorAll('[data-id]').forEach((b)=>b.onclick = ()=>{
      const n = items.find((x)=>x.id===b.dataset.id);
      body.innerHTML = `<h2>${n.title}</h2>
      <p><strong>Définition opérationnelle :</strong> ${n.definition_operationnelle}</p>
      <p><strong>Pourquoi c’est critique en EAJE :</strong> ${n.criticite_eaje}</p>
      <h3>Erreurs fréquentes CAP</h3><ul>${(n.erreurs_frequentes_cap||[]).map((e)=>`<li>${e}</li>`).join('')}</ul>
      <h3>Points de contrôle / check-list</h3><ul>${(n.checklist_controle||[]).map((e)=>`<li>${e}</li>`).join('')}</ul>
      <h3>Mini-cas terrain</h3><p>${n.mini_cas_terrain}</p>
      <p><strong>Questions liées :</strong> ${(n.questions_liees||[]).map((q)=>`<a href='entrainement.html#${q}'>${q}</a>`).join(', ')}</p>`;
      overlay.classList.add('open');
    });
  }

  function renderGloss(items){
    glossList.innerHTML = items.map((g)=>`<article class='card item'><h4>${g.terme}</h4><p>${g.definition}</p></article>`).join('');
  }

  protList.innerHTML = protocoles.map((p)=>`<article class='card item'><h4>${p.titre}</h4><ol>${(p.etapes||[]).map((e)=>`<li>${e}</li>`).join('')}</ol><p><strong>Vigilance:</strong> ${(p.vigilance||[]).join(' ; ')}</p></article>`).join('');
  piegesList.innerHTML = pieges.map((x)=>`<li>${x}</li>`).join('');

  search.oninput = () => {
    const q = search.value.toLowerCase();
    renderNotions(notions.filter((n)=>JSON.stringify(n).toLowerCase().includes(q)));
  };
  glossSearch.oninput = () => {
    const q = glossSearch.value.toLowerCase();
    renderGloss(glossaire.filter((g)=>`${g.terme} ${g.definition}`.toLowerCase().includes(q)));
  };

  renderNotions(notions);
  renderGloss(glossaire);
})();
