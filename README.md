# Biotechnologie — CAP AEPE (plateforme statique)

Plateforme web statique professionnelle (HTML/CSS/JS vanilla) pour CAP AEPE Bloc 1 / EP3.

## Liens & audit
- Conversation principale : https://chatgpt.com/s/cd_69948e1ea75c819191622f474fa81e06
- Conversation précédente du projet : [PLACEHOLDER_A_REMPLIR_PAR_BENOIT]
- Liens versions (si fournis) : [PLACEHOLDER_OPTIONNEL]

## Parcours livré
- 15 séquences officielles “Version Benoît” dans `sequences.html`.
- Parcours capsules, connaissances, entraînement QCM et diagnostic.
- Pages inspectables : `docs/credits.html`, `docs/banque-medias.html`, `docs/index.html`.
- Banque médias locale avec registre `data/media.json`.

## Déploiement GitHub Pages
- Branche : `main`
- Dossier : racine `/`
- Chemins relatifs compatibles base path repo.
- Aucun CDN/lib externe obligatoire.

## QA checklist avant release
- [ ] Tous les liens nav OK
- [ ] Aucun 404 (css/js/media/docs/data)
- [ ] JSON parse OK
- [ ] Module 15 séquences charge + overlay + mini-quiz
- [ ] Parcours charge capsules + overlay non vide
- [ ] Connaissances charge notions + overlay
- [ ] Entraînement charge questions + sans doublons + correction OK
- [ ] Diagnostic charge items + score + synthèse
- [ ] Logos visibles sur toutes les pages
- [ ] Mode projection augmente lisibilité
- [ ] Thème clair/sombre OK
- [ ] Console sans erreur bloquante

## Conformité
- Zéro tracking
- Zéro collecte de données personnelles
- Site statique inspectable et maintenable
