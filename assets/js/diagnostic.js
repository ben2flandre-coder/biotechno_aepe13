(async function(){
  const items = await loadData('data/diagnostic.json', 'items', []);
  const scale = ['Jamais', 'Rarement', 'Souvent', 'Toujours'];
  const points = [0, 1, 2, 3];
  const zone = document.getElementById('diagZone');
  const result = document.getElementById('diagResult');
  let current = [];

  function sample(size = 45) {
    const copy = [...items];
    const out = [];
    while (copy.length && out.length < size) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return out;
  }

  function render() {
    zone.innerHTML = current.map((q, idx) => `<div class="card q-item">
      <p><strong>${idx + 1}. ${q.formulation}</strong> <span class="badge">${q.competence}</span> <span class="badge">Niveau ${q.niveau}</span></p>
      <p><em>${q.exemple_terrain}</em></p>
      ${scale.map((o,oi)=>`<label><input type="radio" name="d${idx}" value="${oi}"> ${o}</label>`).join(' · ')}
    </div>`).join('');
  }

  function compute() {
    const byComp = {};
    current.forEach((q, idx) => {
      const c = q.competence;
      if (!byComp[c]) byComp[c] = {sum: 0, max: 0, count: 0, notions: new Set()};
      const pick = zone.querySelector(`input[name='d${idx}']:checked`);
      const val = pick ? points[Number(pick.value)] : 0;
      byComp[c].sum += val;
      byComp[c].max += 3;
      byComp[c].count += 1;
      (q.lien_notions || []).forEach((n)=>byComp[c].notions.add(n));
    });

    const rows = Object.entries(byComp).map(([c, v]) => {
      const pct = Math.round((v.sum / Math.max(1, v.max)) * 100);
      return {c, pct, notions: Array.from(v.notions)};
    });

    const table = rows.map((r)=>`<tr><td>${r.c}</td><td>${r.pct}%</td><td><div style="background:#e2e8f0;border-radius:999px"><div style="width:${r.pct}%;background:#0ea5e9;color:#fff;border-radius:999px;padding:2px 8px">${r.pct}%</div></div></td></tr>`).join('');

    const recos = rows.sort((a,b)=>a.pct-b.pct).slice(0,3).map((r)=>{
      const level = r.pct < 40 ? 'Niveau fragile' : (r.pct < 70 ? 'Niveau intermédiaire' : 'Niveau solide');
      const justification = r.pct < 40
        ? 'Priorité haute: sécuriser les fondamentaux et répéter les micro-protocoles.'
        : (r.pct < 70 ? 'Consolidation: entraînement ciblé et analyse d'erreurs.' : 'Maintien expert: cas complexes et arbitrages avancés.');
      const seqA = 'S' + String((rows.indexOf(r)%15)+1).padStart(2,'0');
      const seqB = 'S' + String(((rows.indexOf(r)+5)%15)+1).padStart(2,'0');
      return `<li><strong>${r.c}</strong> — ${level}. ${justification} Cibles: <a href="connaissances.html#${r.notions[0]}">${r.notions[0]}</a>, <a href="sequences.html#${seqA}">${seqA}</a>, <a href="sequences.html#${seqB}">${seqB}</a>.</li>`;
    }).join('');

    result.innerHTML = `<h3>Restitution diagnostic</h3>
      <table class="table"><thead><tr><th>Compétence</th><th>Score</th><th>Jauge</th></tr></thead><tbody>${table}</tbody></table>
      <h4>Recommandations automatiques</h4><ul>${recos}</ul>`;

    return rows;
  }

  document.getElementById('reloadDiag').onclick = () => { current = sample(45); render(); result.innerHTML=''; };
  document.getElementById('calcDiag').onclick = compute;
  document.getElementById('printDiag').onclick = () => window.print();
  document.getElementById('exportDiag').onclick = () => {
    const scores = compute();
    const payload = { exportedAt: new Date().toISOString(), scores, items: current.map((x)=>x.id) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'diagnostic-cap-aepe.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  current = sample(45);
  render();
})();
