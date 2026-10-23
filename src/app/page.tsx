import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProductDemo } from "@/components/product-demo";
import { AnalyticsBridge } from "@/components/analytics";
import { StructuredData } from "@/components/structured-data";
import { SectionLabel } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { GroupageSection } from "@/components/groupage";
import { screenshots } from "@/lib/content";
import importedScreens from "@/lib/imported-screens.json";
import {
  ProblemSection,
  FeaturesSection,
  HowItWorksSection,
  SenegalSection,
  FaqSection,
  FinalCta,
  Footer,
} from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">
        <Hero />
        <ProblemSection />
        <section
          id="decouvrir"
          className="product-section"
          aria-labelledby="product-title"
        >
          <div className="container">
            <Reveal className="product-section-heading">
              <div>
                <SectionLabel>Le déclic SamaJaay</SectionLabel>
                <h2 id="product-title" className="section-heading">
                  Tout ton commerce.
                  <br />
                  <span>Une seule application.</span>
                </h2>
              </div>
              <p className="section-description">
                Moins d’informations éparpillées.
                <br />
                Plus de clarté, du premier achat
                <br className="desktop-break" /> à la dernière vente de la
                journée.
              </p>
            </Reveal>
            <ProductDemo screenshots={[...screenshots, ...importedScreens]} />
          </div>
        </section>
        <FeaturesSection />
        <GroupageSection />
        <HowItWorksSection />
        <SenegalSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
      <AnalyticsBridge />
      <StructuredData />
    </>
  );
}
