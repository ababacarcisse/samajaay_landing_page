import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        background: "#F8FAF9",
        color: "#052E20",
        textAlign: "center",
      }}
    >
      <p style={{ fontWeight: 700, letterSpacing: ".14em" }}>SAMAJAAY · 404</p>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.1 }}>
        Cette page est introuvable.
      </h1>
      <p>Retrouve SamaJaay et découvre une gestion commerciale plus simple.</p>
      <Link
        href="/"
        style={{
          justifySelf: "center",
          borderRadius: "100px",
          padding: "1rem 1.5rem",
          background: "#052E20",
          color: "white",
          fontWeight: 700,
        }}
      >
        Revenir à l’accueil →
      </Link>
    </main>
  );
}
