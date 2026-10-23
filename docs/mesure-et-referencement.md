# Connecter la mesure de trafic et les outils SEO

Ce guide décrit Google Analytics 4, Google Search Console et, en option, Bing Webmaster Tools pour SamaJaay. **L’identifiant GA4 public `G-2E8X0XGQX2` a été fourni par le propriétaire et intégré.** Le propriétaire a confirmé le 23 octobre 2026 la validation DNS de sa propriété de domaine Search Console (« You are a verified owner », « Domain name provider — Successfully verified »). Aucun chiffre de trafic ni collecte en production n’est déclaré vérifié sans contrôle après déploiement. Aucun DNS n’a été modifié ici ; Bing reste facultatif et non configuré.

## Domaine et application : fixer les destinations avant publication

La landing utilise `https://samajaay.com/` comme origine canonique. `https://www.samajaay.com/` doit rediriger de façon permanente vers cette origine, en conservant le chemin et les paramètres. Les deux noms doivent être rattachés à l’hébergement et disposer d’un certificat HTTPS valide. La canonique, l’Open Graph, `robots.txt` et le sitemap doivent désigner la même origine finale. Google considère les redirections permanentes et la canonique comme des signaux de consolidation ; ces signaux ne garantissent pas à eux seuls l’indexation. [Documentation Google sur les URL canoniques](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=fr).

**L’application Flutter officielle est accessible à `https://app.samajaay.com/`.** Le propriétaire a ajouté cette destination sur GitHub et sa réponse HTTP 200 avec bootstrap Flutter a été vérifiée. `NEXT_PUBLIC_APP_URL` utilise ce sous-domaine, distinct de la landing. Le garde-fou de configuration remplace une ancienne valeur pointant vers la racine de la landing par cette destination applicative réelle.

Le fournisseur DNS et la configuration de l’hébergement ne sont pas connus. Aucun enregistrement DNS n’a été modifié. Le rattachement des domaines, le certificat et les éventuels enregistrements A, AAAA ou CNAME doivent suivre les valeurs exactes indiquées par l’hébergeur choisi.

## Variables à renseigner

Configurer les valeurs réelles dans les variables de production de l’hébergement. Pour travailler localement, les placer dans `.env.local`, qui ne doit pas être commis.

| Variable                        | Valeur attendue                                                                     | Usage                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://samajaay.com/`                                                             | Origine canonique de la landing et du sitemap.                                                      |
| `NEXT_PUBLIC_APP_URL`           | `https://app.samajaay.com/`, vérifiée en production                              | Destination commune de tous les CTA applicatifs.  |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-2E8X0XGQX2`, fourni par le propriétaire                                         | Remplace l’ID intégré si renseigné ; une valeur explicitement vide désactive GA4.       |
| `GOOGLE_SITE_VERIFICATION`      | Valeur exacte de l’attribut `content` de la balise fournie par Search Console       | Validation HTML d’une propriété avec préfixe d’URL. Inutile pour une validation de domaine par DNS. |
| `BING_SITE_VERIFICATION`        | Valeur exacte de l’attribut `content` de la balise `msvalidate.01` fournie par Bing | Validation HTML facultative de Bing Webmaster Tools.                                                |

Ces identifiants sont destinés à apparaître dans le navigateur ou le HTML public. Ce ne sont pas des clés API privées. Ne pas y placer de mot de passe, de jeton OAuth ou de clé de compte de service. Copier uniquement la valeur demandée, pas la balise HTML complète.

Après chaque modification, lancer un **nouveau build puis un déploiement** : les variables `NEXT_PUBLIC_*` sont intégrées au code navigateur au build, et les métadonnées peuvent être générées lors de ce même build.

## Google Analytics 4 : trafic et clics vers l’application

### Créer le flux de mesure

1. Ouvrir [Google Analytics](https://analytics.google.com/) avec le compte propriétaire de SamaJaay. Réutiliser une propriété adaptée si elle existe, pour éviter un suivi en double.
2. Dans **Administration → Créer → Propriété**, créer la propriété SamaJaay si nécessaire. Choisir le fuseau horaire et les paramètres correspondant à l’activité. Le rôle Éditeur ou supérieur est nécessaire.
3. Dans **Flux de données**, ajouter un flux **Web** pour `https://samajaay.com`, puis ouvrir les détails du flux.
4. Copier son **ID de mesure `G-…`** dans `NEXT_PUBLIC_GA_MEASUREMENT_ID`, puis reconstruire et déployer. L’extrait de balise proposé par Google ne doit pas être collé en plus de l’intégration du projet : cela pourrait doubler les événements.

Références : [configuration d’Analytics et des flux](https://support.google.com/analytics/answer/9304153?hl=fr), [localisation de l’ID de mesure](https://support.google.com/analytics/answer/9539598?hl=fr).

### Consentement et périmètre des données

La mesure est optionnelle : la balise Google n’est chargée qu’après accord explicite pour les statistiques. Un refus conserve l’accès normal à la page et à l’application. La préférence peut être rouverte depuis le pied de page. L’ID fourni est utilisé par défaut ; une variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` explicitement vide désactive la collecte et son bandeau. Retirer son accord bloque les événements suivants et tente de supprimer les cookies Analytics de première partie ; cela n’efface pas les données déjà transmises.

Ce choix suit le principe du **mode Consentement de base** : bloquer le chargement des balises avant accord. Les paramètres de consentement publicitaire `ad_storage`, `ad_user_data` et `ad_personalization` restent refusés ; l’acceptation concerne uniquement `analytics_storage`. Aucun suivi publicitaire n’est nécessaire pour mesurer les visites et clics. [Guide officiel du mode Consentement et de ses paramètres](https://developers.google.com/tag-platform/security/guides/consent?hl=fr).

Avant activation, vérifier que la politique de confidentialité réelle explique l’outil retenu, les finalités de mesure, le responsable et le moyen de modifier son choix. Le mécanisme technique ne constitue pas à lui seul une validation juridique de cette politique.

Les événements de la landing mesurent la consultation (`page_view`) et les clics vers l’application (`cta_click`, paramètres `placement` et `destination`). L’URL de la page transmise exclut les paramètres et le fragment. Ces événements ne prouvent ni une inscription réussie ni une vente dans l’application. Ne transmettre aucun nom de client, téléphone, dette, montant commercial ou autre donnée saisie dans SamaJaay à ces événements.

### Vérifier puis lire les résultats

Après déploiement avec un ID réel :

1. Ouvrir la landing dans un profil de navigateur neuf. Avant décision et après refus, vérifier dans l’onglet Réseau qu’aucune balise ni requête de collecte Google Analytics n’est envoyée.
2. Accepter les statistiques. Vérifier que la balise se charge une seule fois et que la visite apparaît dans **Rapports → Temps réel**. Un bloqueur de suivi peut empêcher ce test ; ne pas le confondre avec une panne du site.
3. Cliquer sur un CTA applicatif. Vérifier l’événement `cta_click` dans le rapport Temps réel ou DebugView. Le lien doit continuer à mener à l’URL de l’application même sans consentement ou si Google est bloqué ; l’accès à l’application dépend de sa propre connexion et de sa disponibilité.
4. Utiliser **Préférences de mesure** dans le pied de page pour refuser à nouveau les statistiques ; contrôler qu’aucun nouvel événement de mesure n’est transmis après ce changement.
5. Pour les analyses courantes, consulter **Rapports → Acquisition → Acquisition de trafic** pour les sources et canaux, les rapports de pages pour les consultations, et les dimensions de pays et de catégorie d’appareil pour comparer notamment le Sénégal, le mobile et l’ordinateur. Certains rapports peuvent devoir être ajoutés à la navigation par un Éditeur.
6. Dans **Administration → Événements / Événements clés**, marquer `cta_click` comme événement clé si le clic vers l’application représente l’objectif choisi. Un événement clé désigne ici un clic mesuré, pas un nouvel utilisateur confirmé de SamaJaay.

Pour comparer les emplacements de conversion dans les rapports et explorations, créer une dimension personnalisée de portée **Événement**, associée au paramètre **`placement`**, dans **Administration → Définitions personnalisées**. Le paramètre `destination` peut aussi recevoir une dimension de portée Événement si plusieurs destinations réelles sont utilisées. Ces définitions relèvent du compte GA4 et ne sont pas créées par le code du site.

Références : [rapport Temps réel](https://support.google.com/analytics/answer/9271392?hl=fr), [rapport Acquisition de trafic](https://support.google.com/analytics/answer/12923437?hl=fr), [événements clés](https://support.google.com/analytics/answer/9267568?hl=fr).

Les données portent sur les visites effectivement mesurées : les refus, bloqueurs et limites des navigateurs peuvent réduire le périmètre observé. Distinguer les chiffres GA4 des clics de recherche Search Console. L’intégration de mesure ne fait pas progresser automatiquement le classement Google.

## Google Search Console : indexation et visibilité Google

**État communiqué par le propriétaire : validation DNS déjà réussie.** Ne pas ajouter une deuxième balise HTML pour cette propriété de domaine. Les étapes de création ci-dessous servent de référence ; la prochaine action est de soumettre le sitemap depuis la propriété existante après le déploiement de la landing. L’accès à cette console n’a pas été utilisé dans cet environnement : aucune soumission ou inspection distante n’est déclarée effectuée.

### Méthode recommandée : propriété de domaine

1. Ouvrir [Google Search Console](https://search.google.com/search-console/) avec le compte propriétaire et choisir **Ajouter une propriété → Domaine**.
2. Saisir **`samajaay.com`**, sans protocole ni chemin. Cette propriété couvre les protocoles et sous-domaines, dont `www.samajaay.com`.
3. Copier l’enregistrement TXT fourni par Google dans la zone DNS du domaine auprès de son fournisseur réel. Respecter les champs nom/hôte indiqués par ce fournisseur et conserver les autres enregistrements existants.
4. Revenir dans Search Console et demander la validation une fois l’enregistrement visible. Conserver cet enregistrement : Google peut vérifier la propriété à nouveau.

La propriété de domaine se valide par DNS ; **`GOOGLE_SITE_VERIFICATION` ne remplace pas ce TXT**. Aucun accès au fournisseur DNS n’étant disponible ici, cette opération doit être réalisée dans le compte du propriétaire. [Types de propriétés et couverture](https://support.google.com/webmasters/answer/34592?hl=fr), [méthodes de validation](https://support.google.com/webmasters/answer/9008080?hl=fr).

### Alternative : propriété avec préfixe d’URL

Si l’accès DNS n’est pas disponible, créer une propriété **Préfixe d’URL** pour **`https://samajaay.com/`** et choisir **Balise HTML**. Copier uniquement son `content` dans `GOOGLE_SITE_VERIFICATION`, reconstruire puis déployer le site. Vérifier que le HTML public contient la balise `google-site-verification`, puis cliquer sur **Valider** dans Search Console. Conserver la variable ensuite.

Cette propriété ne couvre que le préfixe déclaré ; elle ne représente pas automatiquement `http://samajaay.com/` ou `https://www.samajaay.com/`. La redirection permanente de www vers la racine et la canonique restent utiles, mais ne changent pas la portée de cette propriété. [Guide de validation HTML et DNS](https://support.google.com/webmasters/answer/9008080?hl=fr).

### Soumettre et contrôler le site publié

1. Vérifier que `https://samajaay.com/sitemap.xml` et `https://samajaay.com/robots.txt` répondent correctement sur l’hébergement final.
2. Dans **Sitemaps**, soumettre **`https://samajaay.com/sitemap.xml`**. Le fichier doit contenir uniquement les URL réelles et indexables de la landing.
3. Inspecter `https://samajaay.com/`, lancer le test en direct et vérifier l’indexabilité ainsi que la canonique déclarée. Demander l’indexation si cela est pertinent.
4. Suivre **Indexation des pages**, les éventuelles erreurs d’exploration et **Performances dans les résultats de recherche** : impressions, clics, requêtes, pages, pays et appareils. Filtrer le pays Sénégal pour étudier ce marché lorsque des données existent.
5. Examiner les Core Web Vitals de terrain lorsque le rapport dispose de suffisamment de données. Conserver les audits Lighthouse comme mesures de laboratoire distinctes.

La validation d’une propriété, l’envoi d’un sitemap ou une demande d’indexation ne garantissent ni une date d’apparition ni une position dans les résultats.

## Bing Webmaster Tools : option complémentaire

1. Ouvrir [Bing Webmaster Tools](https://www.bing.com/webmasters/). Si la propriété Search Console est déjà validée, l’importer depuis l’interface Bing en examinant les autorisations demandées. Sinon, ajouter manuellement `https://samajaay.com/`.
2. Pour la méthode **Meta tag**, copier seulement le `content` de la balise `msvalidate.01` dans `BING_SITE_VERIFICATION`, reconstruire et déployer, puis lancer la validation dans Bing. Les autres méthodes proposées par Bing restent possibles si elles correspondent aux accès disponibles.
3. Dans **Sitemaps**, soumettre **`https://samajaay.com/sitemap.xml`** ou vérifier que l’import depuis Search Console l’a déjà ajouté. Consulter ensuite son état de traitement et les erreurs éventuelles.

Références : [ajout et validation d’un site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b), [gestion des sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed). Aucun compte ni import Bing n’a été créé ici.

## Vérification avant de considérer la connexion terminée

La connexion est terminée lorsque la version de production contient les bons identifiants publics, que les propriétés sont validées dans leurs consoles et que les tests de mesure avec accord/refus fonctionnent. Conserver une trace de la date de validation et du domaine contrôlé, sans publier de secrets.

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Recontrôler les CTA sur mobile et ordinateur, la redirection www, la canonique de la page, les balises de validation et le sitemap après le déploiement réel. Ces vérifications de production s’ajoutent aux contrôles locaux du projet ; un build réussi ne prouve pas la validation d’un compte externe.

## Sources consultées

Documentation officielle consultée le **23 octobre 2026**. Les pages citées ci-dessus ont répondu en HTTP 200 lors de cette préparation ; les intitulés des consoles peuvent évoluer. Les pages Bing ont également été consultées via leur contenu indexé officiel. Aucun service payant, compte de mesure, accès DNS ou outil de campagne n’a été activé dans le cadre de cette documentation.
