# Validation de la refonte SamaJaay

Vérification du **23 octobre 2026**, sur le build de production servi avec
`npm run start` à `http://localhost:3000`. Ce document concerne la **refonte v2**
(hero vert profond, textes agrandis, nouvelle composition et section groupage).

## Mise à jour finale : GA4, domaine et animations légères

Le build final intègre l’identifiant public fourni par le propriétaire,
`G-2E8X0XGQX2`, avec consentement explicite. Le propriétaire a confirmé la
validation DNS de sa propriété Search Console. Aucun compte distant ni DNS
n’a été modifié ici, et le sitemap n’a pas été soumis dans cette console.

Les modifications parallèles du propriétaire sur GitHub ont été fusionnées et
conservées. L’application `https://app.samajaay.com/` répond en HTTP 200 avec
son bootstrap Flutter ; son bundle contient la route de confidentialité.
Tous les CTA partagent cette destination, et un garde-fou remplace l’ancienne
variable pointant à la racine de la landing pour éviter une boucle. Le lien
de confidentialité utilise également le sous-domaine applicatif.

- `npm run lint`, `npm run typecheck`, `npm run build` et `git diff --check` : réussite.
- Audit navigateur répété à 360, 390, 430, 768, 1024 et 1440 px : aucun
  débordement, aucune violation axe, aucune erreur JavaScript ; onglets, FAQ,
  menu, liens, rendu sans JavaScript et réduction des mouvements fonctionnels.
- `scripts/audit-analytics.py` : aucun appel Google avant accord ni après refus ;
  refus persistant, une vue de page par visite, clic CTA consenti unique,
  retrait bloquant les événements suivants et suppression des cookies GA
  accessibles. Réouverture au clavier et restitution du focus vérifiées.
- Les requêtes Google de ces tests ont toutes été interceptées : aucune
  collecte réelle ni réception dans le compte GA4 n’a été prétendue vérifiée.
- La redirection `www.samajaay.com` répond en HTTP 308 vers `samajaay.com`,
  chemin et paramètres conservés. Les véritables jetons de vérification restent
  absents du build final ; les balises facultatives ont été contrôlées dans un
  build isolé avec des jetons synthétiques.
- Le bandeau a été inspecté visuellement sur mobile et ordinateur ; les deux
  choix mesurent au moins 44 px. Le CTA du hero reste accessible au premier
  écran mobile. Sans JavaScript, aucune interface de consentement inerte n’est affichée.
- Motion utilise désormais `motion/react-mini` et Intersection Observer.
  Les animations fonctionnent en mode normal et restent absentes avec
  réduction des mouvements ou API d’animation indisponibles. Le contenu reste visible.

Rapports : `artifacts/traffic-seo-final/browser-audit.json`,
`artifacts/analytics-final/analytics-audit.json` et `motion-audit.json`.

### Performances du build final

| Mesure | Mobile, dernier contrôle | Ordinateur |
| ------ | -----------------------: | ----------: |
| Performance | **89** | **100** |
| Accessibilité | **100** | **100** |
| Bonnes pratiques | **100** | **100** |
| SEO | **100** | **100** |
| LCP | 2 883,9 ms | 627,0 ms |
| TBT | 289,5 ms | 25,4 ms |
| CLS | 0 | 0 |
| Benchmark CPU | 1 943,5 | 1 250 |

Rapports : `artifacts/traffic-seo-lighthouse-mobile-check.report.{json,html}`
et `artifacts/traffic-seo-lighthouse-desktop-final.report.{json,html}`.

**L’objectif de performance mobile ≥ 90 et le LCP ≤ 2,5 s ne sont pas confirmés.**
Un premier audit du même build final donnait 67 (TBT 2 871,6 ms, LCP 2 231,6 ms,
benchmark CPU 1 064) ; il reste conservé sous
`traffic-seo-lighthouse-mobile-final.report.{json,html}`. Les deux versions
intermédiaires mesurées avant Motion mini donnaient 86 puis 81, également
conservées. Cette variabilité interdit de présenter le meilleur score comme
une garantie de production. Aucun score n’a été obtenu en modifiant le profil
de ralentissement Lighthouse.

Le passage à Motion mini réduit le JavaScript transféré de 190 298 à 159 242
octets dans ces rapports, soit environ 31 Ko (16 %). Le CSS du bandeau rejoint
la feuille principale et supprime une requête CSS bloquante. Ces gains sont
observables, sans attribuer toute variation de score à une seule modification.
Les Core Web Vitals, l’INP terrain et la réception réelle des événements restent
à vérifier après déploiement.

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

## Lighthouse de la refonte avant GA4 : référence antérieure

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

L’application Flutter utilise l’adresse vérifiée `https://app.samajaay.com/`.
Conserver `NEXT_PUBLIC_APP_URL` sur ce sous-domaine et `NEXT_PUBLIC_SITE_URL`
sur `https://samajaay.com/` pour la landing, sa canonique et son sitemap.

Les coordonnées et liens officiels proviennent de `docs/sources.md`. Les skills
installés et leurs noms réels sont recensés dans `docs/skills-installation.md`.
