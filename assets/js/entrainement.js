const HISTORY_KEY = 'aepe_qcm_history_v1';

(async function(){
  const all = await loadData('data/questions.json', 'questions', []);
  const notions = await loadData('data/notions.json', 'notions', []);
  const sizeSel = document.getElementById('sessionSize');
  const zone = document.getElementById('qcmZone');
  const score = document.getElementById('score');
  const info = document.getElementById('qcmInfo');
  const historyInfo = document.getElementById('historyInfo');

  const notionPanel = document.getElementById('notionPanel');
  const notionPanelBody = document.getElementById('notionPanelBody');
  const backToSessionBtn = document.getElementById('backToSession');

  let current = [];
  let lastQuestionElement = null;

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
      return `<div class="card q-item" data-idx="${idx}" id="q-${idx}">
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

  function renderNotionPanel(notionId, q) {
    const notion = notions.find((n) => n.id === notionId);
    if (!notion) return;
    const related = all.filter((x) => (x.lien_notions || []).includes(notion.id)).slice(0,5).map((x)=>x.id);
    notionPanelBody.innerHTML = `<h4>${notion.id} — ${notion.title}</h4>
      <p><strong>Définition opérationnelle:</strong> ${notion.definition_operationnelle || ''}</p>
      <p><strong>Criticité EAJE:</strong> ${notion.criticite_eaje || ''}</p>
      <p><strong>Points de contrôle:</strong></p><ul>${(notion.checklist_controle||[]).map((x)=>`<li>${x}</li>`).join('')}</ul>
      <p><strong>Questions associées dans la banque:</strong> ${related.join(', ') || 'N/A'}</p>
      <p><strong>Contexte depuis le QCM:</strong> ${q.id} (${q.theme}, niveau ${q.niveau})</p>`;
    notionPanel.style.display = 'block';
    notionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.getElementById('newSession').onclick = () => {
    notionPanel.style.display = 'none';
    current = drawUniqueSession(Number(sizeSel.value));
    render();
  };

  document.getElementById('resetHistory').onclick = () => {
    setHistory([]);
    updateHistoryBadge();
  };

  backToSessionBtn?.addEventListener('click', () => {
    notionPanel.style.display = 'none';
    if (lastQuestionElement) lastQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

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
      const notionId = (q.lien_notions || [])[0];

      exp.innerHTML = `<div class="feedback-block">
          <h4>Bloc 1 — Réponse correcte</h4>
          <p><strong>${good ? '✅ Correct' : '❌ Incorrect'}</strong> · Bonne(s) réponse(s): ${(q.reponses || []).map((x) => x + 1).join(', ')}</p>
          <p>Principe réglementaire: action sécurisée, protocole validé et traçabilité obligatoire en contexte CAP AEPE.</p>
        </div>
        <div class="feedback-block">
          <h4>Bloc 2 — Pourquoi c’est correct</h4>
          ${softParagraphs(q.justification)}
          <p><strong>Lien EP3:</strong> cohérence analyse → action → preuve en situation EAJE.</p>
          <p><strong>🎯 Compétence mobilisée :</strong> ${q.competence_mobilisee || 'Décider une action conforme, argumentée et traçable en contexte EAJE.'}</p>
        </div>
        <div class="feedback-block">
          <h4>Bloc 3 — Pourquoi les autres réponses sont incorrectes</h4>
          <ul>${distracteurs}</ul>
          <p>Erreur fréquente candidat CAP: choisir une réponse "rapide" au lieu d’une décision justifiable.</p>
        </div>
        <div class="feedback-block">
          <h4>Bloc 4 — Aller plus loin</h4>
          <button class="btn secondary open-notion" data-notion="${notionId}" data-idx="${idx}">Voir la notion associée</button> <a class="btn" href="connaissances.html#notion-${notionId}">Ouvrir dans Connaissances</a> <a class="btn secondary" href="sequences.html#${q.lien_sequence || ''}">Voir la séquence associée</a>
        </div>`;
    });

    zone.querySelectorAll('.open-notion').forEach((btn) => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.idx);
        lastQuestionElement = document.getElementById(`q-${idx}`);
        renderNotionPanel(btn.dataset.notion, current[idx]);
      };
    });

    score.textContent = `Score : ${ok}/${current.length}`;
  };

  updateHistoryBadge();
  current = drawUniqueSession(Number(sizeSel.value));
  render();
})();
