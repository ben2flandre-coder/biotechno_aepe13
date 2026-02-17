#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from itertools import combinations

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.rglob('*.html'))
JSON_FILES = sorted((ROOT / 'data').glob('*.json'))

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key].strip())

fails = []
warns = []

# A) HTML sanity
for html in HTML_FILES:
    text = html.read_text(encoding='utf-8', errors='ignore')
    lines = text.splitlines()
    top20 = '\n'.join(lines[:20]).lower()
    html_pos = text.lower().find('<html')
    md_pos = text.find('\n## ')
    if not (text.lstrip().lower().startswith('<!doctype html>') or '<html' in top20):
        fails.append(f"[HTML sanity] {html.relative_to(ROOT)}: missing <!doctype html> and no <html in first 20 lines")
    if md_pos != -1 and (html_pos == -1 or md_pos < html_pos):
        fails.append(f"[HTML sanity] {html.relative_to(ROOT)}: markdown heading before <html>")

# B/C) path rules + existence from HTML
for html in HTML_FILES:
    parser = LinkParser()
    data = html.read_text(encoding='utf-8', errors='ignore')
    parser.feed(data)
    for ref in parser.links:
        if not ref or ref.startswith(('http://', 'https://', 'mailto:', '#', 'javascript:')):
            continue
        if ref.startswith('/assets/') or ref.startswith('/data/'):
            fails.append(f"[GitHub Pages paths] {html.relative_to(ROOT)}: forbidden absolute path {ref}")
            continue
        base = html.parent
        target = (base / ref).resolve()
        # strip query/hash fallback
        ref_clean = ref.split('#')[0].split('?')[0]
        target = (base / ref_clean).resolve()
        if not target.exists():
            fails.append(f"[Resource existence] {html.relative_to(ROOT)}: missing {ref}")

# C) JSON validity + non-empty
for js in JSON_FILES:
    try:
        payload = json.loads(js.read_text(encoding='utf-8'))
    except Exception as e:
        fails.append(f"[JSON] {js.relative_to(ROOT)} invalid: {e}")
        continue
    if isinstance(payload, dict):
        if not payload:
            fails.append(f"[JSON] {js.relative_to(ROOT)} empty object")
        for k, v in payload.items():
            if isinstance(v, list) and len(v) == 0:
                fails.append(f"[JSON] {js.relative_to(ROOT)} key '{k}' is empty list")
    elif isinstance(payload, list):
        if len(payload) == 0:
            fails.append(f"[JSON] {js.relative_to(ROOT)} empty list")

# D) Anti-duplicates for sequences
seq_path = ROOT / 'data' / 'sequences.json'
if seq_path.exists():
    seqs = json.loads(seq_path.read_text(encoding='utf-8')).get('sequences', [])
    seen_context = set()

    def norm(text: str) -> str:
        text = text.lower()
        text = re.sub(r"[^a-zàâçéèêëîïôûùüÿñæœ0-9\s]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def signature(s):
        f = s.get('bloc4_fondScientifique', {})
        b1 = s.get('bloc1_situationProfessionnelle', {})
        b7 = s.get('bloc7_casGroupeArbitrage', {})
        return norm(' '.join([
            s.get('title', ''),
            b1.get('situation1', ''),
            f.get('mecanismes', ''),
            f.get('variablesInfluence', ''),
            f.get('erreursInterpretation', ''),
            f.get('contreExemple', ''),
            f.get('limitesApplication', ''),
            f.get('comparaisonTerrain', ''),
            b7.get('situation', ''),
        ]))

    def ngrams(text, n=4):
        toks = text.split()
        return set(tuple(toks[i:i+n]) for i in range(max(0, len(toks)-n+1)))

    for s in seqs:
        st = s.get('stats', {})
        key = (st.get('location', '').strip().lower(), st.get('incident', '').strip().lower())
        if key in seen_context:
            fails.append(f"[Sequences duplicates] repeated location/incident tuple: {key}")
        seen_context.add(key)

    for a, b in combinations(seqs, 2):
        na, nb = ngrams(signature(a)), ngrams(signature(b))
        if not na or not nb:
            continue
        overlap = len(na & nb) / max(1, min(len(na), len(nb)))
        if overlap > 0.30:
            warns.append(f"[Sequences similarity] {a.get('id')} vs {b.get('id')} overlap={overlap:.2%}")

# E) QCM quality
qpath = ROOT / 'data' / 'questions.json'
if qpath.exists():
    qdata = json.loads(qpath.read_text(encoding='utf-8')).get('questions', [])
    q_text_seen = set()
    for i, q in enumerate(qdata, start=1):
        qid = q.get('id', f'#{i}')
        options = q.get('options', [])
        ans = q.get('answer', None)
        explain = q.get('explain', '')
        if not isinstance(options, list) or len(options) < 4:
            fails.append(f"[QCM] {qid}: requires >=4 options")
            continue
        if not isinstance(ans, int) or not (0 <= ans < len(options)):
            fails.append(f"[QCM] {qid}: invalid answer index")
        distractors = [o for idx, o in enumerate(options) if idx != ans]
        if len([d for d in distractors if isinstance(d, str) and len(d.strip()) >= 8]) < 3:
            fails.append(f"[QCM] {qid}: distractors not plausible enough")
        if not isinstance(explain, str) or len(explain.strip()) < 20:
            fails.append(f"[QCM] {qid}: missing justification/corrigé")
        k = q.get('q', '').strip().lower()
        if k in q_text_seen:
            fails.append(f"[QCM] duplicate question stem: {qid}")
        q_text_seen.add(k)

    # session no-repeat check (data-level + JS strategy)
    if len({q.get('id') for q in qdata}) != len(qdata):
        fails.append("[QCM session] duplicate ids in questions.json")
    js = (ROOT / 'assets' / 'js' / 'entrainement.js').read_text(encoding='utf-8', errors='ignore')
    if 'splice(' not in js:
        fails.append("[QCM session] entrainement.js does not clearly sample without replacement (splice missing)")

print('QA local guardrails summary')
print(f"- HTML files scanned: {len(HTML_FILES)}")
print(f"- JSON files scanned: {len(JSON_FILES)}")
if warns:
    print(f"- WARNINGS: {len(warns)}")
    for w in warns[:15]:
        print('  WARN', w)
    if len(warns) > 15:
        print(f"  ... {len(warns)-15} more")
if fails:
    print(f"- FAILURES: {len(fails)}")
    for f in fails:
        print('  FAIL', f)
    sys.exit(1)
print('- FAILURES: 0')
print('- STATUS: GREEN')
