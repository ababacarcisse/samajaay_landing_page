# Architecture et décisions

## Périmètre

Cette implémentation indépendante présente SamaJaay et guide vers l’application existante. Elle ne remplace ni le logiciel de gestion ni son authentification. Aucun dépôt SamaJaay n’était présent dans `/workspace` au départ ; une intégration dans un dépôt existant reste à effectuer avec ses conventions et routes réelles.

Les six domaines de gestion présentés sont les ventes, les stocks, les achats locaux et à l’import, les dépenses, les crédits/dettes et les bénéfices. La refonte ajoute une section consacrée au groupage, expressément demandée par l’utilisateur et fondée sur les seize nouveaux écrans visibles dans la conversation. Les captures originales, la monnaie FCFA et le positionnement au Sénégal servent de preuves produit.

Le groupage présente une organisation et un suivi manuels : produit, prix fournisseur, devise et taux renseigné, quantités, date limite, transport, volume en CBM si nécessaire, frais, marge, prix livré, participants et statuts. Évoquer Alibaba ou d’autres plateformes ne signifie pas une intégration à leurs API. L’utilisateur saisit les informations et les paiements reçus directement ; SamaJaay ne reçoit et ne garde aucun argent.

## Structure

| Fichier                                           | Responsabilité                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/app/layout.tsx`                              | Police Manrope via `next/font`, langue `fr-SN`, métadonnées et viewport                                            |
| `src/components/structured-data.tsx`              | JSON-LD rendu uniquement sur la page d’accueil                                                                     |
| `src/app/page.tsx`                                | Composition de la landing et lien d’évitement vers le contenu                                                      |
| `src/app/globals.css`                             | Fondations visuelles, styles du hero et de la démonstration, responsive, focus et réduction du mouvement           |
| `src/app/opengraph-image.tsx`                     | Image de partage générée avec les outils Next.js                                                                   |
| `src/app/sitemap.ts`, `src/app/robots.ts`         | Routes de métadonnées pour les moteurs                                                                             |
| `src/app/not-found.tsx`                           | Page d’erreur de navigation                                                                                        |
| `src/lib/content.ts`                              | Données typées des fonctionnalités, captures, étapes de gestion/groupage, huit FAQ et description produit partagée |
| `src/lib/imported-screens.json`                   | Manifeste initialement vide, limité aux fichiers complémentaires réellement importés                               |
| `scripts/import-screens.mjs`                      | Import Node.js des JPEG WhatsApp d’origine, sans dépendance ni retouche                                            |
| `src/lib/config.ts`                               | URL publiques validées et ancres de navigation                                                                     |
| `src/components/header.tsx`                       | Navigation principale, bouton applicatif et menu mobile                                                            |
| `src/components/hero.tsx`                         | Promesse principale et composition du smartphone                                                                   |
| `src/components/product-demo.tsx`                 | Sélection accessible, alimentée par props avec les cinq captures initiales et les imports disponibles              |
| `src/components/groupage.tsx`, `groupage.css`     | Présentation des achats groupés, de leurs étapes et de leurs limites réelles                                       |
| `src/components/sections.tsx`                     | Problème, fonctionnalités, étapes, Sénégal, FAQ, CTA final et footer                                               |
| `src/components/sections.css`                     | Mise en page et styles des sections narratives                                                                     |
| `src/components/ui.tsx`                           | Logo, CTA partagé, libellé de section et mockup réutilisable                                                       |
| `src/components/reveal.tsx`, `motion-features.ts` | Révélations ponctuelles et chargement différé des fonctionnalités Motion                                           |
| `src/components/analytics.tsx`                    | Adaptateur de mesure facultatif respectant le consentement                                                         |
| `public/brand/`, `public/screens/`                | Logo officiel et captures JPEG réelles                                                                             |

TypeScript est configuré en mode strict. Les sections de contenu restent des Server Components ; le JavaScript client est réservé au menu, aux captures interactives, aux animations et au pont analytics. Les données produit sont séparées de leur présentation. Tailwind CSS v4 est intégré via PostCSS avec une détection des classes bornée au dossier source : les références des skills installés ne doivent pas augmenter le CSS livré. Les règles CSS dédiées centralisent les couleurs, les courbes d’animation, la typographie et les espacements de base. Lucide fournit les icônes. GSAP n’est pas nécessaire à ces interactions.

## Direction visuelle et mouvement

La refonte adopte une composition éditoriale `printed-annual` dans les couleurs SamaJaay. Le hero associe un fond vert profond, un texte blanc lisible et un véritable écran de l’application. Les cartes flottantes et le graphique décoratif de la première version ont été retirés. Les sections alternent compositions éditoriales, démonstration produit, fonctionnalités, présentation du groupage et bloc FCFA.

L’échelle de texte courant est de 16–18 px, les notes restent autour de 13–14 px et les liens de navigation bénéficient d’une taille de lecture confortable. Le bouton de menu réserve une cible de 48 × 48 px. Les surfaces et textes utilisent une encre contrastée plutôt que les petits gris pâles de la première version.

Le téléphone est construit en CSS autour des captures d’origine. Les fichiers restent inchangés ; un conteneur masque uniquement les barres Android. Les nouvelles captures WhatsApp ne sont pas recréées à partir de leur aperçu dans la conversation.

`Reveal` charge `domAnimation` à la demande avec `LazyMotion` et `MotionDiv` importé depuis `motion/react-m`. L’entrée ponctuelle utilise une chaîne `transform` et une variation d’opacité, sur 0,5 seconde avec une courbe ease-out. `initial={false}` conserve le contenu visible dans le HTML initial, y compris sans JavaScript. Les transitions CSS de capture durent 250 ms et sont désactivées pendant la navigation des onglets avec les flèches, Home et End. `useReducedMotion` et les media queries CSS prennent en compte la préférence du système, y compris pour le défilement doux. Les boutons disposent de retours sobres au survol et à l’appui. Aucun compteur fictif, carrousel automatique ou parallax permanent n’est nécessaire.

## Captures et import

`page.tsx` fusionne les cinq captures initiales définies dans `content.ts` avec `src/lib/imported-screens.json`, puis transmet cette liste à `ProductDemo`. Le manifeste vaut initialement `[]` : les noms de fichiers Windows fournis par l’utilisateur ne donnent pas accès à leurs octets depuis Linux.

`scripts/import-screens.mjs --from <dossier>` reconnaît les seize noms WhatsApp d’origine, copie les JPEG valides dans `public/screens/imported/` sans les retoucher et ajoute jusqu’à dix écrans sélectionnés au manifeste. Les fichiers absents ne deviennent pas des références d’images cassées ; les captures déjà importées sont conservées sans écrasement. La procédure Windows et les cas d’import partiel sont décrits dans [import-captures.md](import-captures.md). Un nouveau build prend en compte les fichiers effectivement importés.

## Accessibilité

- Un lien d’évitement conduit au contenu principal ; la page emploie `header`, `nav`, `main`, `section` et `footer`.
- Le titre principal est unique. Les titres de sections et de fonctionnalités suivent la hiérarchie H2/H3.
- Les boutons de menu exposent leur état ; Échap ferme le menu et ramène le focus sur son déclencheur.
- La découverte utilise `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` et `aria-labelledby`. Les flèches, Home et End permettent de changer de capture ; seul l’onglet actif appartient à l’ordre de tabulation.
- La légende annonce la capture active dans une région `aria-live="polite"`. Les boutons précédent/suivant ont un nom explicite.
- La FAQ repose sur `details/summary`, utilisables au clavier sans JavaScript. Toutes les réponses restent dans le HTML.
- Les images ont un texte alternatif ; les icônes décoratives sont masquées aux lecteurs d’écran. La solution de repli `noscript` donne un lien vers chaque capture réellement référencée, y compris les imports disponibles.

Ces choix facilitent l’accessibilité ; la conformité WCAG ne se déduit pas du code seul. Les audits et les vérifications manuelles doivent notamment confirmer contraste, focus, navigation et absence de débordement aux largeurs demandées.

## Référencement et partage

Les métadonnées Next.js définissent un titre, une description, la canonique, Open Graph et Twitter Cards. La langue du document est `fr-SN` et la locale Open Graph `fr_SN`. L’image de partage est générée localement. Le sitemap référence la landing et `robots.txt` indique ce sitemap.

Les noms des routes `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/icon.png` et `/apple-icon.png` sont conservés. La page d’erreur de navigation reste une 404, sans le JSON-LD réservé au contenu de l’accueil.

Le JSON-LD contient `WebSite`, `SoftwareApplication` et `FAQPage`, rendus uniquement sur la page d’accueil. Les huit réponses de FAQ, dont les questions sur Alibaba et les paiements de groupage, proviennent de la même source que le contenu visible. La constante `productDescription` de `content.ts` alimente la description des métadonnées et des schémas. Aucune note, offre tarifaire ou statistique d’adoption n’est ajoutée. Cette description structurée ne garantit pas l’affichage d’un résultat enrichi : Google limite notamment la visibilité des résultats FAQ à certaines catégories de sites.

`NEXT_PUBLIC_SITE_URL` doit refléter l’URL canonique publique réelle de cette landing. L’adresse `NEXT_PUBLIC_APP_URL` est une destination distincte sur le plan fonctionnel, même si les valeurs initiales correspondent au même domaine. La vérification des sources de production et l’avertissement sur la bascule de domaine sont documentés dans [sources.md](sources.md).

## Performance et mesure

`next/image` réserve les dimensions et adapte les ressources avec `sizes`. L’image principale du hero utilise un chargement immédiat et une priorité élevée ; les captures suivantes utilisent le chargement différé. Les formats AVIF/WebP restent activés dans `next.config.ts`. Manrope est auto-hébergée par `next/font` après compilation et utilise `display: "optional"` : sur réseau lent, la police de secours évite un remplacement tardif du texte. Les animations privilégient transform et opacité ; aucun moteur GSAP ni SDK analytics tiers n’est chargé.

L’application cible LCP ≤ 2,5 s, INP ≤ 200 ms et CLS ≤ 0,1 ainsi que les objectifs Lighthouse du brief. Ce sont des objectifs à vérifier : les rapports réels et captures de contrôle appartiennent à `artifacts/`, et `scripts/audit.py` complète les contrôles automatiques. Ne pas transformer une mesure locale en garantie de performances terrain ; les Core Web Vitals se mesurent au 75e percentile du trafic, en distinguant mobile et ordinateur.

## Analytics optionnel

Les liens de conversion portent un attribut `data-cta-location`. `AnalyticsBridge` délègue les clics à un unique écouteur et recherche un adaptateur hôte `window.samajaayAnalytics`. L’adaptateur doit exposer `hasConsent(): boolean` et `track("cta_click", { placement, destination })`. Sans adaptateur ou sans consentement, aucun événement n’est envoyé. Les erreurs de mesure sont absorbées pour préserver la navigation. Aucun stockage, cookie, identifiant ou suivi tiers n’est activé par ce projet.

## Hébergement et intégration

Un serveur Next.js sur Vercel ou Node.js conserve le comportement attendu et l’optimisation d’images. Un export statique impose une stratégie d’images différente ; ne pas ajouter `output: "export"` sans adapter cette partie. La landing peut être intégrée à un dépôt existant après inspection de ses routes, composants, dépendances et règles ; cette étape n’a pas été simulée.

L’application Flutter actuelle réside sur `https://samajaay.com/`. Avant d’y publier la landing, préparer et vérifier sa nouvelle destination, mettre à jour `NEXT_PUBLIC_APP_URL`, revalider les liens annexes et reconstruire. Sans cette préparation, les boutons pourraient pointer sur la landing elle-même.

## Skills et références consultés

Les skills **Sites** et **Cloud Environment Runtime** ont fourni les recommandations initiales de conception, de workflow local et d’accès réseau. Pour cette refonte, les collections explicitement demandées ont été installées avec les noms réellement présents dans leurs dépôts : **43 skills de travail**, dont 12 dans le projet et 31 globaux. Le détail des commandes directes, adaptations de noms et reprises est conservé dans [skills-installation.md](skills-installation.md).

La conception applique les ressources pertinentes `animate`, `animation-performance`, `design-motion-principles`, `ui-ux-pro-max`, `design-taste-frontend`, `copywriter` et les compléments SEO. Les ressources de maintenance du framework, de Swift ou de slides sans rapport ne sont pas présentées comme utilisées dans le site. Ces 43 ressources ne constituent pas 43 dépendances runtime : les visiteurs ne chargent ni les SKILL.md ni leurs outils de travail.

Les décisions visuelles sont décrites dans [refonte-design.md](refonte-design.md), et le plan manuel de SEO technique/éditorial/off-page dans [seo-plan.md](seo-plan.md). Aucune campagne de backlinks ni prise de contact externe n’en découle automatiquement. Les sources officielles suivantes ont également été consultées durant la réalisation.

- [Next.js : métadonnées et images Open Graph](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js : composant Image](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js : polices](https://nextjs.org/docs/app/getting-started/fonts)
- [Next.js : export statique](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js : sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js : robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [W3C WAI : accordéons](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [W3C WAI : onglets](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [Google web.dev : Core Web Vitals](https://web.dev/articles/vitals)
- [Source officielle Motion : LazyMotion](https://github.com/motiondivision/motion/blob/main/packages/framer-motion/src/components/LazyMotion/index.tsx)
- [Source officielle Motion : useReducedMotion](https://github.com/motiondivision/motion/blob/main/packages/framer-motion/src/utils/reduced-motion/use-reduced-motion.ts)
- [Source officielle Tailwind : module PostCSS](https://github.com/tailwindlabs/tailwindcss/blob/main/packages/%40tailwindcss-postcss/README.md)

Les sites de documentation `motion.dev` et `tailwindcss.com` renvoyaient une réponse HTTP 403 dans cet environnement. Leurs sources officielles GitHub ont donc été consultées à la place. Les versions publiées ont été vérifiées dans le registre npm ; cette vérification n’implique aucune mise à niveau future automatique.
