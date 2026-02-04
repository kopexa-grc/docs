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
  const type = searchParams.get("type") || "docs"; // docs, platform, catalog, etc.

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
        {/* Background pattern - pixel grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${BRAND_CYAN}10 1px, transparent 1px),
              linear-gradient(90deg, ${BRAND_CYAN}10 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #1a3a5c 50%, ${BRAND_PRIMARY} 100%)`,
            opacity: 0.9,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Top: Logo and badge */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: BRAND_CYAN,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "36px", fontWeight: "bold", color: BRAND_PRIMARY }}>K</span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: "600", color: "white" }}>Kopexa</span>
            </div>

            {/* Type badge */}
            <div
              style={{
                backgroundColor: `${BRAND_CYAN}20`,
                border: `2px solid ${BRAND_CYAN}`,
                borderRadius: "9999px",
                padding: "8px 24px",
                display: "flex",
              }}
            >
              <span style={{ fontSize: "18px", color: BRAND_CYAN, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {type === "docs" ? "Documentation" : type === "platform" ? "Platform" : type === "catalog" ? "Catalog" : "Docs"}
              </span>
            </div>
          </div>

          {/* Center: Title and description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
            <h1
              style={{
                fontSize: title.length > 40 ? "48px" : "56px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: "24px",
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {description.length > 120 ? `${description.slice(0, 117)}...` : description}
              </p>
            )}
          </div>

          {/* Bottom: URL and decorative elements */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: "20px", color: "#64748b" }}>docs.kopexa.com</span>

            {/* Decorative pixel elements */}
            <div style={{ display: "flex", gap: "8px" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: i % 2 === 0 ? BRAND_CYAN : `${BRAND_CYAN}50`,
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "100px",
            height: "100px",
            borderTop: `4px solid ${BRAND_CYAN}30`,
            borderRight: `4px solid ${BRAND_CYAN}30`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "100px",
            height: "100px",
            borderBottom: `4px solid ${BRAND_CYAN}30`,
            borderLeft: `4px solid ${BRAND_CYAN}30`,
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
