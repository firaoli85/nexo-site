"use client";

import { useState } from "react";

// Dev-only preview switcher. A client component so the /email-preview page stays STATIC (no
// searchParams / dynamic APIs). Each email renders isolated in an <iframe srcDoc> so its inlined
// email styles never leak into (or inherit from) the surrounding page.
type Sample = { key: string; subject: string; html: string; text: string };

const box: React.CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
  padding: "28px 16px 64px",
  fontFamily: "-apple-system, 'Segoe UI', system-ui, sans-serif",
  color: "#0c1512",
};
const tab = (active: boolean): React.CSSProperties => ({
  padding: "7px 13px",
  marginRight: 8,
  marginBottom: 8,
  border: active ? "1px solid #0b7d56" : "1px solid #dcdfe4",
  background: active ? "#e8f8f1" : "#ffffff",
  color: active ? "#0a6b49" : "#42544c",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
});

export function PreviewClient({ samples }: { samples: Sample[] }) {
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"html" | "text">("html");
  const s = samples[i] ?? samples[0];

  return (
    <div style={box}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Transactional email templates</h1>
      <p style={{ fontSize: 14, color: "#42544c", margin: "0 0 16px" }}>
        Dev-only preview. This route returns 404 in production. Sample data is obviously fake.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {samples.map((x, idx) => (
          <button key={x.key} type="button" aria-pressed={idx === i} onClick={() => setI(idx)} style={tab(idx === i)}>
            {x.key}
          </button>
        ))}
      </div>

      <div style={{ margin: "10px 0 12px", fontSize: 14 }}>
        <span style={{ color: "#4b5c53" }}>subject: </span>
        <code style={{ background: "#f3f5f8", padding: "2px 6px", borderRadius: 4 }}>{s.subject}</code>
      </div>

      <div style={{ display: "flex", marginBottom: 12 }}>
        <button type="button" aria-pressed={mode === "html"} onClick={() => setMode("html")} style={tab(mode === "html")}>
          HTML
        </button>
        <button type="button" aria-pressed={mode === "text"} onClick={() => setMode("text")} style={tab(mode === "text")}>
          Plain text
        </button>
      </div>

      {mode === "html" ? (
        // key={s.key} forces React to MOUNT A FRESH iframe per variant instead of reusing one DOM node
        // and mutating its `srcdoc` attribute. Reloading an iframe on a `srcdoc` attribute change is
        // browser/version-dependent (Chrome reloads; other engines keep the first-loaded document), which
        // is why the tab style updated but the rendered email stayed on visitorAck. A fresh iframe always
        // loads its srcDoc from scratch, in every browser.
        <iframe
          key={s.key}
          title={`${s.key} email preview`}
          srcDoc={s.html}
          style={{ width: "100%", height: 820, border: "1px solid #ebedf1", borderRadius: 10, background: "#ffffff" }}
        />
      ) : (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            background: "#f6f7f9",
            border: "1px solid #ebedf1",
            borderRadius: 10,
            padding: 20,
            fontSize: 13,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {s.text}
        </pre>
      )}
    </div>
  );
}
