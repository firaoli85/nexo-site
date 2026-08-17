// THE SITE BOARD (D13) — renders docs/SITE_PROGRESS.json into a self-contained docs/SITE_BOARD.html.
//
// Zero external dependencies. Node only. Windows-safe paths. The generated HTML makes ZERO network
// requests (no webfonts, no CDN, no images) so it opens straight from file://.
//
// CONTRACT: docs/SITE_PROGRESS.json is the COMMITTED TRUTH; SITE_BOARD.html is a LOCAL RENDER and is
// gitignored. Regenerate at the end of every task: `npm run board`.
//
// D12 GUARD (challenge-to-test): validate() below fails LOUDLY (exit 1, naming the exact problem)
// rather than rendering a silently-wrong board. Malformed truth must never look like a healthy board.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_JSON = join(ROOT, "docs", "SITE_PROGRESS.json");
const SRC_FIXLOG = join(ROOT, "FIXLOG.md");
const OUT_HTML = join(ROOT, "docs", "SITE_BOARD.html");

// ── palette ──────────────────────────────────────────────────────────────────────────────────────
// MIRRORED from src/app/globals.css :root, NOT imported (this is standalone local tooling with no
// build step and no network). If the site tokens change, update these by hand. The board dogfoods the
// site palette so the HQ looks like the product it tracks.
const T = {
  bg: "#fafbfc", //          --bg
  surface: "#ffffff", //     --surface
  border: "#ebedf1", //      --border
  text: "#0c1512", //        --text          (17.9:1 on bg)
  muted: "#42544c", //       --text-muted    (7.78:1 on bg)
  subtle: "#4b5c53", //      --text-subtle   (6.86:1 on bg)
  accent: "#0b7d56", //      --accent        (5.1:1 on white)
  accentHover: "#0a6b49", // --accent-hover
  accentSubtle: "#e8f8f1", //--accent-subtle
  ink: "#0b1512", //         --ink
  inkSurface: "#12201b", //  --ink-surface
  onInk: "#e9f1ee", //       --on-ink        (16:1 on ink)
  onInkMuted: "#adbfb8", //  --on-ink-muted  (9.7:1 on ink)
  danger: "#c81e2c", //      --danger
  warning: "#b45309", //     --warning
  info: "#2563eb", //        --info
  disabled: "#b6c2ba", //    --text-disabled
};

// Status vocabulary. Colour is never the only cue: every dot is paired with its written label.
const STATUS = {
  done: { color: T.accent, label: "done" },
  "in-progress": { color: T.info, label: "in progress" },
  todo: { color: T.disabled, label: "todo" },
  blocked: { color: T.danger, label: "blocked" },
  deferred: { color: T.warning, label: "deferred" },
  rejected: { color: T.subtle, label: "rejected" },
};
const ITEM_STATUSES = Object.keys(STATUS);
const PHASE_STATUSES = ["todo", "in-progress", "done"];
const DISCOVERY_STATUSES = ["open", "scheduled", "resolved"];
const GATE_KEYS = ["tsc", "ci", "cube", "perfBudget"];

// ── D12 GUARD: validation ────────────────────────────────────────────────────────────────────────
function fail(msg) {
  console.error(`\n[board] INVALID docs/SITE_PROGRESS.json\n[board] ${msg}\n[board] Nothing was written. Fix the JSON and re-run \`npm run board\`.\n`);
  process.exit(1);
}

function validate(d) {
  if (!d || typeof d !== "object") fail("root is not an object.");
  for (const k of ["meta", "phases", "items", "decisions", "discoveries", "gates", "skills", "sessions"]) {
    if (!(k in d)) fail(`missing required top-level key: "${k}".`);
  }
  for (const k of ["updatedAt", "currentTask", "activePhase"]) {
    if (!d.meta?.[k]) fail(`meta.${k} is missing or empty.`);
  }
  for (const arr of ["phases", "items", "decisions", "discoveries", "sessions"]) {
    if (!Array.isArray(d[arr])) fail(`"${arr}" must be an array, got ${typeof d[arr]}.`);
  }
  const phaseIds = new Set();
  for (const p of d.phases) {
    for (const k of ["id", "title", "status", "items"]) if (!(k in p)) fail(`phase ${p.id ?? "(no id)"} is missing "${k}".`);
    if (!PHASE_STATUSES.includes(p.status)) fail(`phase ${p.id} has status "${p.status}"; allowed: ${PHASE_STATUSES.join(", ")}.`);
    if (!Array.isArray(p.items)) fail(`phase ${p.id}.items must be an array.`);
    if (phaseIds.has(p.id)) fail(`duplicate phase id "${p.id}".`);
    phaseIds.add(p.id);
  }
  const itemIds = new Set();
  for (const it of d.items) {
    for (const k of ["id", "phase", "title", "status"]) if (!(k in it)) fail(`item ${it.id ?? "(no id)"} is missing "${k}".`);
    if (!ITEM_STATUSES.includes(it.status)) fail(`item ${it.id} has status "${it.status}"; allowed: ${ITEM_STATUSES.join(", ")}.`);
    if (!phaseIds.has(it.phase)) fail(`item ${it.id} references unknown phase "${it.phase}".`);
    if (itemIds.has(it.id)) fail(`duplicate item id "${it.id}".`);
    itemIds.add(it.id);
  }
  for (const p of d.phases) {
    for (const ref of p.items) if (!itemIds.has(ref)) fail(`phase ${p.id} lists item "${ref}", which does not exist in items[].`);
  }
  if (!phaseIds.has(d.meta.activePhase)) fail(`meta.activePhase "${d.meta.activePhase}" is not a known phase id.`);
  for (const dec of d.decisions) {
    for (const k of ["id", "date", "title", "summary"]) if (!(k in dec)) fail(`decision ${dec.id ?? "(no id)"} is missing "${k}".`);
    if (dec.reversal) for (const k of ["was", "now", "why"]) if (!dec.reversal[k]) fail(`decision ${dec.id}.reversal is missing "${k}".`);
  }
  for (const disc of d.discoveries) {
    for (const k of ["id", "date", "text", "status"]) if (!(k in disc)) fail(`discovery ${disc.id ?? "(no id)"} is missing "${k}".`);
    if (!DISCOVERY_STATUSES.includes(disc.status)) fail(`discovery ${disc.id} has status "${disc.status}"; allowed: ${DISCOVERY_STATUSES.join(", ")}.`);
  }
  for (const g of GATE_KEYS) {
    if (!d.gates?.[g]) fail(`gates.${g} is missing.`);
    if (!d.gates[g].state) fail(`gates.${g}.state is missing or empty.`);
  }
  if (typeof d.skills?.audited !== "boolean") fail("skills.audited must be a boolean.");
  if (!Array.isArray(d.skills?.canonicalPicks)) fail("skills.canonicalPicks must be an array.");
  return d;
}

// ── FIXLOG parsing (the established "### YYYY-MM-DD — title" format) ─────────────────────────────
function parseFixlog(md, limit = 5) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let cur = null;
  for (const line of lines) {
    const h = /^###\s+(\d{4}-\d{2}-\d{2})\s*[—-]\s*(.+?)\s*$/.exec(line);
    if (h) {
      if (cur) out.push(cur);
      cur = { date: h[1], title: h[2], bullets: [] };
      continue;
    }
    if (cur) {
      const b = /^-\s+\*\*(.+?):\*\*\s*([\s\S]*)$/.exec(line);
      if (b) cur.bullets.push({ key: b[1], value: b[2].trim() });
    }
  }
  if (cur) out.push(cur);
  return out.slice(0, limit); // file is reverse-chronological: newest first
}

// ── html helpers ─────────────────────────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const dot = (status) => {
  const s = STATUS[status] ?? { color: T.disabled, label: status };
  return `<span class="dot" style="background:${s.color}" aria-hidden="true"></span><span class="st">${esc(s.label)}</span>`;
};

const gateTile = (name, g) => {
  const state = String(g.state);
  const color = state === "green" ? T.accent : state === "not-built" ? T.warning : state === "red" ? T.danger : T.subtle;
  const extra = g.cells ? `${g.cells} cells &middot; ${g.checks} checks` : "";
  return `<div class="tile">
      <div class="tile-name">${esc(name)}</div>
      <div class="tile-state" style="color:${color}">${esc(state)}</div>
      ${extra ? `<div class="tile-extra">${extra}</div>` : ""}
      <div class="tile-date">${esc(g.date || "not yet run")}</div>
      ${g.note ? `<div class="tile-note">${esc(g.note)}</div>` : ""}
    </div>`;
};

function render(d, fixlog) {
  const byId = Object.fromEntries(d.items.map((i) => [i.id, i]));
  const graveyard = d.items.filter((i) => i.status === "rejected" || i.status === "deferred");
  const live = d.items.filter((i) => !graveyard.includes(i));
  const openDisc = d.discoveries.filter((x) => x.status !== "resolved");
  const generated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const phaseBars = d.phases
    .map((p) => {
      const items = p.items.map((id) => byId[id]).filter(Boolean);
      const total = items.length || 1;
      const done = items.filter((i) => i.status === "done").length;
      const prog = items.filter((i) => i.status === "in-progress").length;
      const pct = Math.round((done / total) * 100);
      const progPct = Math.round((prog / total) * 100);
      const isActive = p.id === d.meta.activePhase;
      return `<div class="phase${isActive ? " active" : ""}">
        <div class="phase-head">
          <span class="phase-id">${esc(p.id)}</span>
          <span class="phase-title">${esc(p.title)}</span>
          <span class="phase-count">${done}/${items.length}</span>
        </div>
        <div class="bar" role="img" aria-label="${esc(p.id)}: ${done} of ${items.length} done">
          <span class="bar-done" style="width:${pct}%"></span><span class="bar-prog" style="width:${progPct}%"></span>
        </div>
      </div>`;
    })
    .join("\n");

  const ledger = d.phases
    .map((p) => {
      const rows = p.items
        .map((id) => byId[id])
        .filter((i) => i && live.includes(i))
        .map(
          (i) => `<tr>
            <td class="c-status">${dot(i.status)}</td>
            <td class="c-id">${esc(i.id)}</td>
            <td class="c-title">${esc(i.title)}${i.note ? `<div class="note">${esc(i.note)}</div>` : ""}</td>
            <td class="c-date">${esc(i.date || "")}${i.fixlogRef ? `<div class="note">${esc(i.fixlogRef)}</div>` : ""}</td>
          </tr>`,
        )
        .join("\n");
      if (!rows) return "";
      return `<h3 class="grp">${esc(p.id)} &middot; ${esc(p.title)}</h3>
      <table class="ledger"><tbody>${rows}</tbody></table>`;
    })
    .join("\n");

  const decisions = d.decisions
    .map((dec) => {
      const rev = dec.reversal
        ? `<div class="reversal">
            <div class="rev-row"><span class="rev-tag was">WAS</span><span>${esc(dec.reversal.was)}</span></div>
            <div class="rev-arrow" aria-hidden="true">&darr;</div>
            <div class="rev-row"><span class="rev-tag now">NOW</span><span>${esc(dec.reversal.now)}</span></div>
            <div class="rev-why"><strong>Why:</strong> ${esc(dec.reversal.why)}</div>
          </div>`
        : "";
      return `<div class="dcard${dec.reversal ? " dcard-rev" : ""}">
        <div class="dcard-head"><span class="did">${esc(dec.id)}</span><span class="dtitle">${esc(dec.title)}</span><span class="ddate">${esc(dec.date)}</span></div>
        <p class="dsum">${esc(dec.summary)}</p>
        ${rev}
      </div>`;
    })
    .join("\n");

  const fixlogHtml = fixlog
    .map(
      (f) => `<div class="fx">
        <div class="fx-head"><span class="fx-date">${esc(f.date)}</span><span class="fx-title">${esc(f.title)}</span></div>
        ${f.bullets
          .map((b) => `<div class="fx-b"><span class="fx-k">${esc(b.key)}</span><span class="fx-v">${esc(b.value.length > 260 ? b.value.slice(0, 260) + "..." : b.value)}</span></div>`)
          .join("")}
      </div>`,
    )
    .join("\n");

  const discHtml = openDisc
    .map(
      (x) => `<li class="disc disc-${esc(x.status)}">
        <span class="disc-tag">${esc(x.status)}</span>
        <span class="disc-id">${esc(x.id)}</span>
        <span class="disc-text">${esc(x.text)}</span>
      </li>`,
    )
    .join("\n");

  const graveHtml = graveyard.length
    ? graveyard
        .map(
          (g) => `<div class="grave">
          <div class="grave-head">${dot(g.status)}<span class="grave-title">${esc(g.title)}</span><span class="grave-date">${esc(g.date || "")}</span></div>
          <p class="grave-note">${esc(g.note)}</p>
        </div>`,
        )
        .join("\n")
    : `<p class="empty">Nothing rejected or deferred yet. Items land here permanently, never deleted.</p>`;

  const sessions = d.sessions
    .map((s) => `<li><span class="sess-date">${esc(s.date)}</span> ${esc(s.summary)}</li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nexo Site Board</title>
<style>
  /* Palette mirrored from src/app/globals.css (see board.mjs). System font stack only: the board makes
     zero network requests, so no webfonts. Hierarchy over density. */
  *{box-sizing:border-box}
  body{margin:0;background:${T.bg};color:${T.text};
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 22px 70px}
  h2{font-size:13px;letter-spacing:.09em;text-transform:uppercase;color:${T.subtle};
    margin:38px 0 12px;font-weight:700}
  h3.grp{font-size:14px;margin:20px 0 7px;color:${T.muted};font-weight:700}
  .card{background:${T.surface};border:1px solid ${T.border};border-radius:12px;padding:18px 20px}

  /* YOU ARE HERE */
  .here{background:${T.ink};border-radius:16px;padding:26px 28px;color:${T.onInk}}
  .here .chip{display:inline-block;background:${T.inkSurface};color:${T.onInkMuted};border:1px solid #35504a;
    border-radius:999px;padding:3px 11px;font-size:12px;font-weight:600;letter-spacing:.05em}
  .here .label{margin:14px 0 5px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${T.onInkMuted}}
  .here .task{font-size:26px;line-height:1.25;font-weight:700;margin:0;color:${T.onInk}}
  .here .sub{margin-top:12px;font-size:13px;color:${T.onInkMuted}}
  .here .sub b{color:${T.onInk};font-weight:600}

  /* phases */
  .phase{margin-bottom:13px}
  .phase.active .phase-id{background:${T.accent};color:#fff;border-color:${T.accent}}
  .phase-head{display:flex;align-items:center;gap:10px;margin-bottom:5px}
  .phase-id{display:inline-block;min-width:32px;text-align:center;border:1px solid ${T.border};
    border-radius:6px;padding:1px 6px;font-size:12px;font-weight:700;color:${T.muted};background:${T.surface}}
  .phase-title{flex:1;font-size:14px;color:${T.text}}
  .phase-count{font-size:12px;color:${T.subtle};font-variant-numeric:tabular-nums}
  .bar{height:8px;background:${T.border};border-radius:999px;overflow:hidden;display:flex}
  .bar-done{background:${T.accent};height:100%}
  .bar-prog{background:${T.info};height:100%;opacity:.55}

  /* ledger */
  table.ledger{width:100%;border-collapse:collapse}
  .ledger td{border-bottom:1px solid ${T.border};padding:9px 8px;vertical-align:top}
  .c-status{width:118px;white-space:nowrap}
  .c-id{width:66px;font-size:12px;color:${T.subtle};font-weight:600}
  .c-date{width:132px;font-size:12px;color:${T.subtle};text-align:right}
  .c-title{font-size:14px}
  .note{font-size:12px;color:${T.subtle};margin-top:3px;line-height:1.45}
  .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:baseline}
  .st{font-size:12px;color:${T.muted};font-weight:600}

  /* decisions */
  .dgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:12px}
  .dcard{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px 16px}
  .dcard-rev{border-color:${T.accent};background:${T.accentSubtle}}
  .dcard-head{display:flex;align-items:baseline;gap:9px;margin-bottom:6px}
  .did{font-size:12px;font-weight:700;color:#fff;background:${T.accent};border-radius:5px;padding:1px 7px}
  .dtitle{font-weight:700;font-size:14px;flex:1}
  .ddate{font-size:11px;color:${T.subtle}}
  .dsum{margin:0;font-size:13px;color:${T.muted}}
  .reversal{margin-top:11px;padding-top:11px;border-top:1px solid ${T.border}}
  .rev-row{display:flex;gap:9px;font-size:13px;margin:3px 0}
  .rev-tag{flex:none;font-size:11px;font-weight:700;border-radius:4px;padding:1px 6px;height:19px}
  .rev-tag.was{background:${T.border};color:${T.subtle}}
  .rev-tag.now{background:${T.accent};color:#fff}
  .rev-arrow{color:${T.accent};font-size:15px;margin:1px 0 1px 12px}
  .rev-why{margin-top:8px;font-size:12px;color:${T.muted}}

  /* fixlog */
  .fx{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:13px 16px;margin-bottom:9px}
  .fx-head{display:flex;gap:10px;align-items:baseline;margin-bottom:6px}
  .fx-date{font-size:11px;color:${T.subtle};font-variant-numeric:tabular-nums}
  .fx-title{font-weight:700;font-size:13px}
  .fx-b{display:flex;gap:9px;margin:3px 0;font-size:12px}
  .fx-k{flex:none;width:118px;color:${T.accent};font-weight:700}
  .fx-v{color:${T.muted};line-height:1.5}

  /* gates */
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
  .tile{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px 16px}
  .tile-name{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${T.subtle};font-weight:700}
  .tile-state{font-size:20px;font-weight:700;margin-top:4px}
  .tile-extra{font-size:12px;color:${T.muted};font-variant-numeric:tabular-nums}
  .tile-date{font-size:11px;color:${T.subtle};margin-top:2px}
  .tile-note{font-size:11px;color:${T.subtle};margin-top:6px;line-height:1.45}

  /* skills + discoveries + graveyard + sessions */
  ul.picks{margin:0;padding-left:18px;columns:2;column-gap:26px}
  ul.picks li{font-size:13px;color:${T.muted};margin-bottom:4px;break-inside:avoid}
  ul.discs{list-style:none;margin:0;padding:0}
  .disc{background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:10px 13px;margin-bottom:7px;
    display:flex;gap:10px;align-items:baseline}
  .disc-tag{flex:none;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
    border-radius:4px;padding:2px 7px;background:${T.border};color:${T.muted}}
  .disc-scheduled .disc-tag{background:${T.accentSubtle};color:${T.accentHover}}
  .disc-id{flex:none;font-size:11px;color:${T.subtle};font-weight:700;width:62px}
  .disc-text{font-size:13px;color:${T.muted}}
  .grave{border:1px dashed ${T.border};border-radius:9px;padding:11px 14px;margin-bottom:8px;background:${T.surface}}
  .grave-head{display:flex;gap:8px;align-items:baseline}
  .grave-title{flex:1;font-size:13px;font-weight:600;color:${T.muted}}
  .grave-date{font-size:11px;color:${T.subtle}}
  .grave-note{margin:6px 0 0;font-size:12px;color:${T.subtle};line-height:1.5}
  .empty{font-size:13px;color:${T.subtle};font-style:italic}
  ul.sess{list-style:none;margin:0;padding:0}
  ul.sess li{font-size:13px;color:${T.muted};padding:7px 0;border-bottom:1px solid ${T.border}}
  .sess-date{font-weight:700;color:${T.text};margin-right:8px;font-variant-numeric:tabular-nums}
  footer{margin-top:44px;padding-top:16px;border-top:1px solid ${T.border};font-size:11px;color:${T.subtle}}
  @media (max-width:720px){ul.picks{columns:1}.here .task{font-size:21px}}
</style>
</head>
<body>
<div class="wrap">

  <div class="here">
    <span class="chip">${esc(d.meta.activePhase)} &middot; branch ${esc(d.meta.branch || "v2")}</span>
    <div class="label">You are here</div>
    <p class="task">${esc(d.meta.currentTask)}</p>
    <div class="sub">Updated <b>${esc(d.meta.updatedAt)}</b> &middot; ${esc(d.items.filter((i) => i.status === "done").length)} items done &middot; ${esc(openDisc.length)} open or scheduled discoveries</div>
  </div>

  <h2>Phases</h2>
  <div class="card">${phaseBars}</div>

  <h2>Plan ledger</h2>
  ${ledger}

  <h2>Decisions</h2>
  <div class="dgrid">${decisions}</div>

  <h2>Latest FIXLOG entries</h2>
  ${fixlogHtml || `<p class="empty">No FIXLOG entries parsed.</p>`}

  <h2>Gates</h2>
  <div class="tiles">
    ${gateTile("tsc", d.gates.tsc)}
    ${gateTile("CI", d.gates.ci)}
    ${gateTile("QA cube", d.gates.cube)}
    ${gateTile("perf budget", d.gates.perfBudget)}
  </div>

  <h2>Skills</h2>
  <div class="card">
    <p style="margin:0 0 10px;font-size:13px;color:${T.muted}">
      Audited <b>${esc(d.skills.date)}</b> &middot; ${esc(d.skills.counts?.project ?? "?")} project / ${esc(d.skills.counts?.user ?? "?")} user / ${esc(d.skills.counts?.plugin ?? "?")} plugin skills &middot; ${esc(d.skills.counts?.mcpServers ?? "?")} MCP servers &middot; see ${esc(d.skills.registryRef)}
    </p>
    <ul class="picks">${d.skills.canonicalPicks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
  </div>

  <h2>Discovery inbox</h2>
  <ul class="discs">${discHtml || `<p class="empty">Inbox clear.</p>`}</ul>

  <h2>The graveyard</h2>
  <p style="font-size:12px;color:${T.subtle};margin:0 0 10px">Rejected and deferred items are kept here permanently, with their reasons. Nothing is ever deleted.</p>
  ${graveHtml}

  <h2>Sessions</h2>
  <div class="card"><ul class="sess">${sessions}</ul></div>

  <footer>
    Generated ${esc(generated)} by scripts/board.mjs &middot; sources: docs/SITE_PROGRESS.json (committed truth), FIXLOG.md.<br>
    This file is a LOCAL RENDER and is gitignored. Regenerate with <code>npm run board</code>.
  </footer>
</div>
</body>
</html>`;
}

// ── main ─────────────────────────────────────────────────────────────────────────────────────────
function main() {
  const jsonPath = process.argv[2] ? resolve(process.argv[2]) : SRC_JSON;
  let raw;
  try {
    raw = readFileSync(jsonPath, "utf8");
  } catch {
    fail(`cannot read ${jsonPath}.`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    fail(`not valid JSON: ${e.message}`);
  }
  const data = validate(parsed);

  let fixlog = [];
  try {
    fixlog = parseFixlog(readFileSync(SRC_FIXLOG, "utf8"), 5);
  } catch {
    console.warn("[board] FIXLOG.md not readable; rendering without the FIXLOG panel.");
  }

  // --check mode: validate only (used by the negative test and by any future preflight).
  if (process.argv.includes("--check")) {
    console.log(`[board] OK: ${jsonPath} is valid (${data.phases.length} phases, ${data.items.length} items, ${data.decisions.length} decisions, ${data.discoveries.length} discoveries).`);
    return;
  }

  writeFileSync(OUT_HTML, render(data, fixlog), "utf8");
  const kb = (Buffer.byteLength(readFileSync(OUT_HTML)) / 1024).toFixed(1);
  console.log(`[board] wrote docs/SITE_BOARD.html (${kb} KB) — ${data.phases.length} phases, ${data.items.length} items, ${fixlog.length} FIXLOG entries.`);
  console.log(`[board] open it from file:// — it is a local render and is gitignored.`);
}

main();
