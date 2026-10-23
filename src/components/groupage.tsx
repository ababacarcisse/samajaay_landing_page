import { ArrowRight, Check, PackageCheck, Users } from "lucide-react";
import { groupageSteps } from "@/lib/content";
import { AppLink } from "./ui";
import { Reveal } from "./reveal";

/** A product explanation, not a recreation of the application's interface. */
export function GroupageSection() {
  return (
    <section
      id="groupage"
      className="groupage-section"
      aria-labelledby="groupage-title"
    >
      <div className="container">
        <Reveal className="groupage-heading">
          <h2 id="groupage-title" className="section-heading">
            Le groupage,
            <br />
            bien organisé.
          </h2>
          <p>
            Organise tes achats groupés, d’Alibaba ou d’autres plateformes. Du
            prix fournisseur aux participations, garde les informations du
            groupage au même endroit.
          </p>
        </Reveal>

        <div className="groupage-layout">
          <div className="groupage-principle">
            <p className="groupage-kicker">Le principe, en trois temps</p>
            <ol className="groupage-steps">
              {groupageSteps.map((step, index) => (
                <li key={step.title}>
                  <Reveal delay={index * 0.07}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <ul aria-label={step.detailsLabel}>
                      {step.details.map((detail) => (
                        <li key={detail}>
                          <Check size={17} aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <Reveal className="groupage-follow">
            <div className="groupage-follow-heading">
              <PackageCheck size={29} strokeWidth={1.5} aria-hidden="true" />
              <h3>
                Garde le fil,
                <br />
                jusqu’à l’arrivée.
              </h3>
            </div>
            <p>Renseigne l’avancement du groupage au fil de ses étapes.</p>
            <ol className="groupage-statuses" aria-label="Statuts du groupage">
              <li>
                <span aria-hidden="true">
                  <Check size={16} />
                </span>
                <strong>Commandé</strong>
              </li>
              <li>
                <span aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
                <strong>En transit</strong>
              </li>
              <li>
                <span aria-hidden="true">
                  <PackageCheck size={16} />
                </span>
                <strong>Arrivé</strong>
              </li>
            </ol>
            <div className="groupage-participants">
              <Users size={25} strokeWidth={1.5} aria-hidden="true" />
              <p>
                Participants, demandes et quantités : chacun a sa place dans le
                suivi.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="groupage-bottom">
          <div className="groupage-money">
            <p>
              <strong>SamaJaay ne reçoit et ne garde aucun argent.</strong>
            </p>
            <p>
              Tu renseignes les informations du groupage et les paiements reçus
              directement des participants.
            </p>
          </div>
          <AppLink location="groupage">Accéder à SamaJaay</AppLink>
        </div>
      </div>
    </section>
  );
}
