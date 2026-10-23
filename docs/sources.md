# Sources et provenance des assets

Vérification du 23 octobre 2026. Aucun témoignage, nombre d’utilisateurs ou tarif n’a été inventé.

## Production SamaJaay

- Application : https://samajaay.com/ — HTTP 200, application Flutter avec `base href="/"`, `flutter_bootstrap.js` et `main.dart.js`.
- Logo officiel : https://samajaay.com/assets/assets/branding/app_bar.png — PNG 720 × 174, référencé par `assets/AssetManifest.bin.json` ; copie locale `public/brand/logo.png`.
- Favicon officiel : https://samajaay.com/favicon.png — PNG 48 × 48 ; copie locale `src/app/icon.png`.
- Icône Apple officielle : https://samajaay.com/icons/apple-touch-icon.png — PNG 180 × 180 ; copie locale `src/app/apple-icon.png`.
- Contact : https://samajaay.com/#/contact. Le routeur du bundle public `main.dart.js` déclare `/contact` ; son composant de contact affiche `cissedev5@gmail.com`, le téléphone / WhatsApp `+221 77 932 77 62` et `www.cissesolutions.cloud`. URI : `mailto:cissedev5@gmail.com`, `tel:+221779327762`, https://wa.me/221779327762.
- Confidentialité : https://samajaay.com/#/privacy. Le routeur public déclare explicitement `A.ck(new A.bzM(),"/privacy",null)`. Le composant associé contient « Politique de confidentialité », « Cisse Solutions — SamaJaay, au Sénégal » et une mise à jour du 19 octobre 2026. Le mode hash est confirmé par `groupage-links.js`. Une réponse HTTP 200 seule sur une route arbitraire ne constitue pas une preuve : le serveur sert également le fallback Flutter.
- Aucune page distincte de mentions légales ni aucun réseau social officiel n’a été vérifié.

## Captures de l’application fournies par l’utilisateur

Les cinq captures JPEG jointes au brief sont les véritables écrans utilisés pour les mockups et la découverte interactive :

1. `1001604002.jpg` — menu d’ajout : nouvelle vente, nouvel achat, nouvelle dépense.
2. `1001604003.jpg` — nouvel achat : Local ou Import.
3. `1001604007.jpg` — accueil et encaissements des ventes, 10 000 FCFA.
4. `1001604008.jpg` — tableau des chiffres : investi, stock, bénéfice net, dépenses et dettes.
5. `1001604009.jpg` — suivi du stock et produits qui tournent vite.

Les montants appartiennent aux captures fournies. Ils illustrent un exemple d’utilisation et ne représentent ni des résultats garantis ni une statistique d’adoption. Les éventuels recadrages doivent uniquement retirer les barres système Android, sans modifier les données de l’interface.

## Nouveaux écrans WhatsApp et groupage

La demande de refonte fournit seize nouveaux aperçus WhatsApp, datés du 23 octobre 2026. Leurs chemins d’origine commencent par `C:\Users\HP\Downloads\WhatsApp Image 2026-10-23 at 09.42...`. Ces chemins Windows ne sont pas accessibles depuis l’environnement Linux : les images sont visibles dans la conversation, mais leurs fichiers binaires ne sont pas présents dans le projet au moment de la préparation de l’import.

Les écrans montrent le parcours et les opérations suivants :

- Liste et progression des groupages : quantité visée, quantité restante et délai.
- Produit, prix fournisseur, devise, taux enregistré, quantité et date limite.
- Transport, volume en CBM, tarif de transport, livraison et autres frais.
- Marge, prix livré final par unité, création et suivi des participations.
- États commandé, en transit et arrivé, invitations et demandes de participation.
- Statistiques de ventes et de produits, dépenses, dettes/crédits et ventes.

L’utilisateur demande expressément d’ajouter une présentation du groupage Alibaba ou d’autres plateformes. Le contenu reprend les opérations montrées et précise qu’il s’agit d’informations renseignées manuellement, sans revendication d’une connexion automatique à Alibaba. Les écrans indiquent aussi explicitement : **« SamaJaay ne reçoit et ne garde aucun argent »**. Les paiements suivis sont ceux que l’utilisateur renseigne comme reçus directement des participants ; ils ne sont pas présentés comme un bénéfice garanti.

Les montants, marges, taux de change et tarifs visibles dans ces captures sont des exemples d’utilisation, pas des prix commerciaux actuels, des tarifs vérifiés de transitaires ou des résultats promis par SamaJaay.

### Intégration des fichiers d’origine

Le manifeste `src/lib/imported-screens.json` est initialement vide (`[]`). Le script `scripts/import-screens.mjs --from <dossier>` reconnaît les seize noms WhatsApp et copie uniquement les vrais JPEG disponibles, sans modifier leurs octets. Il conserve jusqu’à dix écrans complémentaires dans le manifeste de la démonstration, fusionné avec les cinq captures initiales. Les six autres originaux peuvent être conservés dans le dossier d’import sans être affichés dans les onglets.

Aucune image nouvelle n’est remplacée par une capture fictive ou une reconstitution. Une fois les originaux disponibles sur l’ordinateur qui les possède, suivre [import-captures.md](import-captures.md), puis reconstruire le site. Le manifeste ne doit référencer que les fichiers réellement importés.

## Limite de déploiement

L’application est actuellement servie à la racine de `https://samajaay.com/`. La landing doit être hébergée à une autre origine, ou l’application déplacée vers une URL réelle et vérifiée avant de remplacer cette racine. Configurer alors `NEXT_PUBLIC_APP_URL` pour éviter une boucle des CTA. Le choix de présenter le groupage dans la refonte repose sur la demande explicite de l’utilisateur et sur les nouveaux écrans fournis, décrits ci-dessus. La simple présence de code dans le bundle n’est pas utilisée seule comme preuve d’un parcours de production complet.
