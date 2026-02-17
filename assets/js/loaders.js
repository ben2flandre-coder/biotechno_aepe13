async function loadData(path, key, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data[key])) return data[key];
    if (data && Array.isArray(data.items)) return data.items;
    return fallback;
  } catch (err) {
    console.warn('Chargement fallback', path, err.message);
    return fallback;
  }
}

function softParagraphs(text) {
  if (!text) return '<p>Contenu en cours de consolidation pédagogique.</p>';
  if (/<\w+[^>]*>/.test(text)) return text;
  return text.split(/\n\n+/).map((p) => `<p>${p.trim()}</p>`).join('');
}
