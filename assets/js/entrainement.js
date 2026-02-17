const fallbackQuestions = Array.from({length: 12}).map((_,i)=>(
  {q:`Question ${i+1} : Quel geste limite la transmission ?`, options:['Ignorer le protocole','Hygiène des mains','Partager les gants','Oublier le nettoyage'], answer:1, explain:'L’hygiène des mains est la mesure barrière la plus efficace.', domain:i%2?'Hygiène':'Microbiologie'}
));
(async function(){
  const all = await loadData('data/questions.json','questions',fallbackQuestions);
  const sizeSel = document.getElementById('sessionSize');
  const zone = document.getElementById('qcmZone');
  const score = document.getElementById('score');
  let current=[];

  function sample(n){
    const copy=[...all];
    const out=[];
    while(copy.length && out.length<n){ out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); }
    return out;
  }

  function render(){
    zone.innerHTML=current.map((q,idx)=>`<div class="card q-item" data-idx="${idx}"><p><strong>${idx+1}. ${q.q}</strong> <span class="badge">${q.domain||'Général'}</span></p>
      ${(q.options||[]).map((o,oi)=>`<label><input type="radio" name="q${idx}" value="${oi}"> ${o}</label><br>`).join('')}
      <div class="explain"></div></div>`).join('');
    score.textContent='';
  }

  document.getElementById('newSession').onclick=()=>{ current=sample(Number(sizeSel.value)); render(); };
  document.getElementById('correctSession').onclick=()=>{
    let ok=0;
    zone.querySelectorAll('.q-item').forEach((el,idx)=>{
      const picked=el.querySelector('input:checked');
      const good=current[idx].answer;
      const exp=el.querySelector('.explain');
      if (picked && Number(picked.value)===good){ ok++; el.classList.add('correct'); el.classList.remove('wrong'); exp.innerHTML=`<p>✅ Correct. ${current[idx].explain||''}</p>`; }
      else { el.classList.add('wrong'); el.classList.remove('correct'); exp.innerHTML=`<p>❌ Incorrect. Réponse attendue : ${(current[idx].options||[])[good]||'N/A'}. ${current[idx].explain||''}</p>`; }
    });
    score.textContent=`Score : ${ok}/${current.length}`;
  };
  current=sample(Number(sizeSel.value)); render();
})();
