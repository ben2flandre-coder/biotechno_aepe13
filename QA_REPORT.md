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


## Audit inspection + correction profonde (2026-02-18)
- Anomalies détectées: accueil orienté roadmap chantier, sections `Diagnostic technique (dev)` exposées, options QCM encore partiellement répétitives, absence de lien séquence direct dans les items.
- Corrections appliquées:
  - Accueil refondu en tableau de bord pédagogique (sommaire 15 séquences + accès directs QCM/Diagnostic/Connaissances).
  - Sections dev supprimées sur pages utilisateur (séquences, connaissances, entraînement, diagnostic, docs médias/stats).
  - Banque QCM durcie: ajout `lien_sequence`, distracteurs contextualisés par thème, suppression des patterns interdits, variation renforcée des choix.
  - Feedback enrichi: bouton vers la séquence associée en plus du lien notion.
  - QA script renforcé: clé `lien_sequence` obligatoire + détection de séries de choix identiques.
- Métriques mises à jour:
  - nb questions: 225
  - doublons exacts questions: 0
  - doublons exacts séries de choix: 0 (contrôle QA script)
  - nb médias intégrés: 128
  - nb schémas uniques (modèles détectés): >= 8


## Diffusion classe — correctif critique (2026-02-18)
- QCM: suppression des marqueurs techniques injectés dans les choix (`[Qxxx]`, `[Repère ...]`) pour revenir à une rédaction pédagogique propre.
- QCM: ajout du champ `competence_mobilisee` sur l’ensemble des items + affichage explicite dans le feedback corrigé.
- QCM: résolution des dernières séries de choix dupliquées par contextualisation terrain naturelle (sans identifiants techniques).
- Diagnostic: correction des liens notions (`connaissances.html#notion-XX`) + synthèse par domaine clarifiée.
- Production: maintien des pages sans bloc dev visible, navigation et contenus immédiats conservés.
- Métriques:
  - Questions robustes: 225
  - Doublons exacts énoncés: 0
  - Doublons exacts séries de choix: 0 (QA)
  - Médias inventoriés: 128


## Stabilisation diffusion classe — itération finale (2026-02-18)
- QCM: amélioration de la correction affichée sous chaque question avec analyse explicite des distracteurs réellement choisis (alignement index réponses/distracteurs).
- QCM: libellés pédagogiques clarifiés dans le feedback (`✅ Justification`, `❌ Pourquoi les autres réponses sont incorrectes`, `📚 Voir la notion associée`).
- Capsules: ajout de 3 blocs opérationnels sur chaque fiche ouverte (`Application terrain EAJE`, `Erreur fréquente`, `Point inspection / conformité`) sans refonte structurelle.
- Logos & crédits: mention footer renforcée `Conception pédagogique et intégration : Benoît Deflandre`.
- Stabilité: vérification absence 404 front (smoke local), absence doublons JSON QCM, et QA script GREEN.


## Diffusion pro — contrôle final (2026-02-18)
- Fixes appliqués: dashboard accueil finalisé, fallback HTML séquences (15 entrées), fallback banque médias (20 entrées min) et footer harmonisé.
- Stabilité: debug masqué en prod (mode `?dev=1` uniquement), aucun marqueur phase/roadmap/dev visible.
- Validation OK: pages clés non vides + QA GREEN + smoke local sans erreurs bloquantes.


## Correctif ciblé diffusion pro (2026-02-19)
- Accueil validé en mode dashboard sans aucun marqueur phase/roadmap/non-active ; CTA et blocs classe/conformité présents.
- Banque médias: fallback HTML pré-rempli (20 lignes visibles sans JS: Titre/Thème/Source/Licence).
- Footer global vérifié (logos + mention Benoît Deflandre 2026 + zéro collecte) sur plusieurs pages clés.


## Poncage diffusion GitHub Pages (2026-02-19)
- Audit: pages rendues utiles sans JS (fallbacks ajoutés sur séquences/connaissances/QCM/diagnostic + banque médias non vide).
- Root cause: dépendance forte à l’injection JS et footer non garanti en HTML brut.
- Prévention: check-list systématique avant diffusion (fallback non vide, logos/crédits visibles, fetch relatifs, QA local GREEN).


## QA blocant final (2026-02-19)
- Métriques: notions=25, QCM=225, médias=128, séquences=15, champs QCM enrichis (`domain/sequenceId/notionIds/q/options/answerIndex/explain/whyNot/refs`).
- Doublons supprimés: 0 doublon exact question + 0 doublon exact set options (contrôle QA script).
- Validation: 0 page vide en fallback HTML, 0 404 assets/data sur smoke local, debug masqué hors `?dev=1`.


## Correctif wording diffusion (2026-02-19)
- Texte accueil ajusté pour supprimer toute ambiguïté de libellé “bouton )”.
- Mentions footer uniformisées partout: “Conception pédagogique & intégration : Benoît Deflandre — 2026” et “Zéro collecte de données personnelles — GitHub Pages”.
- Vérification: pages cœur non vides sans JS + QA GREEN.

## Correctif HTML crédits (2026-02-19)
- Correction d’un bloc `<ul>` mal fermé dans `docs/credits.html` (structure HTML valide en inspection statique).
- Impact: amélioration de la robustesse no-JS et suppression d’un risque d’affichage incohérent selon navigateur.
- Vérification: QA local GREEN + page `docs/credits.html` servie en HTTP 200.
