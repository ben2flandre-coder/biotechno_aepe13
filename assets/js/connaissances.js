const fallbackNotions = [
{id:'N-01', title:'Biocontamination', domain:'Hygiène', summary:'Introduction aux risques biologiques.', content:'La biocontamination correspond à la présence non souhaitée de micro-organismes.', tags:['risque']},
{id:'N-02', title:'Antisepsie', domain:'Protocole', summary:'Traitement des tissus vivants.', content:'Différencier antisepsie et désinfection des surfaces.', tags:['antiseptique']},
{id:'N-03', title:'Désinfection', domain:'Protocole', summary:'Traitement des surfaces inertes.', content:'Toujours après nettoyage préalable.', tags:['surface']},
{id:'N-04', title:'Flore transitoire', domain:'Microbiologie', summary:'Microbes acquis par contact.', content:'Éliminée efficacement par friction hydroalcoolique.', tags:['mains']},
{id:'N-05', title:'Période d’incubation', domain:'Microbiologie', summary:'Temps entre contamination et symptômes.', content:'Variable selon l’agent pathogène.', tags:['infection']},
{id:'N-06', title:'Précautions standard', domain:'Hygiène', summary:'Mesures universelles de prévention.', content:'Applicables à toutes les situations de soins et d’accompagnement.', tags:['EPI']}
];
(async function(){
  const notions = await loadData('data/notions.json', 'notions', fallbackNotions);
  const list = document.getElementById('notionsList');
  const search = document.getElementById('searchNotions');
  const overlay = document.getElementById('notionOverlay');
  const body = document.getElementById('notionBody');

  function render(items){
    list.innerHTML = items.map(n=>`<article class="card item"><div class="meta">${n.id} · ${n.domain}</div><h3>${n.title}</h3><p>${n.summary}</p><button class="btn" data-id="${n.id}">Ouvrir</button></article>`).join('');
    list.querySelectorAll('[data-id]').forEach(b => b.onclick = ()=>{
      const n = items.find(x=>x.id===b.dataset.id);
      body.innerHTML = `<h2>${n.title}</h2><p><span class="badge">${n.domain}</span> ${(n.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}</p>${softParagraphs(n.content)}`;
      overlay.classList.add('open');
    });
  }
  search.oninput = ()=>{ const q=search.value.toLowerCase(); render(notions.filter(n=>[n.title,n.domain,n.summary,(n.tags||[]).join(' ')].join(' ').toLowerCase().includes(q))); };
  render(notions);
})();
