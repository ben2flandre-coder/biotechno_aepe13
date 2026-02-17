(async function () {
  const seqs = await loadData('data/sequences.json', 'sequences', []);
  const media = await loadData('data/media.json', 'media', []);
  const list = document.getElementById('seqList');
  const search = document.getElementById('searchSeq');
  const overlay = document.getElementById('seqOverlay');
  const body = document.getElementById('seqBody');
  const stats = document.getElementById('seqStats');

  function fullMedia(id) { return media.find((m) => m.id === id); }

  function renderStats(items) {
    const totalWords = items.reduce((acc, s) => acc + (s.stats?.wordCount || 0), 0);
    const totalSchemas = items.reduce((acc, s) => acc + (s.stats?.schemaCount || 0), 0);
    stats.innerHTML = `<span class="badge">Séquences: ${items.length}</span>
      <span class="badge">Mots totaux: ${totalWords}</span>
      <span class="badge">Schémas: ${totalSchemas}</span>`;
  }

  function render(items) {
    renderStats(items);
    list.innerHTML = items.map((s) => `<article class="card item">
      <div class="meta">${s.id}</div>
      <h3>${s.title}</h3>
      <p>${(s.cours || '').slice(0, 220)}...</p>
      <div><span class="badge">${s.stats?.wordCount || 0} mots</span><span class="badge">${s.stats?.schemaCount || 0} schémas</span></div>
      <button class="btn" data-open="${s.id}">Ouvrir le cours</button>
    </article>`).join('');

    list.querySelectorAll('[data-open]').forEach((btn) => btn.onclick = () => {
      const s = items.find((x) => x.id === btn.dataset.open);
      const mediaHtml = (s.media || []).map((id) => {
        const m = fullMedia(id);
        if (!m) return `<p>Média introuvable: ${id}</p>`;
        return `<figure><img src="${m.src}" alt="${m.alt}" style="max-width:280px"><figcaption>${m.credit}</figcaption></figure>`;
      }).join('') || '<p>Aucun média.</p>';

      body.innerHTML = `<h2>${s.title}</h2>
      <p><strong>Objectif :</strong> ${s.objectif || ''}</p>
      <p><span class="badge">${s.stats?.wordCount || 0} mots</span><span class="badge">${s.stats?.schemaCount || 0} schémas</span></p>
      <h3>Cours riche</h3>${softParagraphs(s.cours)}
      <h3>Protocoles / Méthodes</h3><ul>${(s.protocoles || []).map((p) => `<li>${p}</li>`).join('')}</ul>
      <h3>Points de vigilance / Red flags</h3>${(s.redflags || []).map((r) => `<div class="alert">${r}</div>`).join('')}
      <h3>Cas pro contextualisé AEPE</h3>${softParagraphs(s.casPro)}
      <h3>Références</h3><ul>${(s.references || []).map((r) => `<li>${r}</li>`).join('')}</ul>
      <h3>Schémas pédagogiques</h3>${mediaHtml}`;
      overlay.classList.add('open');
    });
  }

  search.oninput = () => {
    const q = search.value.toLowerCase();
    render(seqs.filter((s) => `${s.title} ${s.id}`.toLowerCase().includes(q)));
  };

  render(seqs);
})();
