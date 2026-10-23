# Validation de la refonte SamaJaay

Vérification du **23 octobre 2026**, sur le build de production servi avec
`npm run start` à `http://localhost:3000`. Ce document concerne la **refonte v2**
(hero vert profond, textes agrandis, nouvelle composition et section groupage).

## Vérifications du code

- `npm run lint` : réussite, sans erreur ni avertissement.
- `npm run typecheck` : réussite, TypeScript strict.
- `npm run build` : réussite, page et routes SEO générées.
- Le script d’import des captures a été vérifié séparément : syntaxe Node,
  import partiel, intégrité des JPEG, réimport sans écrasement et rejet des
  fichiers invalides. Ces essais utilisaient des copies temporaires des anciens
  JPEG ; ils n’ont pas ajouté de nouvelles captures au site.

## Audit navigateur de la refonte

```bash
python scripts/audit.py --chromium /usr/bin/chromium --output-dir artifacts/redesign
```

Python Playwright, Chromium 154 et axe-core sont des outils de contrôle séparés,
installés hors des dépendances applicatives.

| Contrôle                                     | Résultat                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Largeurs 360, 390, 430, 768, 1024 et 1440 px | Aucun débordement horizontal ni texte coupé détecté                                              |
| Axe : WCAG 2 A, 2 AA et 2.1 AA               | 0 violation détectée aux 6 largeurs                                                              |
| Paragraphes fonctionnels contrôlés           | Au moins 16 px aux 6 largeurs                                                                    |
| Header, menu, onglets et CTA contrôlés       | Au moins 44 px de hauteur ; menu mobile 48 px                                                    |
| CTA du header et du hero                     | Visibles dès le premier écran aux 6 largeurs                                                     |
| Destination des CTA                          | Même URL applicative configurée, `https://samajaay.com/` dans ce build                           |
| Navigation interne                           | Aucune ancre cassée                                                                              |
| Démonstration : 5 captures accessibles       | Clic, flèches, Home/End, focus et panneau unique : réussite                                      |
| FAQ native                                   | Ouverture au clic et au clavier : réussite                                                       |
| Menu mobile                                  | Ouverture, Échap, restitution du focus et fermeture au clic sur un lien : réussite               |
| JavaScript désactivé                         | H1 et CTA visibles, FAQ fonctionnelle, 5 liens directs vers les captures                         |
| Réduction des mouvements                     | Préférence détectée ; défilement doux et transitions désactivés                                  |
| Analytics sans consentement                  | Aucun événement transmis à l’adaptateur                                                          |
| Analytics avec consentement                  | Un événement `cta_click` pour un clic                                                            |
| Erreur de l’adaptateur analytics             | Contenue, sans interruption de navigation                                                        |
| Erreurs JavaScript                           | Aucune détectée                                                                                  |
| Langue et titres                             | `fr-SN`, un seul H1                                                                              |
| Images                                       | Aucun attribut `alt` manquant                                                                    |
| Robots, sitemap, image Open Graph, icônes    | HTTP 200 et types de contenu cohérents                                                           |
| URL inconnue                                 | HTTP 404, sans JSON-LD d’accueil                                                                 |
| Groupage                                     | Section présente, Alibaba cité, mention d’absence de garde d’argent visible                      |
| FAQ et JSON-LD                               | Les 8 questions/réponses correspondent au contenu visible ; le logiciel décrit aussi le groupage |

Les sélecteurs de lisibilité ciblent les descriptions du hero, sections,
fonctionnalités, étapes du groupage, FAQ et légendes détaillées de démonstration.
Les légendes courtes et métadonnées conservent une taille de 13–15 px selon leur
rôle ; elles ne sont pas présentées comme du texte courant à 16 px.

Rapport : `artifacts/redesign/browser-audit.json`.
Captures complètes : `artifacts/redesign/responsive-{360,390,430,768,1024,1440}.png`.
Vues du premier écran : `artifacts/redesign/hero-desktop.png` (1440 × 1000),
`hero-mobile.png` (390 × 844) et `hero-mobile-360.png` (360 × 844).
La section groupage a aussi été photographiée sur ordinateur et mobile.

Ces contrôles ne constituent pas une certification WCAG. Axe laisse un contrôle
à vérifier manuellement ; une vérification sur appareils physiques et avec
lecteurs d’écran reste pertinente.

## Lighthouse de la refonte

Lighthouse **13.5.0**, Chromium **154**, profil mobile par défaut et profil
desktop officiel. Les audits ont été exécutés **l’un après l’autre**, sans
navigateur de contrôle lancé en parallèle.

Les rapports isolés finaux donnent :

| Mesure                   |         Mobile | Ordinateur |
| ------------------------ | -------------: | ---------: |
| Performance              |         **95** |    **100** |
| Accessibilité            |        **100** |    **100** |
| Bonnes pratiques         |        **100** |    **100** |
| SEO                      |        **100** |    **100** |
| First Contentful Paint   |     1 032,7 ms |   295,3 ms |
| Largest Contentful Paint | **2 820,8 ms** |   652,2 ms |
| Total Blocking Time      |         109 ms |    10,5 ms |
| Cumulative Layout Shift  |              0 |          0 |
| Benchmark CPU Lighthouse |          2 304 |      2 097 |

Rapports isolés à consulter :

- `artifacts/redesign-lighthouse-mobile-isolated.report.html` et `.json`.
- `artifacts/redesign-lighthouse-desktop-isolated.report.html` et `.json`.

Les quatre objectifs de scores Lighthouse sont atteints dans ces mesures.
**Le LCP mobile reste supérieur à la cible de 2,5 s** : environ 2,82 s.
L’INP n’a pas été mesuré sur du trafic réel. Le TBT est une mesure de laboratoire
et ne remplace pas l’INP. Les Core Web Vitals terrain restent à confirmer au
75e percentile, sur les appareils et réseaux réellement utilisés au Sénégal.

### Variabilité observée

Les premières mesures de cette refonte donnaient **57** en performance mobile
(TBT 2 070 ms, benchmark CPU 1 009) et **98** sur ordinateur (benchmark 1 295).
Après vérification de la fermeture des navigateurs et nouvelle exécution isolée,
les scores sont passés à 95 et 100, **sans aucun changement produit**. Les
benchmarks CPU ont eux aussi fortement varié. Les premiers rapports sont
conservés sous `artifacts/redesign-lighthouse-mobile.report.*` et
`artifacts/redesign-lighthouse-desktop.report.*` ; ils ne sont pas cachés ni
présentés comme les résultats isolés finaux.

La v1 avait obtenu 94 sur mobile et 100 sur ordinateur, avec un LCP mobile de
2 819,3 ms. La refonte affiche donc un LCP comparable dans les mesures isolées ;
une variation d’un point de score ne démontre pas à elle seule une amélioration
terrain. Les conditions de l’hôte, du réseau et du futur hébergement peuvent
modifier les résultats.

## Nouvelles captures : limite réelle

Les 16 captures WhatsApp fournies sont visibles dans la conversation et ont
permis de documenter le groupage, mais leurs fichiers binaires restent sur le PC
Windows. Le chemin communiqué n’est pas monté dans cet environnement Linux.
Le manifeste `src/lib/imported-screens.json` reste donc vide : **cinq anciennes
captures authentiques sont actuellement servies, aucune capture reconstituée**.

Le script `scripts/import-screens.mjs` prépare leur ajout depuis le dossier
Windows, sans retouche ni écrasement. Il sélectionne jusqu’à dix nouveaux écrans
réellement présents et permet leur affichage après un nouveau build. Voir
`docs/import-captures.md`.

## Reproduire les contrôles

Après `npm ci`, `npm run lint`, `npm run typecheck` et `npm run build`, garder
`npm run start` actif dans un terminal. Dans un autre :

```bash
python scripts/audit.py --chromium /usr/bin/chromium --output-dir artifacts/redesign

CHROME_PATH=/usr/bin/chromium /tmp/samajaay-qa/node_modules/.bin/lighthouse \
  http://localhost:3000 \
  --chrome-flags='--no-sandbox --headless --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=artifacts/redesign-lighthouse-mobile-isolated --quiet

CHROME_PATH=/usr/bin/chromium /tmp/samajaay-qa/node_modules/.bin/lighthouse \
  http://localhost:3000 --preset=desktop \
  --chrome-flags='--no-sandbox --headless --disable-dev-shm-usage' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=artifacts/redesign-lighthouse-desktop-isolated --quiet
```

Adapter `--chromium`, `--axe` et les chemins des outils si nécessaire. Les
instructions d’installation des outils QA figurent dans le README. Exécuter les
audits séquentiellement. `artifacts/` est ignoré par Git.

## Avant mise en ligne

`samajaay.com` héberge actuellement l’application Flutter officielle. Avant d’y
installer la landing, vérifier une autre destination réelle pour l’application
et renseigner `NEXT_PUBLIC_APP_URL`. `NEXT_PUBLIC_SITE_URL` doit correspondre à
l’adresse publique de la landing pour sa canonique et son sitemap.

Les coordonnées et liens officiels proviennent de `docs/sources.md`. Les skills
installés et leurs noms réels sont recensés dans `docs/skills-installation.md`.
