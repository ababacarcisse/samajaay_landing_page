import {
  ArrowUpRight,
  Banknote,
  ChevronDown,
  CircleHelp,
  HandCoins,
  Mail,
  Package,
  ReceiptText,
  ShoppingBag,
  Smartphone,
  Star,
  Store,
  TrendingUp,
  Truck,
} from "lucide-react";
import { features, faqItems, steps, type FeatureIcon } from "@/lib/content";
import { navigation, APP_URL } from "@/lib/config";
import { AppLink, BrandLogo, SectionLabel } from "./ui";
import { Reveal } from "./reveal";
import { AnalyticsPreferencesButton } from "./analytics-consent";

const featureIcons = {
  sales: Banknote,
  stock: Package,
  purchases: ShoppingBag,
  expenses: ReceiptText,
  debts: HandCoins,
  profit: TrendingUp,
} satisfies Record<FeatureIcon, typeof Banknote>;

export function ProblemSection() {
  const problems = [
    {
      title: "Le stock",
      description: "Des quantités qui changent, difficiles à suivre.",
    },
    {
      title: "Les dépenses",
      description: "Un transport, un achat, un petit montant oublié.",
    },
    {
      title: "Les crédits clients",
      description: "Des sommes à récupérer, sans perdre le fil.",
    },
    {
      title: "Les informations",
      description: "Des notes dispersées entre plusieurs cahiers.",
    },
    {
      title: "Le bénéfice",
      description: "Ce qu’il reste vraiment, une fois les dépenses comptées.",
    },
  ];
  return (
    <section
      className="sj-problem section-space"
      id="probleme"
      aria-labelledby="problem-title"
    >
      <div className="container sj-problem-grid">
        <Reveal className="sj-problem-copy">
          <SectionLabel>Le quotidien du commerce</SectionLabel>
          <h2 className="section-heading" id="problem-title">
            Tu vends beaucoup.
            <br />
            <span>Mais sais-tu vraiment combien tu gagnes ?</span>
          </h2>
          <p className="sj-problem-lead">
            Quand le stock, les dépenses et les crédits sont éparpillés,
            comprendre tes chiffres devient compliqué.
          </p>
        </Reveal>
        <Reveal className="sj-problem-detail" delay={0.06}>
          <ol className="sj-problem-list">
            {problems.map((problem, index) => (
              <li key={problem.title}>
                <span className="sj-problem-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3>{problem.title}</h3>
                  <p>{problem.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section
      className="sj-features section-space"
      id="fonctionnalites"
      aria-labelledby="features-title"
    >
      <div className="container">
        <Reveal className="sj-section-intro">
          <div>
            <SectionLabel>Une gestion commerciale plus simple</SectionLabel>
            <h2 className="section-heading" id="features-title">
              Chaque opération
              <br />
              <span>trouve sa place.</span>
            </h2>
          </div>
          <p className="section-description">
            Les outils du quotidien et les chiffres pour décider, réunis dans la
            même application.
          </p>
        </Reveal>
        <div className="sj-feature-grid">
          <Reveal className="sj-feature-panel sj-feature-daily">
            <p className="sj-panel-heading">Pour ta journée</p>
            <div className="sj-daily-list">
              {features.slice(0, 4).map((feature) => {
                const Icon = featureIcons[feature.icon];
                return (
                  <article
                    className={`sj-feature-card sj-feature-${feature.icon}`}
                    key={feature.icon}
                  >
                    <span className="sj-feature-icon">
                      <Icon size={27} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <div className="sj-feature-text">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>
          <Reveal className="sj-feature-panel sj-feature-insights" delay={0.06}>
            <p className="sj-panel-heading">Pour tes décisions</p>
            {features.slice(4).map((feature) => {
              const Icon = featureIcons[feature.icon];
              return (
                <article
                  className={`sj-feature-card sj-feature-${feature.icon}`}
                  key={feature.icon}
                >
                  <span className="sj-feature-icon">
                    <Icon size={34} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div className="sj-feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              );
            })}
            <p className="sj-panel-footnote">
              Tes chiffres reflètent les opérations que tu renseignes.
            </p>
          </Reveal>
        </div>
        <Reveal className="sj-features-action">
          <AppLink location="features" />
          <span>
            <Smartphone size={21} aria-hidden="true" />
            Ton commerce, depuis ton smartphone.
          </span>
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section
      className="sj-how section-space"
      id="comment-ca-marche"
      aria-labelledby="how-title"
    >
      <div className="container sj-how-layout">
        <Reveal className="sj-how-intro">
          <SectionLabel>Un réflexe simple</SectionLabel>
          <h2 className="section-heading" id="how-title">
            Trois étapes.
            <br />
            <span>Et tu y vois plus clair.</span>
          </h2>
          <p className="section-description">
            De la première opération aux chiffres de ta journée, garde le fil de
            ton activité.
          </p>
        </Reveal>
        <ol className="sj-steps">
          {steps.map((step, index) => (
            <li key={step.number}>
              <Reveal delay={index * 0.05}>
                <span className="sj-step-number" aria-hidden="true">
                  {step.number}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SenegalSection() {
  return (
    <section
      className="sj-senegal section-space"
      id="senegal"
      aria-labelledby="senegal-title"
    >
      <div className="container">
        <div className="sj-senegal-panel">
          <Reveal className="sj-senegal-copy">
            <SectionLabel>Les réalités de ton commerce</SectionLabel>
            <h2 className="section-heading" id="senegal-title">
              Pensé pour toi.
              <br />
              <span>Pensé pour le Sénégal.</span>
            </h2>
            <p>
              La boutique du quartier, l’activité de revente, les marchandises
              achetées à l’import : chaque commerce mérite une gestion à sa
              portée.
            </p>
            <div className="sj-senegal-tags">
              <span>
                <Store size={20} aria-hidden="true" />
                Boutiques
              </span>
              <span>
                <ShoppingBag size={20} aria-hidden="true" />
                Revendeurs
              </span>
              <span>
                <Truck size={20} aria-hidden="true" />
                Importateurs
              </span>
            </div>
          </Reveal>
          <Reveal className="sj-fcfa-composition" delay={0.06}>
            <div
              className="sj-senegal-flag"
              role="img"
              aria-label="Drapeau du Sénégal"
            >
              <i />
              <i>
                <Star
                  size={15}
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden="true"
                />
              </i>
              <i />
            </div>
            <p className="sj-fcfa-overline">Tes repères. Ta monnaie.</p>
            <p className="sj-fcfa-word">
              FCFA<span aria-hidden="true">.</span>
            </p>
            <p className="sj-fcfa-description">
              Des montants qui te parlent.
              <br />
              Sur le smartphone que tu utilises déjà.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section
      className="sj-faq section-space"
      id="faq"
      aria-labelledby="faq-title"
    >
      <div className="container sj-faq-layout">
        <Reveal className="sj-faq-intro">
          <SectionLabel>Les réponses utiles</SectionLabel>
          <h2 className="section-heading" id="faq-title">
            Tes questions.
            <br />
            <span>Nos réponses.</span>
          </h2>
          <p className="section-description">
            L’essentiel pour découvrir SamaJaay et commencer à mieux suivre ton
            activité.
          </p>
          <a className="sj-contact-link" href="mailto:cissedev5@gmail.com">
            <CircleHelp size={21} aria-hidden="true" />
            <span>Une autre question ? Contacte-nous</span>
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </Reveal>
        <div className="sj-faq-items">
          {faqItems.map((item, index) => (
            <details className="sj-faq-item" key={item.question}>
              <summary>
                <span className="sj-faq-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{item.question}</span>
                <ChevronDown size={21} aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="sj-final" aria-labelledby="final-title">
      <div className="container">
        <Reveal className="sj-final-inner">
          <div>
            <SectionLabel light>À toi de jouer</SectionLabel>
            <h2 id="final-title">
              Prends le contrôle
              <br />
              de ton commerce
              <br />
              <span>dès aujourd’hui.</span>
            </h2>
          </div>
          <div className="sj-final-action">
            <AppLink location="final">Accéder à SamaJaay</AppLink>
            <p>
              Ton business. Tes chiffres.
              <br />
              En toute simplicité.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="sj-footer">
      <div className="container">
        <div className="sj-footer-top">
          <div className="sj-footer-brand">
            <BrandLogo />
            <p>
              Ton business. Tes chiffres.
              <br />
              En toute simplicité.
            </p>
          </div>
          <nav aria-label="Navigation de pied de page">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="sj-footer-contact">
            <p>Restons en contact.</p>
            <a href="mailto:cissedev5@gmail.com">
              <Mail size={20} aria-hidden="true" />
              cissedev5@gmail.com
            </a>
            <a href={APP_URL} data-cta-location="footer">
              Ouvrir SamaJaay
              <ArrowUpRight size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="sj-footer-bottom">
          <p>© {new Date().getFullYear()} SamaJaay. Tous droits réservés.</p>
          <AnalyticsPreferencesButton />
          <a href="https://samajaay.com/#/privacy">
            Politique de confidentialité
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
