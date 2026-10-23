import { ArrowDown, Check, Smartphone, Star } from "lucide-react";
import { AppLink, PhoneMockup } from "./ui";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section id="accueil" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-context">
            La gestion commerciale, pensée pour le Sénégal.
          </p>
          <h1 id="hero-title">
            <span>Ton commerce </span>
            <span>mérite mieux qu’un </span>
            <span>simple cahier.</span>
          </h1>
          <p className="hero-description">
            Ventes, stock, achats, dépenses et bénéfices : retrouve tes vrais
            chiffres avec SamaJaay. Une application simple, sur le smartphone
            que tu utilises déjà.
          </p>
          <div className="hero-actions">
            <AppLink location="hero" />
            <a className="button-text" href="#decouvrir">
              Découvrir SamaJaay <ArrowDown size={20} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-reassurance">
            <Smartphone size={19} aria-hidden="true" />
            Ton business. Tes chiffres. En toute simplicité.
          </p>
        </div>
        <Reveal className="hero-art">
          <div className="hero-art-label">
            <span className="senegal-flag" aria-hidden="true">
              <i />
              <i>
                <Star size={6} fill="currentColor" strokeWidth={0} />
              </i>
              <i />
            </span>
            Ton activité, en FCFA.
          </div>
          <div className="hero-phone-wrap">
            <PhoneMockup
              priority
              src="/screens/figures.jpg"
              alt="Écran réel de SamaJaay : investissement, stock, bénéfice net, dépenses et dettes en FCFA."
            />
          </div>
          <p className="hero-image-caption">
            <Check size={17} aria-hidden="true" />
            Les chiffres de ton commerce, sous tes yeux.
          </p>
        </Reveal>
      </div>
      <div className="hero-bottom container">
        <p>
          Une seule application.
          <br />
          <strong>Du premier achat à la dernière vente.</strong>
        </p>
        <ul aria-label="Pour les acteurs du commerce">
          <li>Commerçants</li>
          <li>Revendeurs</li>
          <li>Importateurs</li>
        </ul>
        <a href="#groupage">
          Découvrir le groupage <ArrowDown size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
