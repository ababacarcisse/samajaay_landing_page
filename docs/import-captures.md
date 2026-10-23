# Importer les nouvelles captures SamaJaay

Les seize captures WhatsApp sont visibles dans la conversation, mais leurs fichiers locaux Windows ne sont pas accessibles depuis l’environnement Linux de développement. Elles n’ont donc pas été recréées ni remplacées par des images fictives. Le manifeste `src/lib/imported-screens.json` reste vide tant qu’un import réel n’a pas été effectué.

Le script Node.js fourni n’ajoute aucune dépendance et ne retouche pas les images. Il reconnaît les seize noms d’origine, copie les JPEG disponibles dans `public/screens/imported/` et référence jusqu’à dix écrans complémentaires : cinq écrans de groupage, les statistiques de ventes et de produits, les crédits clients, les dépenses et les ventes. Les six autres originaux sont conservés sans être ajoutés à la sélection de la démonstration.

## Depuis le projet sur Windows

Ouvre PowerShell dans le dossier du projet SamaJaay, puis exécute cette commande avec le dossier indiqué :

```powershell
node scripts/import-screens.mjs --from "C:\Users\HP\Documents\moi\apps\saas\samajaay\public\screens"
npm run build
```

Le paramètre `--from` désigne le dossier qui contient les fichiers d’origine, par exemple `WhatsApp Image 2026-10-23 at 09.42.22 (1).jpeg`. Si les images sont encore dans Téléchargements, utilise plutôt :

```powershell
node scripts/import-screens.mjs --from "C:\Users\HP\Downloads"
```

Les extensions `.jpeg` et `.jpg` et les différences de casse sont acceptées. Le contenu doit être un véritable JPEG. Le script vérifie d’abord que le dossier est accessible, ignore les fichiers absents ou invalides, puis affiche le nombre de captures trouvées, copiées et sélectionnées. Un dossier inexistant provoque une erreur sans écriture. Un dossier ne contenant aucun nom reconnu laisse les fichiers et le manifeste inchangés.

Les captures déjà présentes dans `public/screens/imported/` sont conservées sans écrasement. Les cinq anciennes captures et le logo ne sont jamais modifiés. Le manifeste ne référence que les images réellement présentes ; un import partiel conserve les captures déjà importées et disponibles.

## Partager les fichiers avec cette conversation

Pour permettre une intégration et une inspection ici, joins un fichier ZIP contenant les seize JPEG originaux, ou joins à nouveau les fichiers comme pièces jointes accessibles. Un chemin `C:\...` est une adresse sur ton ordinateur, pas un fichier téléchargeable par l’environnement distant.

Après réception et extraction d’un ZIP sous Linux, la même commande fonctionne :

```bash
node scripts/import-screens.mjs --from "/chemin/vers/les/captures"
npm run build
```

Le contenu commercial sur le groupage repose sur les écrans fournis. L’import ne crée ni connexion automatique à Alibaba ni service de paiement : les captures indiquent que SamaJaay ne reçoit et ne garde aucun argent.
