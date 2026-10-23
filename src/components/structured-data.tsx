import { APP_URL, SITE_URL } from "@/lib/config";
import { faqItems, productDescription as description } from "@/lib/content";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "SamaJaay",
      url: SITE_URL,
      inLanguage: "fr-SN",
      description,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}#application`,
      name: "SamaJaay",
      url: APP_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "fr",
      description,
      featureList: [
        "Gestion des ventes",
        "Suivi des produits et des stocks",
        "Suivi des achats locaux et à l’import",
        "Gestion des dépenses",
        "Suivi des dettes et crédits clients",
        "Suivi des bénéfices",
        "Organisation et suivi des achats groupés",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      inLanguage: "fr-SN",
      mainEntity: faqItems.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

/** Homepage-only schema: each described feature and FAQ is visible on this page. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
