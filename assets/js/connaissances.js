(async function(){
  const notions = await loadData('data/notions.json', 'notions', []);
  const raw = await fetch(dataPath('data/notions.json')).then(r=>r.json()).catch(()=>({}));
  const qraw = await fetch(dataPath('data/questions.json')).then(r=>r.json()).catch(()=>({questions:[]}));
  const mediaWrap = await fetch(dataPath('data/media.json')).then(r=>r.json()).catch(()=>({media:[]}));
  const glossaire = raw.glossaire || [];
  const protocoles = raw.microprotocoles || [];
  const pieges = raw.pieges_ep3 || [];
  const questions = qraw.questions || [];
  const media = mediaWrap.media || [];

  const mediaById = (id) => media.find((m)=>m.id===id);

  const list = document.getElementById('notionsList');
  const search = document.getElementById('searchNotions');
  const overlay = document.getElementById('notionOverlay');
  const body = document.getElementById('notionBody');

  const glossList = document.getElementById('glossaireList');
  const glossSearch = document.getElementById('searchGloss');
  const protList = document.getElementById('protocolesList');
  const piegesList = document.getElementById('piegesList');

  function relatedQuestions(notionId, limit=5){
    return questions.filter((q)=> (q.lien_notions||[]).includes(notionId)).slice(0,limit).map((q)=>q.id);
  }

  function renderNotions(items){
    list.innerHTML = items.map(n => `<article class="card item" id="${n.id}">
      <div class="meta">${n.id} · ${n.domain}</div>
      <h3>${n.title}</h3>
      <p>${n.definition_operationnelle}</p>
      <p><strong>Questions associées dans la banque:</strong> ${relatedQuestions(n.id,5).join(', ') || 'N/A'}</p>
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
      <h3>Tableau comparatif décisionnel</h3>
      <table class='table'><tbody>${(n.tableau_comparatif||[]).map((r)=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <h3>Schémas du thème</h3>
      ${(n.schemas_theme||[]).map((id)=>{ const m=mediaById(id); return m?`<figure class='schema-figure'><img class='zoomable-img' src='${m.src}' alt='${m.alt}'><figcaption>${m.title}</figcaption><button class='btn secondary zoom-btn' data-zoom-src='${m.src}' data-zoom-alt='${m.alt}'>🔍 Agrandir</button></figure>`:''; }).join('')}
      <p><strong>Questions associées dans la banque :</strong> ${relatedQuestions(n.id,5).map((q)=>`<a href='entrainement.html#${q}'>${q}</a>`).join(', ')}</p>`;
      overlay.classList.add('open');
    });
  }

  function renderGloss(items){
    glossList.innerHTML = items.map((g)=>`<article class='card item'><h4>${g.terme}</h4><p>${g.definition}</p></article>`).join('');
  }

  protList.innerHTML = protocoles.map((p)=>{ const m=mediaById(p.schema_visuel); return `<article class='card item'><h4>${p.titre}</h4><ol>${(p.etapes||[]).map((e)=>`<li>${e}</li>`).join('')}</ol><p><strong>Vigilance:</strong> ${(p.vigilance||[]).join(' ; ')}</p>${m?`<figure class='schema-figure'><img class='zoomable-img' src='${m.src}' alt='${m.alt}'><figcaption>Support visuel protocole</figcaption><button class='btn secondary zoom-btn' data-zoom-src='${m.src}' data-zoom-alt='${m.alt}'>🔍 Agrandir</button></figure>`:''}</article>`; }).join('');
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
