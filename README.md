# Biotechnologie — CAP AEPE (V2 premium cours)

Plateforme statique GRETA orientée animation adulte/pro — CAP AEPE Bloc 1 / EP3.

## Évolutions majeures V2
- 15 séquences scientifiquement différenciées et non interchangeables
- scénarios terrain uniques par séquence (lieu/incident/contrainte)
- analyse décisionnelle structurée (3 options) + risque résiduel
- micro-protocoles actionnables + preuves EP3 attendues
- capsules refondues (micro-compétence + science + QCU argumenté)
- QCM contextualisés avec distracteurs crédibles
- schémas didactiques non décoratifs (mécanisme / décision / protocole / erreur fréquente)

## Liens & audit
- Conversation principale : https://chatgpt.com/s/cd_69948e1ea75c819191622f474fa81e06
- Conversation précédente du projet : (renseignement interne documenté)
- Liens versions (si fournis) : N/A

## Pages clés
- `sequences.html` — parcours formateur 15 séquences
- `parcours.html` — capsules opérationnelles
- `docs/stats.html` — métriques qualité
- `docs/credits.html` — crédits & sources

- `docs/bibliographie.html` — Références institutionnelles mobilisées


## Lancer en local
```bash
python -m http.server 8000
```
Puis ouvrir :
- `http://127.0.0.1:8000/index.html`
- `http://127.0.0.1:8000/sequences.html`
- `http://127.0.0.1:8000/parcours.html`

## QA locale (garde-fous automatiques)
```bash
python scripts/qa_local.py
```
Le script vérifie :
- HTML sanity (pas de markdown à la place d’une page HTML)
- chemins relatifs compatibles GitHub Pages
- absence de ressources manquantes (anti-404)
- validité/non-vacuité des JSON `data/`
- anti-répétitions séquences (n-grams + alertes)
- qualité QCM minimale + garde-fou anti-répétition en session

## Déploiement GitHub Pages
1. Pousser la branche sur GitHub.
2. Dans **Settings → Pages**, choisir la source (branche `main`/`work`, dossier `/root`).
3. Vérifier que tous les liens utilisent des chemins relatifs.
4. Rejouer `python scripts/qa_local.py` avant publication.


## Socle applicatif livré (non vide)
- Entraînement QCM (180+ items) avec correction argumentée, historique inter-sessions et reset.
- Diagnostic (45 items Likert) avec scoring par compétence, recommandations, export JSON et impression.
- Connaissances: 12 fiches, glossaire 30 entrées, 8 micro-protocoles, 10 pièges EP3.
- QA: `docs/stats.html` + `scripts/qa_local.py`.


## V3 consolidation experte
- 15 séquences renforcées (complexité progressive S01→S15, 6 visuels/seq).
- Entraînement: 225 questions (inclut 30 avancées EP3 + 15 hiérarchisation).
- Diagnostic: 45 items avec interprétation qualitative et orientation automatique vers séquences/notions.
- Connaissances enrichies: tableaux comparatifs et schémas thématiques additionnels.
