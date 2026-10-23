# Plan SEO de SamaJaay après la refonte

Ce document applique les recommandations pertinentes des skills SEO installés à la landing actuelle. Il décrit les actions techniques et éditoriales à poursuivre après la mise en ligne. **Aucune campagne de liens, soumission à un annuaire, prise de contact ou configuration Search Console n’a été exécutée dans le cadre de ce plan.** Aucun volume de trafic, score d’autorité ou nombre de backlinks n’est supposé.

## Fixer les deux destinations réelles

`NEXT_PUBLIC_SITE_URL` désigne l’URL canonique publique de la landing. `NEXT_PUBLIC_APP_URL` désigne l’application que les boutons doivent ouvrir. Ces rôles sont différents.

L’application Flutter officielle est actuellement accessible à `https://samajaay.com/`. Avant de remplacer cette racine par la landing, vérifier une autre destination réelle pour l’application et la renseigner dans `NEXT_PUBLIC_APP_URL`. Pour un hébergement distinct de la landing, conserver l’URL applicative vérifiée et définir `NEXT_PUBLIC_SITE_URL` sur l’adresse réelle de la landing. Reconstruire le projet après modification des variables.

Vérifier ensuite que les liens du header, du hero, des fonctionnalités, du groupage et du CTA final ouvrent l’application. Revalider aussi le lien de confidentialité si l’application change d’origine. Une canonique ou une URL de connexion ne doit pas être inventée pour remplir la configuration.

## Vérifier les signaux techniques à l’adresse publiée

La page dispose déjà de la Metadata API Next.js, de `fr-SN`, d’un H1 principal, de l’Open Graph et des Twitter Cards, ainsi que de `robots.txt`, `sitemap.xml` et du JSON-LD. Les contrôles à refaire après déploiement sont concrets :

- La page canonique répond en HTTP 200 et son contenu essentiel reste présent dans le HTML servi.
- La canonique, les liens Open Graph et l’URL du sitemap correspondent à l’adresse publiée, sans origine de prévisualisation accidentelle.
- `robots.txt` et les directives de l’hébergement permettent l’indexation de la version destinée au public.
- Le sitemap ne contient que des pages existantes et indexables ; une URL inconnue répond réellement en HTTP 404.
- L’image de partage est accessible avec son type d’image correct et un texte lisible.
- Les liens, images, titres et interactions fonctionnent sur mobile et au clavier ; les captures restent des preuves authentiques.
- `WebSite`, `SoftwareApplication` et `FAQPage` décrivent uniquement les informations présentes dans la page. Les FAQ visibles et leur JSON-LD proviennent de `src/lib/content.ts` pour éviter les divergences.

L’absence de tarifs ou d’avis vérifiés n’est pas un défaut à combler par des données fictives. Le JSON-LD ne doit contenir ni offre inventée ni note fabriquée. La présence d’un schéma FAQ ne garantit pas l’affichage d’un résultat enrichi sur Google.

Les commandes et audits du projet donnent une base de vérification ; les résultats de production dépendent aussi de l’hébergement, du cache, du réseau et des appareils. Vérifier les Core Web Vitals sur le trafic réel lorsque ces données deviennent disponibles, en distinguant les mesures de laboratoire du terrain.

## Connecter Search Console après la mise en ligne

Le propriétaire du domaine peut vérifier sa propriété dans Google Search Console avec la méthode adaptée à son accès, puis soumettre l’URL réelle du sitemap. La méthode et le jeton de vérification doivent provenir de cette propriété ; aucun identifiant n’est inclus arbitrairement dans le projet.

La canonique du domaine officiel est `https://samajaay.com/`, avec une redirection HTTP 308 depuis `www.samajaay.com` dans Next.js. Les balises de vérification Google et Bing sont activables avec leurs véritables jetons. Le [guide de mesure et de référencement](mesure-et-referencement.md) détaille GA4 après consentement, la propriété Search Console de domaine et les tableaux de bord utiles. L’identifiant GA4 `G-2E8X0XGQX2`, fourni par le propriétaire, est intégré ; les visites réelles restent à contrôler après déploiement. Le propriétaire a confirmé la validation DNS de Search Console le 23 octobre 2026. Le sitemap reste à soumettre après déploiement ; Bing reste facultatif et non configuré.

Utiliser ensuite l’inspection de l’URL canonique pour examiner l’accès de Google, l’indexabilité et la canonique choisie. Corriger les éventuelles erreurs d’exploration avant de produire d’autres pages. Les rapports de requêtes peuvent orienter la rédaction avec les mots réellement utilisés par les commerçants ; aucun classement ni délai d’indexation n’est promis.

## Expliquer précisément le groupage Alibaba

La section `#groupage` et la FAQ présentent l’organisation d’achats groupés pour des produits provenant d’Alibaba ou d’autres plateformes. Le vocabulaire doit rester cohérent avec les écrans fournis : produit, prix fournisseur, devise et taux saisi, quantité visée, date limite, transport, CBM si nécessaire, autres frais, marge, prix livré, participations et statuts.

La FAQ indique explicitement que **le suivi repose sur les informations saisies par l’utilisateur et ne constitue pas une connexion automatique aux plateformes**. Elle rappelle aussi que **SamaJaay ne reçoit et ne garde aucun argent** : les paiements sont renseignés comme reçus directement des participants. Ces faits ne doivent pas être remplacés par des promesses de synchronisation Alibaba, de paiement intégré ou de réservation de transport.

Lors d’une évolution du module, comparer les descriptions, les captures et la FAQ avec le produit effectivement livré avant de modifier les textes ou les données structurées.

## Préparer des guides utiles à partir du produit

Les sujets suivants peuvent donner lieu à des pages ou articles distincts lorsque leur contenu complet est prêt et relu. Ils ne sont pas des liens à créer vers des pages vides.

| Sujet proposé                                   | Question du commerçant                                         | Preuve et limites à utiliser                                                                                                                               |
| ----------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Suivre les ventes et le bénéfice en FCFA        | « Ce que j’encaisse correspond-il à ce que je gagne ? »        | Écrans d’accueil et d’indicateurs ; expliquer les notions visibles et préciser que les résultats dépendent des opérations renseignées.                     |
| Suivre les dettes et crédits clients            | « Qui me doit encore de l’argent ? »                           | Écran réel des dettes ; distinguer la somme due, les informations de paiement et le bénéfice.                                                              |
| Organiser un achat groupé à l’import            | « Quelles informations faut-il réunir pour un groupage ? »     | Parcours de création fourni : produit, fournisseur, quantité, frais et participants ; saisie manuelle explicitée.                                          |
| Comprendre les frais et le volume en CBM        | « Comment retrouver les coûts qui composent mon prix livré ? » | Écrans réels de transport, volume, tarif CBM et autres frais ; montants des captures identifiés comme exemples, pas comme tarifs actuels d’un transitaire. |
| Distinguer marge, prix livré et paiements reçus | « Comment lire les chiffres de mon groupage ? »                | Écrans de marge et de participation ; aucune promesse de gain ni assimilation des paiements reçus à un bénéfice.                                           |

Chaque guide doit apporter une réponse claire, employer des termes compréhensibles au Sénégal, utiliser des captures avec des alternatives pertinentes et proposer un lien vers l’application ainsi qu’un lien vers la landing. Ajouter son URL au sitemap uniquement lorsqu’il existe. Réutiliser les informations du produit sans publier de coordonnées personnelles ou d’identifiants clients inutiles.

## Développer des citations professionnelles vérifiées

Le skill `off-page-seo` concerne les recommandations et liens venant d’autres sites. Une piste adaptée consiste à identifier manuellement des structures réellement pertinentes : associations de commerçants, réseaux d’entrepreneurs, acteurs de l’accompagnement commercial, communautés professionnelles d’importation et partenaires logistiques au Sénégal.

Pour chaque piste, vérifier l’existence du site, son activité, le public concerné et le lien réel avec SamaJaay. Une mention doit expliquer un usage utile : une présentation du produit, un retour d’expérience autorisé ou un guide professionnel fondé sur des faits. Ne pas inventer de partenariat pour obtenir un logo ou un lien.

Un registre manuel peut retenir le nom de la structure vérifiée, sa page publique, la raison de sa pertinence, l’autorisation éventuelle de citer son nom et l’état d’une démarche réellement effectuée. Les colonnes « contacté » ou « lien obtenu » restent vides tant que l’action n’a pas eu lieu. Aucun DA, trafic estimé ou nombre de liens n’est attribué sans une source de mesure réelle.

Les prises de contact restent une action distincte à décider avec le propriétaire. Ce plan n’autorise ni envoi de messages, ni publication, ni inscription automatique. Il ne propose pas d’achat de backlinks, de réseau artificiel de sites ou d’échange massif de liens. Le résultat attendu est une information utile et vérifiable, sans promesse chiffrée de classement.

## Ce que représentent les 43 skills installés

Les **43 skills** sont des documents, références et outils d’assistance installés pour le travail de conception et de vérification : 12 dans le projet et 31 dans l’environnement global de l’agent. Ils ne constituent pas 43 bibliothèques JavaScript ajoutées au site et ne sont pas chargés par le navigateur.

Leurs exemples et recommandations sont évalués dans le contexte du projet. Les scripts de campagne, métriques fictives ou services de génération proposés dans certaines ressources ne sont pas exécutés automatiquement. Le détail des commandes, des noms réellement installés et des reprises figure dans [skills-installation.md](skills-installation.md).
