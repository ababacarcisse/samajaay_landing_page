# Installation des skills demandés — refonte SamaJaay

Vérification du **23 octobre 2026**. Les dix sources demandées ont été examinées. **37 skills correspondant aux six skills ciblés et quatre collections demandées sont installés**, auxquels s’ajoutent **6 compléments éditoriaux et SEO**. Total vérifié par `npx skills list --json` : **12 skills de projet et 31 skills globaux**.

Aucune dépendance de production n’a été ajoutée par cette installation. Les skills sont des ressources de travail pour l’agent ; leur contenu n’est pas envoyé aux visiteurs.

## Résultat des commandes demandées

Les commandes ont été exécutées avec `npx --yes skills add`, depuis `/workspace/samajaay`, séquentiellement. Pour les commandes ciblées, `--agent codex -y --json` a été ajouté afin d’éviter les choix interactifs. Les commandes contenant `--all -g -y` ont d’abord été tentées telles que demandées, avec sortie JSON.

| Source demandée | Résultat direct | Résolution installée |
| --- | --- | --- |
| `anionzo/skill --skill animated-landing-pages` | Code 1 : clone GitHub HTTP 503 | `animated-landing-pages`, depuis les mêmes fichiers officiels récupérés via API/raw GitHub |
| `Hans3010/Hanstec-Automate --skill landing-page-design-hans3010` | Code 1 : nom demandé absent | Nom réel `landing-page-design`, même dépôt |
| `vlados/lawdiff --skill copywriter-vlados` | Code 1 : nom demandé absent | Nom réel `copywriter`, source `.claude/skills/copyrighter/skill.md` ; nom de fichier normalisé en `SKILL.md`, contenu inchangé |
| `emilkowalski/skills --all -g -y` | Code 1 : la cible Eve ne prend pas en charge l’installation globale ; installation partielle des autres agents | Reprise pour Codex, **15 skills** installés |
| `vercel/next.js --all -g -y` | Même limite Eve | Reprise pour Codex, **8 skills publics** installés |
| `Leonxlnx/taste-skill --all -g -y` | Même limite Eve | Reprise pour Codex, **design-taste-frontend** installé |
| `nextlevelbuilder/ui-ux-pro-max-skill --all -g -y` | Même limite Eve | Reprise pour Codex, **7 skills** installés |
| `huifer/claude-code-seo --skill off-page-seo` | Code 0 | `off-page-seo` installé directement |
| `TheGoat395/Codex-Skills --skill design-motion-principles-thegoat395` | Code 1 : nom demandé absent | Nom réel `design-motion-principles`, même dépôt |
| `manutej/luxor-claude-marketplace --skill mobile-design` | Code 0 | `mobile-design` installé directement |

`--all` désigne tous les agents du CLI, dont Eve : son absence de support global explique les codes de sortie 1 de ces quatre commandes, et non l’absence des skills. Les reprises ont utilisé `--skill '*' --agent codex -g -y` pour installer tous les skills publics utiles au même agent de travail, sans réessayer une cible incompatible.

Le dépôt Next.js comprend également 19 skills déclarés `metadata.internal: true`, destinés à la maintenance du framework (backports, releases, vendoring, etc.). Le CLI les exclut de la collection publique ; ils n’ont pas été renommés ni présentés comme des guides de landing page.

## Provenance et méthode de reprise

Les arbres officiels GitHub ont été consultés via `api.github.com/repos/.../git/trees/{branch}?recursive=1`. Les fichiers ont été téléchargés depuis `raw.githubusercontent.com` en conservant leurs références internes. Pour les 426 fichiers initiaux récupérés, le hash Git du blob a été recalculé et comparé à celui de l’arbre : **0 erreur de téléchargement ou d’intégrité**. La ressource copywriter en minuscules a ensuite été ajoutée séparément.

Le CLI a installé des **copies**, et non des liens vers un dossier temporaire. Les skills restent donc disponibles dans leurs répertoires installés. Le cache `/tmp/samajaay-skills-install/sources` ne fait pas partie du site ; il a seulement fourni la source de reprise. Les verrous CLI peuvent indiquer ce chemin local : pour réinstaller ultérieurement, reprendre les URL GitHub officielles et les noms réels ci-dessus, ou fournir ces copies au CLI.

Les détails machine, chemins, commandes, hashes d’arbre et inventaires sont conservés dans `docs/skills-installation.json`.

## Recherche complémentaire pour le SEO

`npx --yes skills find 'nextjs seo'`, puis `npx --yes skills find seo` ont tous deux renvoyé **« No skills found »**. Il ne s’agit pas d’un résultat positif inventé. La recherche directe dans les arbres des dépôts déjà demandés a permis d’installer :

- `seo-auditor`, `metadata-optimizer`, `structured-data` et `local-seo`, depuis `huifer/claude-code-seo` ;
- `seo-technical-qa`, depuis `TheGoat395/Codex-Skills` ;
- `brand-voice-to-ui-copy`, depuis le même dépôt, en complément du copywriter de Vlados.

Le SEO off-page concerne des liens et mentions de sites tiers, pas seulement le code de la landing. Son installation ne constitue ni une campagne réalisée ni une autorisation d’envoyer des messages ou de publier des backlinks. Aucun contact externe, envoi, soumission à un annuaire ou achat de liens n’a été effectué.

## Recommandations retenues pour cette refonte

Les recommandations suivantes viennent de la lecture des skills applicables et de recherches locales UI/UX Pro Max :

- **Lisibilité** : texte courant autour de 16–20 px, interligne 1,5–1,6, vraie couleur d’encre sur fond clair ; éviter les textes gris très pâles, les petits labels en capitales et les descriptions à 10–12 px.
- **Mobile** : cibles tactiles d’au moins 44 × 44 px, idéalement 48 px, espacement de 8 px ou plus ; conserver le zoom, le focus et une navigation compréhensible sans survol.
- **Direction artistique** : un parti pris commun et une hiérarchie forte ; varier les compositions des sections, montrer une image produit dominante et garder les vrais écrans comme preuve.
- **Motion** : chaque mouvement explique une entrée, un changement d’état ou une progression. Réponses rapides aux actions, courbes cohérentes, déplacements modestes pour la lecture ; respecter `prefers-reduced-motion`. Le brief de refonte autorise les changements : aucune pause artificielle de validation n’est ajoutée.
- **Performance** : privilégier transform/opacité, éviter les propriétés qui déplacent toute la mise en page, charger les interactions coûteuses seulement quand elles deviennent utiles et vérifier dans le navigateur.
- **Copywriting** : partir des problèmes concrets du commerçant et montrer la preuve produit, avec un objectif de conversion unique. Les exemples de statistiques, d’urgence, de tarifs ou de garanties fournis par les skills ne sont pas des faits sur SamaJaay.
- **SEO technique** : vérifier le HTML servi, la canonique réelle, l’indexabilité, les routes robots/sitemap, la langue, les images de partage et les faits visibles du JSON-LD. Le LCP et la charge initiale sont des mesures à contrôler.

UI/UX Pro Max a été interrogé avec `commerce management fintech Senegal`, puis une seule reformulation `small business retail SaaS` : la première proposition associait un style Brutalism à une palette orange/violette incompatible avec la marque ; elle a été rejetée. La seconde identifiait un style Motion-Driven pertinent pour une présentation SaaS, mais sa palette indigo ne remplace pas l’identité verte officielle. Les recommandations de contraste, de taille de texte et de cibles tactiles ont en revanche donné des correspondances explicites et pertinentes. Le vert SamaJaay et les ressources authentiques du produit restent prioritaires.

## Instructions tierces non appliquées automatiquement

- `animated-landing-pages` prescrit un onboarding anionzo : aucune interruption du travail déjà autorisé n’en découle ; seuls ses principes utiles sont retenus.
- `landing-page-design` propose un `curl | sh`, une connexion `inference.sh` et des visuels générés. Ces opérations ne sont pas nécessaires pour ce projet à captures réelles ; elles n’ont pas été exécutées.
- Plusieurs skills contiennent des exemples de métriques commerciales, de faux profils de backlinks ou des objectifs ROI. Aucun de ces nombres n’est présenté comme une mesure SamaJaay.
- Les skills globaux natifs iOS/Swift, de maintenance Next.js ou de slides sont installés parce que les collections complètes étaient demandées. Ils ne sont pas présentés comme employés pour des fonctionnalités web sans rapport.

## Inventaire installé

### Projet

- `animated-landing-pages` — `/workspace/samajaay/.agents/skills/animated-landing-pages/SKILL.md`
- `brand-voice-to-ui-copy` — `/workspace/samajaay/.agents/skills/brand-voice-to-ui-copy/SKILL.md`
- `copywriter` — `/workspace/samajaay/.agents/skills/copywriter/SKILL.md`
- `design-motion-principles` — `/workspace/samajaay/.agents/skills/design-motion-principles/SKILL.md`
- `landing-page-design` — `/workspace/samajaay/.agents/skills/landing-page-design/SKILL.md`
- `local-seo` — `/workspace/samajaay/.agents/skills/local-seo/SKILL.md`
- `metadata-optimizer` — `/workspace/samajaay/.agents/skills/metadata-optimizer/SKILL.md`
- `mobile-design` — `/workspace/samajaay/.agents/skills/mobile-design/SKILL.md`
- `off-page-seo` — `/workspace/samajaay/.agents/skills/off-page-seo/SKILL.md`
- `seo-auditor` — `/workspace/samajaay/.agents/skills/seo-auditor/SKILL.md`
- `seo-technical-qa` — `/workspace/samajaay/.agents/skills/seo-technical-qa/SKILL.md`
- `structured-data` — `/workspace/samajaay/.agents/skills/structured-data/SKILL.md`

### Global

- `animate` — `/home/agent/.agents/skills/animate/SKILL.md`
- `animate-expo` — `/home/agent/.agents/skills/animate-expo/SKILL.md`
- `animation-performance` — `/home/agent/.agents/skills/animation-performance/SKILL.md`
- `animation-vocabulary` — `/home/agent/.agents/skills/animation-vocabulary/SKILL.md`
- `apple-design` — `/home/agent/.agents/skills/apple-design/SKILL.md`
- `ask-sonner` — `/home/agent/.agents/skills/ask-sonner/SKILL.md`
- `banner-design` — `/home/agent/.agents/skills/banner-design/SKILL.md`
- `brand` — `/home/agent/.agents/skills/brand/SKILL.md`
- `break-ui` — `/home/agent/.agents/skills/break-ui/SKILL.md`
- `design` — `/home/agent/.agents/skills/design/SKILL.md`
- `design-system` — `/home/agent/.agents/skills/design-system/SKILL.md`
- `design-taste-frontend` — `/home/agent/.agents/skills/design-taste-frontend/SKILL.md`
- `docs-diagrams` — `/home/agent/.agents/skills/docs-diagrams/SKILL.md`
- `emil-design-eng` — `/home/agent/.agents/skills/emil-design-eng/SKILL.md`
- `find-animation-opportunities` — `/home/agent/.agents/skills/find-animation-opportunities/SKILL.md`
- `gh-stack` — `/home/agent/.agents/skills/gh-stack/SKILL.md`
- `improve-animations` — `/home/agent/.agents/skills/improve-animations/SKILL.md`
- `mobile-native` — `/home/agent/.agents/skills/mobile-native/SKILL.md`
- `next-bundle-optimizer` — `/home/agent/.agents/skills/next-bundle-optimizer/SKILL.md`
- `next-cache-components-adoption` — `/home/agent/.agents/skills/next-cache-components-adoption/SKILL.md`
- `next-cache-components-optimizer` — `/home/agent/.agents/skills/next-cache-components-optimizer/SKILL.md`
- `next-dev-loop` — `/home/agent/.agents/skills/next-dev-loop/SKILL.md`
- `next-partial-prefetching-adoption` — `/home/agent/.agents/skills/next-partial-prefetching-adoption/SKILL.md`
- `next-partial-prefetching-optimizer` — `/home/agent/.agents/skills/next-partial-prefetching-optimizer/SKILL.md`
- `pick-ui-library` — `/home/agent/.agents/skills/pick-ui-library/SKILL.md`
- `prototype` — `/home/agent/.agents/skills/prototype/SKILL.md`
- `review-animations` — `/home/agent/.agents/skills/review-animations/SKILL.md`
- `slides` — `/home/agent/.agents/skills/slides/SKILL.md`
- `ui-styling` — `/home/agent/.agents/skills/ui-styling/SKILL.md`
- `ui-ux-pro-max` — `/home/agent/.agents/skills/ui-ux-pro-max/SKILL.md`
- `write-swift` — `/home/agent/.agents/skills/write-swift/SKILL.md`
