import { ImageResponse } from "next/og";

/**
 * Dynamic OG image for /blog (1200×630), rendered by Next at request/CDN
 * time — no binary asset to maintain, and the design always matches the
 * current seasonal theme. Text mirrors the page title/description.
 */
export const alt =
  "Ultimate Cineverse Blog — Thanksgiving movies, family film guides and what to watch this holiday weekend";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function BlogOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background: "linear-gradient(155deg, #2b1a0e 0%, #1d130b 55%, #17100b 100%)",
          border: "3px solid #d9a441",
          color: "#f7efe3",
          fontFamily: "Georgia, serif"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#d9a441", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>
            ULTIMATE CINEVERSE · THE BLOG
          </div>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#c14a3a", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>THE THANKSGIVING EDIT</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05 }}>Gather. Watch.</div>
          <div style={{ fontSize: 84, lineHeight: 1.05, color: "#e08a3c", fontStyle: "italic" }}>Give thanks.</div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.45, color: "#deD0bc", fontFamily: "Arial, sans-serif" }}>
            Thanksgiving movies, family film guides &amp; what to watch this holiday weekend.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Arial, sans-serif" }}>
          <div style={{ fontSize: 23, letterSpacing: 3, color: "#a8b07e", fontWeight: 700 }}>
            THANKSGIVING 2026 · THURSDAY, NOVEMBER 26
          </div>
          <div style={{ fontSize: 23, color: "#b4a28c" }}>ultimatecineverse.com/blog</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
