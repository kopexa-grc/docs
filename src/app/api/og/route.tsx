import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Kopexa brand colors
const BRAND_PRIMARY = "#0F263E";
const BRAND_CYAN = "#22d3ee";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "Kopexa Documentation";
  const description = searchParams.get("description") || "GRC Platform für moderne Unternehmen";
  const type = searchParams.get("type") || "docs";

  // Determine display type
  const displayType = type === "platform"
    ? "Platform"
    : type === "catalog"
      ? "Catalog"
      : type === "integrations"
        ? "Integrations"
        : "Documentation";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BRAND_PRIMARY,
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${BRAND_CYAN}15 1px, transparent 1px),
              linear-gradient(90deg, ${BRAND_CYAN}15 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(145deg, ${BRAND_PRIMARY} 0%, #1a3a5c 40%, ${BRAND_PRIMARY} 100%)`,
            opacity: 0.95,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "48px 56px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Top: Logo and badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: BRAND_CYAN,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "32px", fontWeight: "bold", color: BRAND_PRIMARY }}>K</span>
              </div>
              <span style={{ fontSize: "28px", fontWeight: "600", color: "white" }}>Kopexa</span>
            </div>

            {/* Type badge */}
            <div
              style={{
                backgroundColor: `${BRAND_CYAN}20`,
                border: `2px solid ${BRAND_CYAN}60`,
                borderRadius: "9999px",
                padding: "8px 20px",
                display: "flex",
              }}
            >
              <span style={{ fontSize: "16px", color: BRAND_CYAN, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: "500" }}>
                {displayType}
              </span>
            </div>
          </div>

          {/* Center: Title and description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
            <h1
              style={{
                fontSize: title.length > 50 ? "44px" : title.length > 30 ? "52px" : "58px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: "22px",
                  color: "#94a3b8",
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {description.length > 100 ? `${description.slice(0, 97)}...` : description}
              </p>
            )}
          </div>

          {/* Bottom: URL and decorative elements */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: "18px", color: "#64748b" }}>docs.kopexa.com</span>

            {/* Decorative pixel elements */}
            <div style={{ display: "flex", gap: "6px" }}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: i % 2 === 0 ? BRAND_CYAN : `${BRAND_CYAN}40`,
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "80px",
            height: "80px",
            borderTop: `3px solid ${BRAND_CYAN}25`,
            borderRight: `3px solid ${BRAND_CYAN}25`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            width: "80px",
            height: "80px",
            borderBottom: `3px solid ${BRAND_CYAN}25`,
            borderLeft: `3px solid ${BRAND_CYAN}25`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
