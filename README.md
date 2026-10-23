# SamaJaay — Landing page

Refonte de la landing page en français pour l’application de gestion commerciale SamaJaay : Next.js App Router, React, TypeScript strict, Tailwind CSS et Motion for React. La version revue privilégie les textes lisibles, le contraste, les captures authentiques et une présentation du groupage fondée sur les écrans fournis par l’utilisateur.

Le dossier `/workspace` ne contenait aucun dépôt applicatif lors de la préparation. Ce projet indépendant se trouve dans `/workspace/samajaay` ; son intégration à un dépôt existant n’a donc pas été effectuée. L’application Flutter de production n’a pas été modifiée.

## Lancer le projet

Prérequis : Node.js 20.9 ou supérieur et npm.

```bash
cd /workspace/samajaay
npm ci
cp .env.example .env.local
npm run dev
```

La page est disponible à `http://localhost:3000`. Pour exécuter la version de production :

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Le serveur de développement et le serveur de production écoutent sur `0.0.0.0`. Utiliser le contrôle d’accès de l’hébergement si leur accès doit être limité.

## Configurer les destinations avant déploiement

| Variable               | Utilisation                                                            | Valeur initiale vérifiée |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------ |
| `NEXT_PUBLIC_APP_URL`  | Destination commune des boutons d’accès à l’application                | `https://app.samajaay.com/`  |
| `NEXT_PUBLIC_SITE_URL` | URL publique de la landing : canonique, Open Graph, sitemap et JSON-LD | `https://samajaay.com/`  |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Identifiant public du flux web Google Analytics 4 | `G-2E8X0XGQX2`, fourni par le propriétaire |
| `GOOGLE_SITE_VERIFICATION` | Jeton HTML d’une propriété Search Console de type préfixe d’URL | Vide, facultatif si DNS |
| `BING_SITE_VERIFICATION` | Jeton HTML Bing Webmaster Tools | Vide, facultatif |

Ces variables publiques sont lues lors du build. Effectuer un nouveau build après modification. Elles n’accueillent aucun secret. Les valeurs HTTP(S) sont validées dans `src/lib/config.ts`.

L’adresse canonique choisie pour le domaine officiel est `https://samajaay.com/`. Une requête reçue par Next.js pour `www.samajaay.com` est redirigée en HTTP 308 vers le même chemin sur `samajaay.com`, en conservant les paramètres. L’hébergement doit desservir les deux noms avec un certificat HTTPS valide ; le code ne modifie ni le DNS ni l’hébergement actuel.

**L’application officielle est accessible à `https://app.samajaay.com/`**, destination ajoutée par le propriétaire sur GitHub puis vérifiée en HTTP 200 avec son bootstrap Flutter. La landing conserve `https://samajaay.com/` comme canonique. Tous les CTA utilisent la constante `APP_URL`. Une ancienne valeur `NEXT_PUBLIC_APP_URL=https://samajaay.com/`, ou une destination identique à la landing, est remplacée par l’adresse applicative vérifiée pour éviter une boucle. Mettre aussi les variables d’hébergement à jour pour refléter ces destinations.

Le lien de confidentialité pointe vers `https://app.samajaay.com/#/privacy` ; le bundle Flutter public du sous-domaine contient la route et le contenu de confidentialité. Les coordonnées et la provenance des assets figurent dans [docs/sources.md](docs/sources.md).

## Contenu et composants

La page comprend un hero vert profond à texte blanc avec un véritable écran de l’application, le problème des chiffres dispersés, une découverte interactive du produit, les six domaines de gestion, une section groupage, les trois étapes de prise en main, la section Sénégal/FCFA, huit questions fréquentes, le CTA final et le pied de page. Les paragraphes courants emploient une échelle de 16–18 px, avec des notes autour de 13–14 px et des cibles de menu de 48 px.

- `src/app/page.tsx` compose les sections avec un contenu rendu côté serveur.
- `src/lib/content.ts` centralise les fonctionnalités, les étapes du groupage, les captures, les étapes de prise en main et les huit réponses de FAQ. Sa constante `productDescription` est partagée par les métadonnées et le JSON-LD.
- `src/lib/imported-screens.json` contient les références aux captures complémentaires effectivement importées ; sa valeur initiale est `[]`.
- `src/lib/config.ts` centralise les URL et la navigation.
- `src/components/ui.tsx` fournit `BrandLogo`, `AppLink`, `SectionLabel` et `PhoneMockup`.
- `GroupageSection` présente le suivi manuel des achats groupés.
- `Header`, `ProductDemo`, `Reveal` et `AnalyticsBridge` contiennent les interactions nécessaires. `ProductDemo` reçoit par props les cinq captures initiales fusionnées avec le manifeste d’import.
- `src/app/globals.css`, `src/components/sections.css` et `src/components/groupage.css` portent les styles et règles responsive.

Le smartphone est une composition CSS autour des fichiers JPEG originaux. Le recadrage CSS retire les barres système Android sans réécrire l’interface ni ses chiffres. Les montants visibles illustrent un exemple d’activité. Aucun tarif, faux avis ou nombre d’utilisateurs n’est inventé.

La section groupage explique les produits, quantités, prix fournisseur, frais, marge, participations et statuts montrés dans les nouvelles captures. Alibaba et les autres plateformes sont des sources d’achat évoquées : aucune connexion automatique à leur API n’est revendiquée. Les informations et les paiements reçus sont renseignés par l’utilisateur ; SamaJaay ne reçoit et ne garde aucun argent.

Les animations sont ponctuelles : `Reveal` emploie une transformation et une variation d’opacité avec une courbe ease-out, et les transitions de capture durent 250 ms. La navigation des onglets au clavier désactive ces transitions ; la préférence de réduction des mouvements est respectée.

## Ajouter les nouvelles captures réelles

Les seize images WhatsApp sont visibles dans la conversation, mais leurs fichiers `C:\...` ne sont pas accessibles depuis l’environnement Linux. Le manifeste reste vide tant qu’un import de fichiers réels n’a pas eu lieu ; aucune capture n’a été recréée.

Sur l’ordinateur qui possède les images, depuis le dossier du projet :

```powershell
node scripts/import-screens.mjs --from "C:\Users\HP\Documents\moi\apps\saas\samajaay\public\screens"
npm run build
```

Adapter `--from` au dossier contenant les fichiers WhatsApp originaux. Le script copie les JPEG reconnus sans modifier leurs octets et sélectionne jusqu’à dix écrans complémentaires, ajoutés aux cinq captures initiales. Voir [docs/import-captures.md](docs/import-captures.md) pour les noms attendus, les imports partiels et les protections contre l’écrasement.

## Skills et direction artistique

Les collections demandées et les noms de skills réellement présents ont été installés et documentés : [43 skills de travail](docs/skills-installation.md), dont 12 dans le projet et 31 dans l’environnement global. Ils ne constituent pas 43 dépendances runtime et ne sont pas chargés par les visiteurs. Les ressources natives ou de maintenance sans rapport avec cette landing ne sont pas présentées comme utilisées dans son interface.

La refonte applique les recommandations pertinentes de motion, lisibilité, design et copywriting, avec une direction éditoriale `printed-annual` adaptée à l’identité verte. Voir [docs/refonte-design.md](docs/refonte-design.md) et le [plan SEO](docs/seo-plan.md).

Les détails de conception, d’accessibilité et de référencement sont documentés dans [docs/architecture.md](docs/architecture.md).

## Mesure du trafic, CTA et référencement

L’intégration utilise l’identifiant public fourni par le propriétaire, `G-2E8X0XGQX2`. `NEXT_PUBLIC_GA_MEASUREMENT_ID` permet de le remplacer au build ; une valeur explicitement vide désactive la mesure et son bandeau. Si la variable est absente, l’identifiant fourni reste utilisé. Le visiteur peut accepter ou refuser la mesure et rouvrir ce choix depuis le footer. Le script Google est chargé uniquement après acceptation ; les clics précédents ne sont pas conservés.

Après consentement, GA4 reçoit une vue de page et les événements `cta_click` avec les paramètres `placement` et `destination`. La révocation bloque les événements suivants et supprime au mieux les cookies GA accessibles sur le domaine courant. Aucun outil de mesure publicitaire n’est ajouté. Le guide [Mesure et référencement](docs/mesure-et-referencement.md) décrit les comptes à créer, les rapports utiles et les vérifications en production.

Le propriétaire a confirmé la validation DNS du domaine dans Search Console le 23 octobre 2026 (« You are a verified owner »). Aucune balise Google supplémentaire n’est nécessaire pour cette propriété de domaine. Après déploiement, soumettre `https://samajaay.com/sitemap.xml` dans cette propriété et vérifier son traitement. Le jeton facultatif `GOOGLE_SITE_VERIFICATION` reste disponible pour une éventuelle propriété préfixe d’URL ; `BING_SITE_VERIFICATION` ajoute aussi la balise Bing lorsqu’un jeton réel est fourni. Le projet n’a ni créé les propriétés ni soumis le sitemap dans leurs consoles.

Lorsque GA4 est explicitement désactivé, un adaptateur fourni par l’hébergement peut toujours implémenter cette interface :

```ts
window.samajaayAnalytics = {
  hasConsent: () => votreGestionnaireDeConsentement.autoriseLaMesure(),
  track: (name, data) => votreOutilDeMesure.envoyer(name, data),
};
```

Ce fragment décrit le contrat ; `votreGestionnaireDeConsentement` et `votreOutilDeMesure` doivent être remplacés par l’intégration réelle. `AnalyticsBridge` appelle l’adaptateur seulement si `hasConsent()` renvoie `true`. Une erreur de l’adaptateur n’interrompt pas la navigation.

## Vérifications et artefacts

```bash
npm run lint
npm run typecheck
npm run build
```

Le script `scripts/audit.py` complète les vérifications de la page servie et les rapports/captures de contrôle sont regroupés dans `artifacts/` lorsqu’ils sont produits. Consulter les résultats effectivement présents dans ce dossier et le compte rendu de livraison ; cette documentation n’attribue aucun score Lighthouse non mesuré.

Pour reproduire l’audit navigateur, garder `npm run start` actif dans un autre terminal. Les outils suivants sont réservés aux contrôles et ne sont pas des dépendances de production :

```bash
python -m venv /tmp/samajaay-python-qa
/tmp/samajaay-python-qa/bin/pip install playwright
/tmp/samajaay-python-qa/bin/python -m playwright install chromium
npm install --prefix /tmp/samajaay-qa axe-core lighthouse
/tmp/samajaay-python-qa/bin/python scripts/audit.py
```

Le script accepte `--chromium /chemin/vers/chromium` pour un navigateur système et `--axe /chemin/vers/axe.min.js`.

L’audit GA4 intercepte le tag et les requêtes Google, sans envoyer de visites de test. Avec le build actuel et sans jeton HTML de vérification :

```bash
python scripts/audit-analytics.py --chromium /usr/bin/chromium \
  --measurement-id G-2E8X0XGQX2 --google-token '' --bing-token ''
```

Les valeurs attendues peuvent être remplacées pour un build isolé ; voir l’en-tête du script. L’audit vérifie le code de consentement, pas la réception dans le service GA4 distant. Pour Lighthouse, exécuter les audits séparément afin d’éviter une concurrence CPU :

```bash
/tmp/samajaay-qa/node_modules/.bin/lighthouse http://localhost:3000 \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=artifacts/lighthouse-mobile
```

Ajouter `--preset=desktop` pour le bureau. Dans cet environnement Linux isolé, les commandes de mesure utilisent aussi `CHROME_PATH=/usr/bin/chromium` et `--chrome-flags='--no-sandbox --headless --disable-dev-shm-usage'`.

Les largeurs de référence sont 360, 390, 430, 768, 1024 et 1440 px. Vérifier aussi le clavier, le menu mobile, les onglets correspondant aux captures réellement présentes, la FAQ, le groupage, la réduction des animations, les liens externes et le rendu sans JavaScript. Les Core Web Vitals terrain nécessitent ensuite une mesure sur le trafic réel ; un audit local ne garantit pas les résultats en production.

Les résultats de livraison et leurs limites sont consignés dans [docs/validation.md](docs/validation.md).

## Déployer

**Coolify sur VPS Hostinger (hébergement confirmé par le propriétaire) :** le push sur `main` déclenche déjà le déploiement automatique. Conserver le build `npm run build`, le démarrage `npm run start` et le port interne 3000 dans la configuration du service. Définir les variables publiques pour le build, avec la landing sur `https://samajaay.com/` et l’application sur `https://app.samajaay.com/`. Les domaines racine et `www` doivent joindre ce même service pour que la redirection 308 soit appliquée. Le tag GA4 est intégré avec l’ID fourni et reste bloqué avant consentement. Consulter les logs de déploiement Coolify si une nouvelle version n’apparaît pas après un push.

**Vercel :** importer le dépôt contenant ce dossier, sélectionner Next.js, définir le répertoire racine si nécessaire, configurer les destinations et les éventuels identifiants de mesure/vérification, puis lancer `npm run build`. Vérifier la destination applicative avant d’affecter le domaine officiel.

**Serveur Node.js :** exécuter `npm ci`, `npm run build`, puis `npm run start` derrière un reverse proxy HTTPS et un superviseur de processus. Conserver `.next`, `public`, les dépendances de production et les fichiers de configuration nécessaires au serveur Next.js.

La configuration conserve l’optimisation d’images de Next.js en AVIF/WebP. Un export statique naïf avec `output: "export"` ne convient pas au chargeur d’images par défaut : prévoir alors explicitement un chargeur adapté ou une chaîne de préoptimisation, puis vérifier à nouveau les performances. Aucun déploiement sur le domaine de production ni remplacement de l’application existante n’est impliqué par ces instructions.
