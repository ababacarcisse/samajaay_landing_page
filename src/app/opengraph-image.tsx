import { ImageResponse } from "next/og";

export const alt =
  "SamaJaay — Ton business. Tes chiffres. En toute simplicité.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#052E20",
        color: "#F8FAF9",
        padding: "66px 76px",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
          Sama<span style={{ color: "#4ADE80" }}>Jaay</span>
        </div>
        <div
          style={{
            display: "flex",
            border: "1px solid #466F51",
            borderRadius: 40,
            padding: "12px 22px",
            fontSize: 20,
          }}
        >
          Pensé pour le Sénégal
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.04,
            fontWeight: 700,
            maxWidth: 1020,
          }}
        >
          Ton commerce mérite mieux qu’un simple cahier.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 25,
            color: "#BDE1C9",
            marginTop: 20,
          }}
        >
          Ventes · Stock · Bénéfices · Groupages
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#D2E5D8",
          fontSize: 21,
        }}
      >
        <span>Ton business. Tes chiffres. En toute simplicité.</span>
        <span>samajaay.com ↗</span>
      </div>
    </div>,
    size,
  );
}
