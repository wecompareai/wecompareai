import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "36px",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-3px",
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          AI
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            fontFamily: "sans-serif",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          COMPARE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
