#!/usr/bin/env node

/** Import the user's original WhatsApp screenshots without changing their bytes. */
import { constants } from "node:fs";
import {
  access,
  copyFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const targetDirectory = join(projectRoot, "public", "screens", "imported");
const manifestPath = join(projectRoot, "src", "lib", "imported-screens.json");

// The order matches the sixteen attachments supplied by the user.
const captures = [
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.22 (1).jpeg",
    id: "groupage-overview",
    selected: true,
    category: "groupage",
    label: "Les groupages",
    title: "Les groupages, en un coup d’œil.",
    description:
      "Retrouve les groupages ouverts, leur quantité visée et le délai restant.",
    alt: "Capture réelle SamaJaay : liste des groupages, progression des quantités et délai restant.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.22.jpeg",
    id: "groupage-participants",
    selected: true,
    category: "groupage",
    label: "Les participants",
    title: "Garde le fil des participations.",
    description:
      "Consulte les participants et leurs quantités, les invitations et les états commandé, en transit ou arrivé.",
    alt: "Capture réelle SamaJaay : gestion des participants et des états d’un groupage.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.21 (3).jpeg",
    id: "groupage-progress",
    selected: true,
    category: "groupage",
    label: "Le prix livré",
    title: "Un prix livré annoncé à l’unité.",
    description:
      "Consulte la progression du groupage, le prix livré annoncé et les paiements que tu as pointés comme reçus.",
    alt: "Capture réelle SamaJaay : progression d’un groupage, prix livré par unité et total reçu des participants.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.21 (2).jpeg",
    id: "groupage-final-price",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.21 (1).jpeg",
    id: "groupage-margin",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.21.jpeg",
    id: "groupage-other-costs",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20 (5).jpeg",
    id: "groupage-transport",
    selected: true,
    category: "groupage",
    label: "Le transport",
    title: "Le transport et ses frais, au même endroit.",
    description:
      "Renseigne le mode de transport, le volume en CBM et les frais du transitaire pour préparer ton groupage.",
    alt: "Capture réelle SamaJaay : choix avion ou bateau, transport en Chine, volume en CBM et tarif du transitaire.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20 (4).jpeg",
    id: "groupage-supplier",
    selected: true,
    category: "groupage",
    label: "Le fournisseur",
    title: "Des achats à l’import mieux préparés.",
    description:
      "Renseigne le prix du fournisseur, son taux de conversion, la quantité visée et la date limite du groupage.",
    alt: "Capture réelle SamaJaay : prix fournisseur en devise, taux enregistré, quantité visée et date limite d’un groupage.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20 (3).jpeg",
    id: "groupage-product",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20 (2).jpeg",
    id: "groupage-empty-product",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20 (1).jpeg",
    id: "sales-statistics",
    selected: true,
    category: "commerce",
    label: "Les statistiques",
    title: "Tes ventes et tes bénéfices dans le temps.",
    description:
      "Consulte l’évolution de tes ventes et des bénéfices des ventes sur la période affichée.",
    alt: "Capture réelle SamaJaay : courbe des ventes et des bénéfices des ventes sur une période.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.20.jpeg",
    id: "cost-statistics",
    selected: false,
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.19 (3).jpeg",
    id: "product-statistics",
    selected: true,
    category: "commerce",
    label: "Les produits",
    title: "Repère les produits qui font avancer ton activité.",
    description:
      "Retrouve les articles les plus vendus, les stocks qui ne bougent plus et le bénéfice par produit.",
    alt: "Capture réelle SamaJaay : produits les plus vendus, stock sans mouvement et bénéfice par produit.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.19 (2).jpeg",
    id: "customer-debts",
    selected: true,
    category: "commerce",
    label: "Les crédits clients",
    title: "Retrouve les crédits clients à suivre.",
    description:
      "Consulte les montants qui te sont dus, les dettes à régler et les crédits de tes clients.",
    alt: "Capture réelle SamaJaay : dettes et prêts, montants dus et crédit d’une cliente.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.19 (1).jpeg",
    id: "business-expenses",
    selected: true,
    category: "commerce",
    label: "Les dépenses",
    title: "Chaque dépense garde sa place.",
    description:
      "Retrouve les dépenses enregistrées par date et le total de la période.",
    alt: "Capture réelle SamaJaay : suivi des dépenses du commerce, total mensuel et détail d’une dépense de transport.",
  },
  {
    filename: "WhatsApp Image 2026-10-23 at 09.42.19.jpeg",
    id: "recorded-sales",
    selected: true,
    category: "commerce",
    label: "Les ventes",
    title: "Une vue claire sur les ventes enregistrées.",
    description:
      "Consulte les ventes par date et retrouve leur état de paiement.",
    alt: "Capture réelle SamaJaay : ventes du jour, total des ventes et vente payée en partie.",
  },
];

function normalizedName(filename) {
  return filename
    .toLocaleLowerCase("fr")
    .replace(/\.(?:jpe?g)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function isJpeg(path) {
  const bytes = await readFile(path);
  return (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  );
}

async function exists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      from: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
    strict: true,
  });
  if (values.help) {
    console.log(
      'Usage : node scripts/import-screens.mjs --from "dossier des captures"',
    );
    console.log(
      "Les JPEG originaux sont copiés sans retouche ; les captures déjà importées sont conservées.",
    );
    return;
  }
  if (!values.from)
    throw new Error(
      'Indique le dossier source avec --from "dossier des captures".',
    );

  const sourceDirectory = resolve(values.from);
  const directory = await stat(sourceDirectory).catch(() => null);
  if (!directory?.isDirectory())
    throw new Error(
      `Dossier source introuvable ou invalide : ${sourceDirectory}`,
    );
  await access(sourceDirectory, constants.R_OK);
  const files = await readdir(sourceDirectory, { withFileTypes: true });
  const byName = new Map(
    files
      .filter((entry) => entry.isFile() && /\.jpe?g$/i.test(entry.name))
      .map((entry) => [normalizedName(entry.name), entry.name]),
  );

  // Validate the source folder and all recognized files before writing anything.
  const planned = [];
  const missing = [];
  const invalid = [];
  for (const capture of captures) {
    const sourceName = byName.get(normalizedName(capture.filename));
    if (!sourceName) {
      missing.push(capture.filename);
      continue;
    }
    const sourcePath = join(sourceDirectory, sourceName);
    if (!(await isJpeg(sourcePath))) {
      invalid.push(sourceName);
      continue;
    }
    planned.push({ ...capture, sourcePath });
  }

  console.log(`Dossier validé : ${sourceDirectory}`);
  console.log(
    `Captures reconnues : ${planned.length}/16 ; absentes : ${missing.length} ; JPEG invalides : ${invalid.length}.`,
  );
  for (const filename of missing) console.log(`Absente, ignorée : ${filename}`);
  for (const filename of invalid)
    console.warn(`JPEG invalide, ignoré : ${filename}`);
  if (!planned.length) {
    console.log(
      "Aucune capture à importer. Aucun fichier ni manifeste modifié.",
    );
    return;
  }

  await mkdir(targetDirectory, { recursive: true });
  let copied = 0;
  let preserved = 0;
  for (const capture of planned) {
    const destination = join(targetDirectory, `${capture.id}.jpg`);
    try {
      await copyFile(capture.sourcePath, destination, constants.COPYFILE_EXCL);
      copied += 1;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      preserved += 1;
      console.log(
        `Déjà importée, conservée sans écrasement : ${capture.id}.jpg`,
      );
    }
  }

  const manifest = [];
  for (const {
    id,
    label,
    title,
    description,
    alt,
    category,
    selected,
  } of captures) {
    if (!selected) continue;
    const imagePath = join(targetDirectory, `${id}.jpg`);
    if (!(await exists(imagePath)) || !(await isJpeg(imagePath))) continue;
    manifest.push({
      id,
      label,
      title,
      description,
      src: `/screens/imported/${id}.jpg`,
      alt,
      category,
    });
  }
  await mkdir(dirname(manifestPath), { recursive: true });
  const temporaryManifest = `${manifestPath}.${process.pid}.tmp`;
  await writeFile(
    temporaryManifest,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await rename(temporaryManifest, manifestPath);
  console.log(
    `Import terminé : ${copied} fichier(s) copié(s), ${preserved} conservé(s), ${manifest.length}/10 écran(s) sélectionné(s) dans le manifeste.`,
  );
  console.log(
    "Relance npm run build pour inclure les nouvelles captures dans la landing.",
  );
}

main().catch((error) => {
  console.error(`Import impossible : ${error.message}`);
  process.exitCode = 1;
});
