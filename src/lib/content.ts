export type FeatureIcon =
  "sales" | "stock" | "purchases" | "expenses" | "debts" | "profit";

export const productDescription =
  "Gère tes ventes, stocks, achats, dépenses, bénéfices et groupages avec SamaJaay, l’application de gestion commerciale pensée pour le Sénégal.";

export const groupageSteps = [
  {
    title: "Définis ton achat.",
    description:
      "Renseigne le produit, le prix fournisseur, la devise et le taux utilisé. Fixe la quantité visée et la date limite du groupage.",
    detailsLabel: "Informations de l’achat groupé",
    details: ["Produit et prix fournisseur", "Quantité et date limite"],
  },
  {
    title: "Prépare ton prix livré.",
    description:
      "Ajoute le transport, le volume en CBM si nécessaire, la livraison et les autres frais. Renseigne ta marge pour définir le prix livré par unité.",
    detailsLabel: "Éléments du prix livré",
    details: ["Transport et frais", "Marge et prix par unité"],
  },
  {
    title: "Suis les participations.",
    description:
      "Retrouve les demandes et les participants, leurs quantités et les paiements que tu renseignes comme reçus. Mets à jour le statut du groupage.",
    detailsLabel: "Informations de participation",
    details: ["Participants et quantités", "Paiements renseignés"],
  },
] as const;

export const features: ReadonlyArray<{
  title: string;
  description: string;
  icon: FeatureIcon;
  number: string;
}> = [
  {
    number: "01",
    icon: "sales",
    title: "Tes ventes, bien suivies.",
    description:
      "Enregistre tes ventes et retrouve les montants encaissés. Chaque opération a sa place.",
  },
  {
    number: "02",
    icon: "stock",
    title: "Ton stock, plus clair.",
    description:
      "Retrouve tes produits, les quantités disponibles et les articles à vérifier.",
  },
  {
    number: "03",
    icon: "purchases",
    title: "Tes achats, au même endroit.",
    description:
      "Suis tes achats de marchandises, auprès de fournisseurs locaux ou à l’import.",
  },
  {
    number: "04",
    icon: "expenses",
    title: "Tes dépenses, sans les oublier.",
    description:
      "Note les dépenses de ton commerce pour comprendre ce qui sort de ta caisse.",
  },
  {
    number: "05",
    icon: "debts",
    title: "Tes crédits, sous les yeux.",
    description:
      "Garde le fil des dettes clients et des montants que tu dois régler.",
  },
  {
    number: "06",
    icon: "profit",
    title: "Tes bénéfices, enfin lisibles.",
    description:
      "Consulte ton bénéfice net, l’argent investi et l’argent disponible à partir de tes opérations.",
  },
];

export interface ProductScreenshot {
  id: string;
  label: string;
  title: string;
  description: string;
  src: string;
  alt: string;
}

export const screenshots = [
  {
    id: "overview",
    label: "Vue d’ensemble",
    title: "Ouvre l’application. Retrouve l’essentiel.",
    description:
      "Un aperçu des ventes encaissées et de ton activité, avec les montants en FCFA.",
    src: "/screens/dashboard.jpg",
    alt: "Capture réelle de l’accueil SamaJaay : ventes encaissées et navigation du commerce.",
  },
  {
    id: "figures",
    label: "Mes chiffres",
    title: "Comprends où en est ton commerce.",
    description:
      "Investissement, valeur du stock, bénéfice net, dépenses et dettes : retrouve tes chiffres au même endroit.",
    src: "/screens/figures.jpg",
    alt: "Capture réelle des indicateurs SamaJaay : investi, en stock, bénéfice net, dépensé et dettes en FCFA.",
  },
  {
    id: "activity",
    label: "Une opération",
    title: "Une vente, un achat, une dépense.",
    description:
      "Choisis l’opération à enregistrer depuis le bouton d’ajout de l’application.",
    src: "/screens/activity.jpg",
    alt: "Capture réelle du menu SamaJaay pour ajouter une vente, un achat ou une dépense.",
  },
  {
    id: "purchases",
    label: "Mes achats",
    title: "Du fournisseur local à l’import.",
    description:
      "Distingue tes achats locaux et tes achats à l’import pour suivre tes approvisionnements.",
    src: "/screens/purchases.jpg",
    alt: "Capture réelle du choix d’un nouvel achat SamaJaay : fournisseur local ou import.",
  },
  {
    id: "stock",
    label: "Mon stock",
    title: "Garde un œil sur tes produits.",
    description:
      "Repère les articles à vérifier et consulte les produits qui se vendent dans ton commerce.",
    src: "/screens/stock.jpg",
    alt: "Capture réelle SamaJaay : produits à vérifier, quantités en stock et produits les plus vendus.",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Accède à SamaJaay.",
    description:
      "Ouvre l’application depuis ton smartphone et retrouve ton espace de gestion.",
  },
  {
    number: "02",
    title: "Enregistre tes opérations.",
    description:
      "Ajoute tes ventes, tes achats et tes dépenses au fil de ta journée.",
  },
  {
    number: "03",
    title: "Consulte tes chiffres.",
    description:
      "Retrouve tes stocks, tes dettes et tes bénéfices pour mieux piloter ton activité.",
  },
] as const;

export const faqItems = [
  {
    question: "À qui s’adresse SamaJaay ?",
    answer:
      "SamaJaay s’adresse aux commerçants, revendeurs, entrepreneurs et responsables de petites boutiques au Sénégal. L’application réunit le suivi des opérations et des chiffres du commerce dans un même espace.",
  },
  {
    question: "Comment accéder à l’application ?",
    answer:
      "Clique sur « Accéder à l’application » pour ouvrir SamaJaay. L’application est accessible depuis un navigateur, notamment sur smartphone.",
  },
  {
    question: "Puis-je suivre mes ventes et mon stock ?",
    answer:
      "Oui. Tu peux enregistrer tes ventes et tes achats, suivre tes produits et consulter les quantités en stock. Les chiffres affichés dépendent des opérations que tu renseignes.",
  },
  {
    question: "Puis-je gérer les dettes de mes clients ?",
    answer:
      "Oui. SamaJaay permet de suivre les crédits clients, les montants qui te sont dus et les dettes que tu dois régler. Tu gardes ainsi une vue sur les sommes à suivre.",
  },
  {
    question: "SamaJaay convient-il aux revendeurs et importateurs ?",
    answer:
      "Oui. Tu peux distinguer tes achats locaux et tes achats à l’import, puis suivre les marchandises et les opérations de ton commerce.",
  },
  {
    question: "Les montants sont-ils affichés en FCFA ?",
    answer:
      "Oui. Les écrans de SamaJaay présentent les montants en FCFA, pour suivre les ventes, les dépenses, le stock et les bénéfices de ton activité.",
  },
  {
    question: "Puis-je organiser un groupage pour mes achats sur Alibaba ?",
    answer:
      "Oui. Tu peux organiser le suivi d’achats groupés, d’Alibaba ou d’autres plateformes : produit, prix fournisseur, devise, quantité, frais et participants. Le suivi repose sur les informations que tu saisis ; il ne s’agit pas d’une connexion automatique à ces plateformes.",
  },
  {
    question: "SamaJaay reçoit-il l’argent des participants au groupage ?",
    answer:
      "Non. SamaJaay ne reçoit et ne garde aucun argent. Tu renseignes les paiements reçus directement des participants et tu restes responsable des informations que tu ajoutes au groupage.",
  },
] as const;
