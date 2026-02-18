# QA_REPORT — Refonte qualitative V2 (mise à jour)

## Contrôles structurels par séquence
- S01 — blocs9=OK; mots=3018; situations=2; tableaux=3; schémas=4
- S02 — blocs9=OK; mots=2861; situations=2; tableaux=3; schémas=4
- S03 — blocs9=OK; mots=2850; situations=2; tableaux=3; schémas=4
- S04 — blocs9=OK; mots=2817; situations=2; tableaux=3; schémas=4
- S05 — blocs9=OK; mots=2784; situations=2; tableaux=3; schémas=4
- S06 — blocs9=OK; mots=2721; situations=2; tableaux=3; schémas=4
- S07 — blocs9=OK; mots=2749; situations=2; tableaux=3; schémas=4
- S08 — blocs9=OK; mots=2732; situations=2; tableaux=3; schémas=4
- S09 — blocs9=OK; mots=2748; situations=2; tableaux=3; schémas=4
- S10 — blocs9=OK; mots=2816; situations=2; tableaux=3; schémas=4
- S11 — blocs9=OK; mots=2802; situations=2; tableaux=3; schémas=4
- S12 — blocs9=OK; mots=2785; situations=2; tableaux=3; schémas=4
- S13 — blocs9=OK; mots=2793; situations=2; tableaux=3; schémas=4
- S14 — blocs9=OK; mots=2746; situations=2; tableaux=3; schémas=4
- S15 — blocs9=OK; mots=2725; situations=2; tableaux=3; schémas=4

## Agrégats
- Nombre de séquences: 15
- Minimum mots/séquence: 2721
- Schémas total séquences: 60
- Tableaux total déclarés: 45
- Sources externes par séquence (min): 6

## Audit QCM
- Nombre de questions: 30
- Doublons exacts: 0

## Verdict
- Conforme aux exigences structurelles demandées: Oui

## Garde-fous automatiques (script local)
- Script ajouté : `scripts/qa_local.py`.
- Portée couverte :
  - HTML sanity (doctype/html + détection markdown parasite avant `<html>`)
  - chemins GitHub Pages relatifs (interdiction `/assets/` et `/data/`)
  - existence des ressources référencées dans les HTML
  - validité et non-vacuité des JSON `data/*.json`
  - anti-répétitions séquences (n-grams + alerte de similarité)
  - qualité QCM minimale (bonne réponse, distracteurs, justification)
  - garde-fou session entraînement sans répétition (contrôle de stratégie d’échantillonnage)

## Smoke test manuel (documenté)
Date: 2026-02-17
- [x] Ouvrir `index.html`
- [x] Aller sur `sequences.html`
- [x] Ouvrir/fermer 3 overlays de séquences (S01, S02, S03) via navigateur
- [x] Aller sur `parcours.html`
- [x] Ouvrir 3 capsules
- [x] Aller sur `entrainement.html` puis vérifier affichage corrigé
- [x] Ouvrir `docs/credits.html`

## Captures QA
- `browser:/tmp/codex_browser_invocations/66a0c110143e2504/artifacts/artifacts/qa-index.png`
- `browser:/tmp/codex_browser_invocations/e2ecc975ac64c99d/artifacts/artifacts/qa-sequences-page.png`
- `browser:/tmp/codex_browser_invocations/64cb9601a6fe7879/artifacts/artifacts/qa-parcours-page.png`


## Extension socle complet (Entraînement / Diagnostic / Connaissances)
- nb_questions: 180
- nb_diagnostic_items: 45
- nb_notions: 12
- nb_glossaire: 30
- nb_microprotocoles: 8
- nb_pieges_ep3: 10
- nb_medias_learning: 20
- check pages non vides: `entrainement.html`, `diagnostic.html`, `connaissances.html` remplies et interactives.
- check entraînement: tirage sans doublon intra-session + historique inter-session localStorage + reset.
- check diagnostic: score par compétence (0-100), recommandations avec liens, export JSON + impression.


## Smoke test manuel demandé
Date: 2026-02-17
- [x] Ouvrir `index.html`
- [x] Aller sur `sequences.html`
- [x] Ouvrir/fermer 3 overlays différents
- [x] Ouvrir 3 capsules dans `parcours.html`
- [x] Ouvrir `entrainement.html` puis déclencher `Corriger`
- [x] Ouvrir `docs/credits.html`

Captures:
- `browser:/tmp/codex_browser_invocations/6078218a8b7425e5/artifacts/artifacts/v3-entrainement.png`
- `browser:/tmp/codex_browser_invocations/950d4d05718957ec/artifacts/artifacts/v3-diagnostic.png`
- `browser:/tmp/codex_browser_invocations/576eb638c716eedf/artifacts/artifacts/v3-connaissances.png`


## V3 consolidation experte
- nb_questions total: 225
- questions avancées EP3 ajoutées: 30
- questions hiérarchisation ajoutées: 15
- nb_diagnostic_items: 45
- orientation automatique diagnostic: active (liens séquences + notions)
- interprétation qualitative dynamique: active (fragile/intermédiaire/solide)
- médias ajoutés V3: learning=20, thème=18
- visuels par séquence: >= 6 (vérifié par QA script)
- placeholders supprimés: docs/index.html + README.md


## V3.1 consolidation experte pédagogique
- Schémas: affichage agrandi (80–90% conteneur), bouton `🔍 Agrandir`, ouverture modal plein écran, fermeture X/clic extérieur/Escape.
- QCM: feedback en 4 blocs (réponse correcte, justification EP3/EAJE, distracteurs analysés, aller plus loin).
- Boucle pédagogique active: QCM → notion associée (sans rechargement) → bouton retour à la session + scroll intelligent.
- Connaissances: section “Questions associées dans la banque” (3–5 ids dynamiques par notion).
- UX: espacements renforcés, boutons élargis, lisibilité projection améliorée, pas de scroll horizontal parasite.

### Validation V3.1
Date: 2026-02-17
- `python scripts/qa_local.py` => GREEN
- Capture UI entraînement: `browser:/tmp/codex_browser_invocations/7874f51e98bc36af/artifacts/artifacts/v31-entrainement-page.png`
- Capture UI séquences: `browser:/tmp/codex_browser_invocations/ba0d8decafa4b013/artifacts/artifacts/v31-sequences-page.png`
- Capture UI connaissances: `browser:/tmp/codex_browser_invocations/5f2167e0b328136e/artifacts/artifacts/v31-connaissances-page.png`


## V3.1 stabilisation experte (itération)
Date: 2026-02-17
- Schémas thématiques renforcés: modèles diversifiés (flux, matrice gravité/probabilité, cause→mécanisme→conséquence, protocole séquentiel, boucle qualité, hiérarchisation, chaîne contamination, cartographie zones, barrière EPI, biais décisionnel).
- Contrôle anti-clonage ajouté dans `scripts/qa_local.py` (diversité de modèles >= 8 vérifiée).
- QCM: distracteurs génériques supprimés; distracteurs contextualisés par thème.
- QCM ADV: scénarios multi-critères réellement contraints (temps/effectif/ressources) avec arbitrage professionnel.
- Audit unicité QCM: contrôle automatique similarité + détection patterns interdits.
- Docs nettoyées: suppression section “Liens & audit” + références conversationnelles.
- Validation: `python scripts/qa_local.py` => GREEN.
- Capture mise à jour: `browser:/tmp/codex_browser_invocations/37fd62554fa2deab/artifacts/artifacts/v311-sequences.png`.


## Audit inspection V3.1 — Top 15 anomalies + correctifs appliqués
1. QCM génériques multi-thèmes (énoncés clonés) → régénération contextualisée par thème.
2. Distracteurs interdits répétitifs (habitude/reporter/ressenti) → supprimés et remplacés par erreurs métier plausibles.
3. ADV insuffisamment contraints → arbitrages multicritères temps/effectif/ressources renforcés.
4. Similarité sémantique QCM trop forte → variations de templates + audit trigrammes intégré.
5. Schémas `schema-5/6` trop homogènes → diversification en 10 familles didactiques.
6. Schémas sans marque de modèle → annotation `model:*` injectée dans SVG pour audit.
7. Docs contenant contenu interne non utilisateur → section “Liens & audit” supprimée.
8. Crédits auteur incomplets → ajout explicite “Benoît Deflandre — 2026”.
9. Métadonnées médias incomplètes → `source`, `licence`, `source_url` ajoutés.
10. Manque de lien direct notion depuis QCM → bouton “Ouvrir dans Connaissances”.
11. Ancre notion non fiable → identifiants `#notion-XX` standardisés.
12. Ouverture notion depuis hash absente → auto-ouverture si hash présent.
13. Images non lazyloadées dans overlays → `loading=lazy` ajouté.
14. QA ne vérifiait pas auteur crédits → contrôle dédié ajouté.
15. QA ne vérifiait pas champs media source/licence → contrôles obligatoires ajoutés.
