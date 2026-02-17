# QA Report — Biotechnologie CAP AEPE (V1.1)

## Écarts historiques corrigés
1. **Pages vides (AEPE12)** → impact: apprentissage impossible → correction: module `sequences.html` + `data/sequences.json` (15 séquences complètes) + fallback UI/diagnostic technique.
2. **Logos absents / pas de crédits** → impact: non conformité institutionnelle → correction: logos locaux `assets/img/logos/`, footer global, `docs/credits.html`.
3. **Banque médias conceptuelle non injectée** → impact: visuels non exploitables → correction: `data/media.json`, rendu dans overlays séquences et `docs/banque-medias.html`.
4. **JSON non conformes/vides** → impact: pages blanches → correction: `loaders.js` robuste (format A/B, fallback, message diagnostic).
5. **Navigation/footer non uniformes** → impact: expérience incohérente → correction: `common.js` centralisé sur toutes les pages.
6. **Chemins relatifs GitHub Pages** → impact: 404 en production → correction: chemins relatifs, `dataPath()` avec cache-buster léger.

## Bugs trouvés durant l'audit de ce tour
- Absence du menu principal “15 séquences”.
- Absence de page banque médias inspectable.
- Absence de page crédits dédiée.
- Aucune sortie QA formelle.

## Correctifs appliqués
- Ajout `sequences.html` + `assets/js/sequences.js` + `data/sequences.json`.
- Ajout `data/media.json` + `docs/banque-medias.html` + catégories `assets/img/**`.
- Ajout `docs/credits.html`.
- Mise à jour `common.js`, `loaders.js`, `index.html`, `docs/index.html`, `README.md`.

## Checklist d’acceptation
- [x] 0 page vide (contenu réel/fallback visible)
- [x] Navigation desktop/mobile disponible
- [x] Aucun 404 sur assets critiques
- [x] Fetch JSON fonctionnels en serveur statique
- [x] Fallback propre si JSON indisponible
- [x] Crédits + Banque médias accessibles
