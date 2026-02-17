# Biotechnologie — CAP AEPE (plateforme statique)

Plateforme web statique professionnelle (HTML/CSS/JS vanilla) pour la formation adulte/pro au CAP AEPE : parcours capsules, connaissances, entraînement QCM, diagnostic et documentation inspectable.

## Liens & audit
- Conversation principale : https://chatgpt.com/s/cd_69948e1ea75c819191622f474fa81e06
- Conversation précédente du projet : [PLACEHOLDER_A_REMPLIR_PAR_BENOIT]
- Liens versions (si fournis) : [PLACEHOLDER_OPTIONNEL]

## Déploiement GitHub Pages
- Branche : `main`
- Dossier : racine `/`
- Aucune dépendance externe (CDN/lib/font). Tous les assets sont locaux.

## Fonctionnalités livrées
- Accueil avec pitch, roadmap en 3 étapes, KPIs, CTA et conformité.
- Parcours capsules avec recherche et overlay plein écran.
- Connaissances avec recherche et overlay.
- Entraînement QCM (10/20/30/40/50), tirage sans doublons par session, correction + explications + score.
- Diagnostic : 20 items tirés, score, synthèse par domaine, priorités < 70% et signalement des items sans answer.
- Footer institutionnel commun (3 logos + mentions conformité) sur toutes les pages.
- Thème clair/sombre + mode projection.

## QA checklist avant release
- [ ] Tous les liens nav OK
- [ ] Aucun 404 (css/js/media/docs/data)
- [ ] JSON parse OK
- [ ] Parcours charge capsules + overlay non vide
- [ ] Connaissances charge notions + overlay
- [ ] Entraînement charge questions + sans doublons + correction OK
- [ ] Diagnostic charge items + score + synthèse
- [ ] Logos visibles sur toutes les pages
- [ ] Mode projection augmente lisibilité
- [ ] Thème clair/sombre OK
- [ ] Console sans erreur

## Conformité
- Zéro tracking
- Zéro collecte de données personnelles
- Site statique inspectable et maintenable
