import { ImageResponse } from "next/og";

export const alt = "SageSix — Software, AI & Digital Product Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a09",
          color: "#ecece5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: "#a3b88a",
            }}
          />
          <div style={{ fontSize: 28, letterSpacing: "0.3em", fontFamily: "monospace" }}>
            SAGESIX
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Software. AI. Product.
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, color: "rgba(236,236,229,0.4)" }}>
            Built to scale.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: "#b6b6ac" }}>
          <div
            style={{
              width: 120,
              height: 2,
              background: "#a3b88a",
            }}
          />
          We build digital products that move businesses forward.
        </div>
      </div>
    ),
    { ...size }
  );
}