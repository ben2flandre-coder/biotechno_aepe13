const HISTORY_KEY = 'aepe_qcm_history_v1';

(async function(){
  const all = await loadData('data/questions.json', 'questions', []);
  const sizeSel = document.getElementById('sessionSize');
  const zone = document.getElementById('qcmZone');
  const score = document.getElementById('score');
  const info = document.getElementById('qcmInfo');
  const historyInfo = document.getElementById('historyInfo');

  let current = [];

  const getHistory = () => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  };
  const setHistory = (ids) => localStorage.setItem(HISTORY_KEY, JSON.stringify(ids));

  function updateHistoryBadge() {
    historyInfo.textContent = `Historique inter-sessions: ${getHistory().length} questions`;
  }

  function drawUniqueSession(size) {
    const history = new Set(getHistory());
    const unseen = all.filter((q) => !history.has(q.id));
    const pool = unseen.length >= size ? [...unseen] : [...all];
    const picked = [];

    while (pool.length && picked.length < size) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }

    const mergedHistory = Array.from(new Set([...getHistory(), ...picked.map((q) => q.id)]));
    setHistory(mergedHistory);
    updateHistoryBadge();
    return picked;
  }

  function render() {
    info.innerHTML = `Banque chargée: <strong>${all.length}</strong> items · session: <strong>${current.length}</strong> · sans doublon intra-session.`;
    zone.innerHTML = current.map((q, idx) => {
      const multiple = q.type === 'QCM';
      return `<div class="card q-item" data-idx="${idx}">
        <p><strong>${idx + 1}. ${q.question}</strong></p>
        <p><span class="badge">${q.theme}</span><span class="badge">Niveau ${q.niveau}</span><span class="badge">${q.type}</span></p>
        ${(q.choix || []).map((o, oi) => `<label><input type="${multiple ? 'checkbox' : 'radio'}" name="q${idx}" value="${oi}"> ${o}</label><br>`).join('')}
        <div class="explain"></div>
      </div>`;
    }).join('');
    score.textContent = '';
  }

  function selectedAnswers(el, idx, isQCM) {
    if (isQCM) return Array.from(el.querySelectorAll(`input[name='q${idx}']:checked`)).map((x) => Number(x.value)).sort((a,b)=>a-b);
    const r = el.querySelector(`input[name='q${idx}']:checked`);
    return r ? [Number(r.value)] : [];
  }

  document.getElementById('newSession').onclick = () => {
    current = drawUniqueSession(Number(sizeSel.value));
    render();
  };

  document.getElementById('resetHistory').onclick = () => {
    setHistory([]);
    updateHistoryBadge();
  };

  document.getElementById('correctSession').onclick = () => {
    let ok = 0;
    zone.querySelectorAll('.q-item').forEach((el, idx) => {
      const q = current[idx];
      const expected = [...(q.reponses || [])].sort((a,b)=>a-b);
      const picked = selectedAnswers(el, idx, q.type === 'QCM');
      const exp = el.querySelector('.explain');
      const good = JSON.stringify(expected) === JSON.stringify(picked);

      el.classList.toggle('correct', good);
      el.classList.toggle('wrong', !good);
      if (good) ok++;

      const distracteurs = Object.entries(q.distracteurs_expliques || {}).map(([k,v]) => `<li><strong>Choix ${Number(k)+1}:</strong> ${v}</li>`).join('');
      const notionLink = (q.lien_notions || []).map((n) => `<a href="connaissances.html#${n}">${n}</a>`).join(', ');
      exp.innerHTML = `<p><strong>${good ? '✅ Correct' : '❌ Incorrect'}</strong> — Bonne(s) réponse(s): ${(q.reponses || []).map((x) => x + 1).join(', ')}</p>
        ${softParagraphs(q.justification)}
        <p><strong>Pourquoi les distracteurs sont faux :</strong></p><ul>${distracteurs}</ul>
        <p><strong>Voir la notion :</strong> ${notionLink}</p>`;
    });
    score.textContent = `Score : ${ok}/${current.length}`;
  };

  updateHistoryBadge();
  current = drawUniqueSession(Number(sizeSel.value));
  render();
})();
