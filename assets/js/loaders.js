const DATA_VERSION = '20260217';

function dataPath(path) {
  return `${path}${path.includes('?') ? '&' : '?'}v=${DATA_VERSION}`;
}

async function loadData(path, key, fallback) {
  const diagnostics = document.getElementById('techDiagnostics');
  try {
    const res = await fetch(dataPath(path));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const extracted = Array.isArray(data) ? data : (Array.isArray(data?.[key]) ? data[key] : (Array.isArray(data?.items) ? data.items : null));
    if (!extracted || extracted.length === 0) throw new Error('JSON vide ou structure invalide');
    diagnostics?.insertAdjacentHTML('beforeend', `<li>✅ ${path} chargé (${extracted.length} entrées)</li>`);
    return extracted;
  } catch (err) {
    console.error(`Erreur chargement ${path}:`, err);
    diagnostics?.insertAdjacentHTML('beforeend', `<li>⚠️ ${path} indisponible (${err.message}) → fallback activé</li>`);
    return fallback;
  }
}

function softParagraphs(text) {
  if (!text) return '<p>Contenu indisponible : fichier manquant/JSON invalide.</p>';
  if (/<\w+[^>]*>/.test(text)) return text;
  return text.split(/\n\n+/).map((p) => `<p>${p.trim()}</p>`).join('');
}
