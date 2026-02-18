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

fails, warns = [], []

# A) HTML sanity
for html in HTML_FILES:
    text = html.read_text(encoding='utf-8', errors='ignore')
    top20 = '\n'.join(text.splitlines()[:20]).lower()
    html_pos = text.lower().find('<html')
    md_pos = text.find('\n## ')
    if not (text.lstrip().lower().startswith('<!doctype html>') or '<html' in top20):
        fails.append(f"[HTML sanity] {html.relative_to(ROOT)} invalid HTML wrapper")
    if md_pos != -1 and (html_pos == -1 or md_pos < html_pos):
        fails.append(f"[HTML sanity] {html.relative_to(ROOT)} markdown heading before <html>")

# B/C) links rules + existence
for html in HTML_FILES:
    parser = LinkParser()
    parser.feed(html.read_text(encoding='utf-8', errors='ignore'))
    for ref in parser.links:
        if not ref or ref.startswith(('http://','https://','mailto:','#','javascript:')):
            continue
        if ref.startswith('/assets/') or ref.startswith('/data/'):
            fails.append(f"[GitHub Pages paths] {html.relative_to(ROOT)} absolute path forbidden: {ref}")
            continue
        ref_clean = ref.split('#')[0].split('?')[0]
        target = (html.parent / ref_clean).resolve()
        if not target.exists():
            fails.append(f"[Resource existence] {html.relative_to(ROOT)} missing {ref}")

# C) JSON valid non-empty
json_payloads = {}
for js in JSON_FILES:
    try:
        payload = json.loads(js.read_text(encoding='utf-8'))
    except Exception as e:
        fails.append(f"[JSON] {js.relative_to(ROOT)} invalid: {e}")
        continue
    json_payloads[js.name] = payload
    if isinstance(payload, dict) and not payload:
        fails.append(f"[JSON] {js.relative_to(ROOT)} empty object")

# D) anti-duplicate sequences
seqs = json_payloads.get('sequences.json', {}).get('sequences', [])
if seqs:
    seen_loc_inc = set()

    def norm(s):
        s = s.lower()
        s = re.sub(r"[^a-zàâçéèêëîïôûùüÿñæœ0-9\s]", " ", s)
        return re.sub(r"\s+", " ", s).strip()

    def signature(s):
        f = s.get('bloc4_fondScientifique', {})
        b1 = s.get('bloc1_situationProfessionnelle', {})
        return norm(' '.join([
            s.get('title',''), b1.get('situation1',''),
            f.get('mecanismes',''), f.get('variablesInfluence',''),
            f.get('erreursInterpretation',''), f.get('contreExemple','')
        ]))

    def ngrams(text, n=4):
        toks = text.split()
        return set(tuple(toks[i:i+n]) for i in range(max(0, len(toks)-n+1)))

    for s in seqs:
        st = s.get('stats', {})
        key = (st.get('location','').lower().strip(), st.get('incident','').lower().strip())
        if key in seen_loc_inc:
            fails.append(f"[Sequences] duplicate context pair {key}")
        seen_loc_inc.add(key)

    for a,b in combinations(seqs,2):
        na, nb = ngrams(signature(a)), ngrams(signature(b))
        if not na or not nb:
            continue
        overlap = len(na & nb) / max(1, min(len(na), len(nb)))
        if overlap > 0.30:
            warns.append(f"[Sequences similarity] {a.get('id')} vs {b.get('id')} overlap {overlap:.2%}")

# E) QCM quality and no repeat session support
questions = json_payloads.get('questions.json', {}).get('questions', [])
if len(questions) < 180:
    fails.append(f"[QCM] questions count < 180 ({len(questions)})")
qseen = set()
for q in questions:
    qid = q.get('id')
    for k in ['theme','niveau','type','question','choix','reponses','justification','distracteurs_expliques','reference','tags','piege_examen','lien_notions']:
        if k not in q:
            fails.append(f"[QCM] {qid} missing key {k}")
    if not isinstance(q.get('choix'), list) or len(q['choix']) < 4:
        fails.append(f"[QCM] {qid} must have >=4 choices")
    if not isinstance(q.get('reponses'), list) or len(q['reponses']) < 1:
        fails.append(f"[QCM] {qid} must have >=1 correct answer")
    if not isinstance(q.get('justification',''), str) or len(q['justification'].strip()) < 80:
        fails.append(f"[QCM] {qid} weak justification")
    if q.get('question','').strip().lower() in qseen:
        fails.append(f"[QCM] duplicate question text {qid}")
    qseen.add(q.get('question','').strip().lower())


# semantic diversity + banned distractor patterns
banned_patterns = [
    "improviser selon l'habitude",
    'reporter la décision',
    'ressenti visuel',
]
for q in questions:
    low_choices = ' || '.join(c.lower() for c in q.get('choix', []))
    for pat in banned_patterns:
        if pat in low_choices:
            fails.append(f"[QCM] banned generic distractor pattern in {q.get('id')}: {pat}")

# semantic near-duplicate question audit
def norm_text(s):
    import re
    s = s.lower()
    s = re.sub(r"[^a-zàâçéèêëîïôûùüÿñæœ0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()

def trigrams(s):
    toks = norm_text(s).split()
    return set(tuple(toks[i:i+3]) for i in range(max(0,len(toks)-2)))

dups = 0
for i in range(len(questions)):
    for j in range(i+1, len(questions)):
        a,b=questions[i],questions[j]
        if a.get('theme') != b.get('theme'):
            continue
        ta,tb=trigrams(a.get('question','')),trigrams(b.get('question',''))
        if not ta or not tb:
            continue
        overlap = len(ta & tb) / max(1, min(len(ta),len(tb)))
        if overlap > 0.92:
            dups += 1
if dups > 30:
    fails.append(f"[QCM] semantic near-duplicates too high: {dups}")

ent_js = (ROOT/'assets/js/entrainement.js').read_text(encoding='utf-8', errors='ignore')
if 'localStorage' not in ent_js or 'splice(' not in ent_js:
    fails.append('[QCM session] no evidence of anti-repeat logic in entrainement.js')

adv_q = [q for q in questions if str(q.get('id','')).startswith('Q') and '[ADV-' in q.get('question','')]
hier_q = [q for q in questions if '[HIER-' in q.get('question','')]
if len(adv_q) < 30:
    fails.append(f"[QCM] advanced questions <30 ({len(adv_q)})")
if len(hier_q) < 15:
    fails.append(f"[QCM] hierarchisation questions <15 ({len(hier_q)})")

# Diagnostic min
diag = json_payloads.get('diagnostic.json', {}).get('items', [])
if len(diag) < 45:
    fails.append(f"[Diagnostic] items count <45 ({len(diag)})")
for d in diag:
    for k in ['id','competence','formulation','niveau','exemple_terrain','lien_notions']:
        if k not in d:
            fails.append(f"[Diagnostic] item missing {k}")

# Connaissances minimum
notions_payload = json_payloads.get('notions.json', {})
notions = notions_payload.get('notions', [])
gloss = notions_payload.get('glossaire', [])
micro = notions_payload.get('microprotocoles', [])
pieges = notions_payload.get('pieges_ep3', [])
if len(notions) < 12: fails.append(f"[Notions] <12 ({len(notions)})")
if len(gloss) < 30: fails.append(f"[Glossaire] <30 ({len(gloss)})")
if len(micro) < 8: fails.append(f"[Microprotocoles] <8 ({len(micro)})")
if len(pieges) < 10: fails.append(f"[Pieges] <10 ({len(pieges)})")

# media richness V3
media = json_payloads.get('media.json', {}).get('media', [])
learning = [m for m in media if (m.get('type') or '').startswith('schema-learning')]
theme_media = [m for m in media if (m.get('type') or '').startswith('schema-theme')]
if len(learning) < 20:
    fails.append(f"[Media] learning media <20 ({len(learning)})")
if len(theme_media) < 18:
    fails.append(f"[Media] theme media <18 ({len(theme_media)})")
for m in learning + theme_media:
    if not (ROOT / m.get('src','')).exists():
        fails.append(f"[Media] missing file {m.get('src')}")
# require +2 visuals per sequence (>=6 per seq)
for s in seqs:
    if len(s.get('media', [])) < 6:
        fails.append(f"[Sequences media] {s.get('id')} has <6 visuals")

# schema model diversity
models=set()
for s in seqs:
    sid=s.get('id','').lower()
    f=ROOT / f'assets/img/sequences/{sid}-schema-5.svg'
    if f.exists():
        txt=f.read_text(encoding='utf-8', errors='ignore')
        m=re.search(r'model:([a-z_]+)', txt)
        if m: models.add(m.group(1))
if len(models) < 8:
    fails.append(f"[Schemas] model diversity too low ({len(models)})")

print('QA local guardrails summary')
print(f'- HTML files scanned: {len(HTML_FILES)}')
print(f'- JSON files scanned: {len(JSON_FILES)}')
if warns:
    print(f'- WARNINGS: {len(warns)}')
    for w in warns[:10]:
        print('  WARN', w)
if fails:
    print(f'- FAILURES: {len(fails)}')
    for f in fails:
        print('  FAIL', f)
    sys.exit(1)
print('- FAILURES: 0')
print('- STATUS: GREEN')
