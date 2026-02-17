const fallbackDiag = Array.from({length: 30}).map((_,i)=>(
  {q:`Diagnostic item ${i+1} : je maîtrise le protocole associé.`, options:['Jamais','Parfois','Souvent','Toujours'], answer: i%4===0 ? undefined : 3, domain:['Hygiène','Microbiologie','Protocole'][i%3]}
));
(async function(){
  const all = await loadData('data/diagnostic.json','items',fallbackDiag);
  const zone = document.getElementById('diagZone');
  const result = document.getElementById('diagResult');
  let current=[];

  function sample20(){ const copy=[...all]; const out=[]; while(copy.length && out.length<20) out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); return out; }
  function render(){
    zone.innerHTML=current.map((q,idx)=>`<div class="card q-item"><p><strong>${idx+1}. ${q.q}</strong> <span class="badge">${q.domain||'Général'}</span></p>
    ${(q.options||[]).map((o,oi)=>`<label><input type="radio" name="d${idx}" value="${oi}"> ${o}</label><br>`).join('')}
    </div>`).join('');
    result.innerHTML='';
  }
  document.getElementById('reloadDiag').onclick=()=>{ current=sample20(); render(); };
  document.getElementById('calcDiag').onclick=()=>{
    let ok=0, total=0; const domains={};
    current.forEach((q,idx)=>{
      const pick = zone.querySelector(`input[name="d${idx}"]:checked`);
      if (!domains[q.domain]) domains[q.domain]={ok:0,total:0};
      if (typeof q.answer !== 'number'){ domains[q.domain].total++; return; }
      total++; domains[q.domain].total++;
      if (pick && Number(pick.value)===q.answer){ ok++; domains[q.domain].ok++; }
    });
    const rows = Object.entries(domains).map(([d,v])=>{
      const pct=v.total?Math.round((v.ok/v.total)*100):0;
      return `<tr><td>${d}</td><td>${v.ok}/${v.total}</td><td>${pct}%</td></tr>`;
    }).join('');
    const prior = Object.entries(domains).map(([d,v])=>({d,p:v.total?Math.round((v.ok/v.total)*100):0})).filter(x=>x.p<70).map(x=>x.d).join(', ') || 'Aucun domaine prioritaire';
    const incompletes = current.filter(q=>typeof q.answer !== 'number').length;
    result.innerHTML = `<div class="card"><p><strong>Score total :</strong> ${ok}/${total}</p><p>Items à compléter : ${incompletes} (answer absent).</p>
      <table class="table"><thead><tr><th>Domaine</th><th>Résultat</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>
      <p><strong>Recommandation :</strong> prioriser ${prior}.</p></div>`;
  };
  current=sample20(); render();
})();
