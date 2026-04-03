import { ImageResponse } from "next/og";

export const alt = "AI Compare - Compare AI Technologies Side by Side";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 24,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            marginBottom: 32,
            boxShadow: "0 0 60px rgba(99,102,241,0.4)",
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            AI
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>AI</span>
          <span style={{ color: "#818cf8" }}>Compare</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            marginTop: 16,
            fontWeight: 400,
          }}
        >
          Compare AI Models, Platforms, Cloud, Chips & Security Tools
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 32,
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span>9 Categories</span>
          <span>50+ Services</span>
          <span>500+ Data Points</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
