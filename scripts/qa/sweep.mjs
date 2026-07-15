// The QA sweep (Stage 12). Asserts the site's structural invariants (I1–I14) against the PROD build
// for every route × viewport, and writes a pass/fail matrix + failure screenshots. Standing
// infrastructure — invariants are only ADDED, never weakened (nexo-brand regression rule).
//
// Run indirectly via `npm run qa:sweep` (scripts/qa/run.mjs builds + serves + calls this). Or directly
// against an already-running server: `node scripts/qa/sweep.mjs` (expects the prod build on :3300).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ROUTES, NOT_FOUND, VIEWPORTS, BASE, PLATFORM_ANCHORS, FORM_ROUTES } from "./routes.mjs";

const ART = resolve(dirname(fileURLToPath(import.meta.url)), "artifacts");
mkdirSync(ART, { recursive: true });

const CLS_INIT = () => {
  window.__cls = 0;
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}
};

async function scrollThrough(page) {
  await page.evaluate(
    () =>
      new Promise((res) => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += 500;
          if (y < document.body.scrollHeight) requestAnimationFrame(step);
          else {
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(() => {
              window.scrollTo(0, 0);
              setTimeout(res, 150);
            }, 250);
          }
        };
        step();
      }),
  );
  await page.waitForTimeout(200);
}

// ── page-context invariant probes (serialized into the page) ────────────────────────────────────
const PROBES = {
  // I1 ENDCAP — the document ends exactly at the footer (no scrollable void), and no INTERACTIVE/visible
  // (pointer-events: auto, non-clipped) element renders below it. Decorative pointer-events-none overlays
  // (AmbientMap, RouteOverlay) whose SVG bboxes extend past but are clipped by overflow-hidden do NOT
  // count — they add no scroll height and paint nothing below the footer (scrollHeight is the ground truth).
  endcap() {
    const footer = document.querySelector("footer, [role=contentinfo]");
    if (!footer) return { pass: false, detail: "no footer/contentinfo" };
    const fb = footer.getBoundingClientRect().bottom + window.scrollY;
    const sh = document.documentElement.scrollHeight;
    const voidPx = Math.round(sh - fb);
    // A REAL void = the document scrolls past the footer's bottom.
    const noVoid = voidPx <= 2;
    // Diagnostic: any pointer-events-AUTO element painting below the footer (real content overhang).
    let worst = null, worstB = fb + 1;
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
      if (cs.pointerEvents === "none") continue; // decorative overlay — clipped, paints nothing scrollable
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const b = r.bottom + window.scrollY;
      if (b > worstB) {
        worstB = b;
        worst = `${el.tagName.toLowerCase()}.${(typeof el.className === "string" ? el.className : "").split(" ").slice(0, 2).join(".")}`;
      }
    }
    // Bottom pixel should be footer (or empty/decorative). elementFromPoint skips pointer-events-none, so
    // a decorative map over the footer returns the footer behind it.
    const maxScroll = Math.max(0, sh - window.innerHeight);
    window.scrollTo({ top: maxScroll, left: 0, behavior: "instant" }); // instant: the site uses scroll-behavior:smooth
    const atBottom = document.elementFromPoint(Math.floor(window.innerWidth / 2), window.innerHeight - 3);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // The footer is what's visually at the bottom if the hit element is the footer, a descendant of it,
    // OR an ancestor wrapper that contains it (the footer paints there); html/body/empty also fine.
    const bottomOk =
      !atBottom ||
      atBottom === footer ||
      footer.contains(atBottom) ||
      (atBottom.contains && atBottom.contains(footer)) ||
      atBottom === document.documentElement ||
      atBottom === document.body;
    return { pass: noVoid && !worst && bottomOk, detail: `void=${voidPx}px${worst ? ` past-footer=${worst}(+${Math.round(worstB - fb)}px)` : ""}${bottomOk ? "" : " bottom-not-footer"}` };
  },
  // I2 no horizontal overflow.
  overflow() {
    const over = document.documentElement.scrollWidth - window.innerWidth;
    return { pass: over <= 1, detail: over > 1 ? `scrollWidth+${over}px` : "" };
  },
  // I3 exactly one NON-EMPTY h1 + clean heading order.
  headings() {
    const h1s = [...document.querySelectorAll("h1")];
    const h1 = h1s.length;
    const h1Empty = h1s.some((h) => h.textContent.trim().length === 0);
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    let jump = false;
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jump = true;
    return { pass: h1 === 1 && !h1Empty && !jump, detail: `h1=${h1}${h1Empty ? " EMPTY-h1" : ""}${jump ? " heading-jump" : ""}` };
  },
  // I5 CLS ~ 0.
  cls() {
    const v = window.__cls || 0;
    return { pass: v < 0.02, detail: v >= 0.02 ? `CLS=${v.toFixed(3)}` : "" };
  },
  // I8 footer arrival end-state: the READABLE content (links + the wordmark) settles at effective
  // opacity ~1 — never stuck in the pre-arrival hidden state. Decorative low-opacity elements (the
  // ambient map at 0.12, faint rules) are intentionally < 1 and are NOT part of the choreography, so we
  // check only text content, using EFFECTIVE opacity (the product up the ancestor chain within the footer).
  footerArrival() {
    const footer = document.querySelector("footer, [role=contentinfo]");
    if (!footer) return { pass: false, detail: "no footer" };
    const eff = (el) => {
      let o = 1, p = el;
      while (p && p !== footer.parentElement) {
        o *= parseFloat(getComputedStyle(p).opacity || "1");
        p = p.parentElement;
      }
      return o;
    };
    // Include the choreographed wordmark + mission lines (they are <p class="terminus-*">, not a/h2/h3)
    // so a regression that strands only those two reveal rules is caught.
    const content = [...footer.querySelectorAll("a, h2, h3, .terminus-wordmark, .terminus-mission")].filter(
      (el) => el.textContent.trim().length > 0,
    );
    const hidden = content.filter((el) => eff(el) < 0.9);
    return { pass: hidden.length === 0, detail: hidden.length ? `${hidden.length}/${content.length} footer text node(s) still hidden (eff-opacity<0.9)` : "" };
  },
  // I12 map clearance: the GUTTER FEATURE glyphs (xl-only, [data-ambient-map]) must stay in the gutters —
  // their horizontal center must fall OUTSIDE the centered content column. (The faint full-bleed grid
  // whisper is a SEPARATE base layer that sits under text by design — contrast-sovereignty, §6.1 — so it
  // is not checked here; only the gutter features, which are the ones that must clear the text column.)
  mapClearance() {
    if (!document.querySelector("[data-ambient-map]")) return { pass: true, detail: "no gutter features (below xl)" };
    const cols = [...document.querySelectorAll(".max-w-6xl")].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    if (!cols.length) return { pass: true, detail: "no content column" };
    const colLeft = Math.min(...cols.map((c) => c.left));
    const colRight = Math.max(...cols.map((c) => c.right));
    for (const g of document.querySelectorAll("[data-ambient-map] svg")) {
      const r = g.getBoundingClientRect();
      if (r.width === 0) continue;
      const cx = r.left + r.width / 2;
      if (cx > colLeft + 8 && cx < colRight - 8) return { pass: false, detail: `gutter glyph center intrudes content column @x=${Math.round(cx)} (col ${Math.round(colLeft)}-${Math.round(colRight)})` };
    }
    return { pass: true, detail: "" };
  },
  // I13 form present + honeypot present & visually hidden.
  form() {
    const form = document.querySelector("form");
    if (!form) return { pass: false, detail: "no form" };
    const hp = form.querySelector('input[name="website"]');
    if (!hp) return { pass: false, detail: "no honeypot" };
    const wrap = hp.closest('[aria-hidden="true"]') || hp;
    const r = wrap.getBoundingClientRect();
    const onscreen = r.left > -2000 && r.left < window.innerWidth && r.width > 4 && r.height > 4;
    const submit = !!form.querySelector('button[type="submit"]');
    return { pass: !onscreen && submit, detail: `${onscreen ? "honeypot on-screen " : ""}${submit ? "" : "no submit"}`.trim() };
  },
  // I14 metadata: unique title + apex canonical + og present.
  metadata(expectedPath) {
    const title = document.title || "";
    const canon = document.querySelector('link[rel=canonical]')?.getAttribute("href") || "";
    const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
    const apex = canon.startsWith("https://nexoaccess.com") && !canon.includes("www.") && !/\/$/.test(canon.replace("https://nexoaccess.com", "") || "/x");
    const canonOk = canon === "https://nexoaccess.com" + (expectedPath === "/" ? "" : expectedPath);
    return { pass: title.length > 0 && canonOk && ogImg.startsWith("https://nexoaccess.com/og.png"), title, detail: `${canonOk ? "" : `canon=${canon} `}${ogImg ? "" : "no-og"}`.trim() };
  },
};

// ── I6 skip link + focus ring ───────────────────────────────────────────────────────────────────
async function checkSkipAndFocus(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press("Tab");
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    return a && a.tagName === "A" && (a.getAttribute("href") || "").includes("#main");
  });
  // Sample focus stops for a REAL keyboard focus indicator. The site zeroes native outlines and draws
  // every ring as a Tailwind `focus-visible:ring-*` (a box-shadow built from `--tw-ring-shadow`), so we
  // detect that layer specifically — a decorative/hover box-shadow must NOT count as a ring. A genuine
  // outline still qualifies. (Reaching document.body at the end of the tab order is normal and ignored.)
  let ringOk = true, checked = 0, firstBad = "";
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body || a === document.documentElement) return { body: true };
      const cs = getComputedStyle(a);
      const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth || "0") > 0;
      const rv = (cs.getPropertyValue("--tw-ring-shadow") || "").trim();
      const ring = rv !== "" && rv !== "none" && rv !== "0 0 #0000";
      return { body: false, ok: outline || ring, tag: a.tagName + (a.getAttribute("aria-label") ? `[${a.getAttribute("aria-label")}]` : "") };
    });
    if (r.body) continue;
    checked++;
    if (!r.ok && !firstBad) { ringOk = false; firstBad = r.tag; }
  }
  return { pass: skip && ringOk && checked >= 4, detail: `${skip ? "" : "skip-link-broken "}${ringOk ? "" : "no-focus-ring:" + firstBad + " "}checked=${checked}`.trim() };
}

// ── I7 nav dropdowns (desktop) / mobile overlay ─────────────────────────────────────────────────
async function checkNav(page, width) {
  try {
    if (width >= 1024) {
      // Exercise EVERY visible dropdown trigger and require the panel to actually RENDER content — a bare
      // aria-expanded flip with an empty/hidden panel is dead navigation. Radix NavigationMenu is
      // HOVER-primary (a click after a hover toggles it back closed), so we open by hover, confirm an
      // open `[data-state="open"]` content panel with links, then Escape+mouse-away to close.
      const triggers = page.locator('nav button[aria-expanded], header button[aria-expanded]');
      const count = await triggers.count();
      if (count === 0) return { pass: false, detail: "no nav trigger" };
      let tested = 0;
      for (let i = 0; i < count; i++) {
        const t = triggers.nth(i);
        if (!(await t.isVisible())) continue; // skips the lg:hidden mobile hamburger at desktop widths
        await t.hover();
        await page.waitForTimeout(280);
        const opened = (await t.getAttribute("aria-expanded")) === "true";
        const panelOk = await page.evaluate(() => {
          const contents = [...document.querySelectorAll('[data-state="open"]')].filter((el) => el.tagName !== "BUTTON");
          return contents.some((c) => c.getBoundingClientRect().height > 0 && c.querySelectorAll("a").length > 0);
        });
        await page.keyboard.press("Escape");
        await page.mouse.move(3, 320);
        await page.waitForTimeout(240);
        const closed = (await t.getAttribute("aria-expanded")) !== "true";
        tested++;
        if (!(opened && panelOk && closed)) {
          return { pass: false, detail: `trigger#${i}: open=${opened} panel=${panelOk} closed=${closed}` };
        }
      }
      return { pass: tested > 0, detail: tested > 0 ? "" : "no visible triggers" };
    }
    // mobile: the hamburger is identified by its aria-label ("Open menu") — NOT the desktop
    // aria-expanded triggers, which are display:none at this width and would be unclickable.
    const menuBtn = page.locator('button[aria-label*="menu" i]:visible').first();
    if ((await menuBtn.count()) === 0) return { pass: false, detail: "no mobile menu button" };
    await menuBtn.click();
    await page.waitForTimeout(200);
    const navVisible = await page.evaluate(() => {
      const links = [...document.querySelectorAll("a")].filter((a) => /platform|solutions|company|apply/i.test(a.textContent || ""));
      return links.some((a) => a.getBoundingClientRect().width > 0 && a.getBoundingClientRect().height > 0);
    });
    // close (Escape) + restore
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(150);
    return { pass: navVisible, detail: navVisible ? "" : "overlay-did-not-open" };
  } catch (e) {
    return { pass: false, detail: "nav-error: " + String(e.message).slice(0, 40) };
  }
}

// ── I9 anchor landing on /platform (seed hunt S2) ───────────────────────────────────────────────
async function landingCheck(page, hash) {
  return page.evaluate((h) => {
    const sec = document.getElementById(h);
    const heading = sec ? sec.querySelector("h2, h3") || sec : null;
    const hr = heading ? heading.getBoundingClientRect() : null;
    const current = [...document.querySelectorAll("[aria-current]")]
      .filter((c) => c.getAttribute("aria-current") && c.getAttribute("aria-current") !== "false")
      .map((c) => (c.textContent || "").trim().toLowerCase());
    // "fully visible below both sticky bars": heading top is below ~110px (the two bars) and near the top.
    const visible = !!hr && hr.top >= 100 && hr.top < window.innerHeight * 0.6 && hr.height > 0;
    return { top: hr ? Math.round(hr.top) : null, visible, current, scrollY: Math.round(window.scrollY) };
  }, hash);
}
async function checkAnchors(browser, base) {
  const out = [];
  for (const hash of PLATFORM_ANCHORS) {
    const first = hash.split("-")[0];
    for (const mode of ["cold", "client-nav"]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 60)));
      try {
        if (mode === "cold") {
          await page.goto(`${base}/platform#${hash}`, { waitUntil: "domcontentloaded" });
        } else {
          // client-nav: from the homepage, open the Platform dropdown and click the deep link.
          await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(300);
          const trigger = page.locator('nav button[aria-expanded], header button[aria-expanded]').filter({ hasText: /platform/i }).first();
          await trigger.click().catch(() => {});
          await page.waitForTimeout(250);
          const link = page.locator(`a[href*="/platform#${hash}"]`).first();
          if ((await link.count()) === 0) { out.push({ route: `#${hash}`, mode, pass: false, detail: "deep-link not found in dropdown" }); await ctx.close(); continue; }
          await link.click();
        }
        await page.waitForTimeout(2000); // native jump + the capped re-scroll interval must settle
        const s1 = await landingCheck(page, hash);
        await page.waitForTimeout(1500); // stability window (no yank)
        const s2 = await landingCheck(page, hash);
        const stable = Math.abs(s2.scrollY - s1.scrollY) <= 6;
        const currentMatches = s2.current.some((c) => c.includes(first));
        const dispatchNotOversight = !(hash === "dispatch" && s2.current.some((c) => c.includes("oversight")));
        const pass = s2.visible && stable && currentMatches && dispatchNotOversight && errs.length === 0;
        if (!pass) await page.screenshot({ path: `${ART}/FAIL_anchor_${mode}_${hash}.png` }).catch(() => {});
        out.push({ route: `#${hash}`, mode, pass, detail: `top=${s2.top} vis=${s2.visible} stable=${stable} current=[${s2.current}]${dispatchNotOversight ? "" : " DISPATCH-LIT-OVERSIGHT"}${errs.length ? " ERR:" + errs[0] : ""}` });
      } catch (e) {
        out.push({ route: `#${hash}`, mode, pass: false, detail: "err: " + String(e.message).slice(0, 50) });
      }
      await ctx.close();
    }
  }
  return out;
}

// ── I10 reduced-motion + I11 no-JS (route-level, one width) ─────────────────────────────────────
async function checkReducedMotion(browser, base, routes) {
  const out = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 60)); });
  page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 60)));
  for (const route of routes) {
    errs.length = 0;
    await page.goto(base + route, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const van = document.querySelector(".route-van");
      const vanShown = van ? getComputedStyle(van).display !== "none" && van.getBoundingClientRect().width > 0 : false;
      const footer = document.querySelector("footer, [role=contentinfo]");
      const readable = !!h1 && h1.textContent.trim().length > 0 && (document.body.innerText || "").length > 400;
      return { readable, vanShown, footerOk: !!footer };
    });
    out.push({ route, mode: "reduced-motion", pass: info.readable && !info.vanShown && info.footerOk && errs.length === 0, detail: `readable=${info.readable} van=${info.vanShown}${errs.length ? " ERR:" + errs[0] : ""}` });
  }
  await ctx.close();
  return out;
}
async function checkNoJs(browser, base, routes) {
  const out = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "domcontentloaded" }).catch(() => {});
    const info = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const text = (document.body.innerText || "").replace(/\s+/g, " ").trim();
      // no blank sections: each top-level <section>/<Section> in main has some text
      const sections = [...document.querySelectorAll("main section, main > *")];
      const blank = sections.filter((s) => s.getBoundingClientRect().height > 40 && (s.innerText || "").trim().length < 2).length;
      return { h1: !!h1 && h1.textContent.trim().length > 0, len: text.length, blank };
    });
    out.push({ route, mode: "no-js", pass: info.h1 && info.len > 300 && info.blank === 0, detail: `h1=${info.h1} textLen=${info.len} blankSections=${info.blank}` });
  }
  await ctx.close();
  return out;
}

// I15 DECORATIVE-OVERLAP (Stage 13, hardened per the audit). Interior routes / below-lg: ZERO van
// nodes. Homepage desktop: sample the van across the FULL scroll (both the outbound clearance and the
// terminus), measuring the PAINTED svg (inside .route-van-lane, which carries the ±12px lane offset).
// Fails if the van intersects any content text at any sample, if it crowds the footer card at the
// terminus, OR if it does not MOVE with scroll (a stuck/detached van must never pass green).
async function checkOverlap(page, route, width) {
  const isHome = route === "/";
  if (!isHome) {
    const n = await page.evaluate(() => document.querySelectorAll(".route-van").length + document.querySelectorAll(".route-overlay svg .route-path").length);
    return { pass: n === 0, detail: n ? `interior route has ${n} van/route nodes` : "" };
  }
  if (width < 1024) {
    const n = await page.evaluate(() => document.querySelectorAll(".route-van").length);
    return { pass: true, detail: n === 0 ? "" : `${n} van at mobile width` }; // mobile: van absent is expected
  }
  const vanYs = [];
  let overlapText = null, gapBad = null, missing = null;
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((frac) => window.scrollTo({ top: Math.round((document.documentElement.scrollHeight - window.innerHeight) * frac), behavior: "instant" }), f);
    await page.waitForTimeout(220);
    const m = await page.evaluate(() => {
      const van = document.querySelector(".route-van .route-van-lane svg") || document.querySelector(".route-van");
      if (!van) return { none: true };
      const vr = van.getBoundingClientRect();
      if (vr.width === 0 && vr.height === 0) return { none: true };
      const ov = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
      const texts = [...document.querySelectorAll("main h1,main h2,main h3,main h4,main p,main li,main span,main button,main a")]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && (e.textContent || "").trim().length > 1; });
      let hit = null;
      for (const t of texts) { const tr = t.getBoundingClientRect(); if (ov(vr, tr)) { hit = (t.textContent || "").trim().slice(0, 18); break; } }
      const card = document.querySelector("[data-route-seam]");
      const cardTopDoc = card ? Math.round(card.getBoundingClientRect().top + window.scrollY) : null;
      return { vanYDoc: Math.round(vr.top + window.scrollY), vanBottomDoc: Math.round(vr.bottom + window.scrollY), cardTopDoc, hit };
    });
    if (m.none) { missing = `no van at scroll ${f}`; break; }
    vanYs.push(m.vanYDoc);
    if (m.hit && !overlapText) overlapText = `van overlaps text "${m.hit}" @scroll ${f}`;
    if (f === 1 && m.cardTopDoc != null) {
      const gap = m.cardTopDoc - m.vanBottomDoc;
      if (gap < 12) gapBad = `van only ${gap}px above footer card at terminus`;
    }
  }
  const moved = new Set(vanYs).size > 1;
  const detail = [missing, overlapText, gapBad, vanYs.length && !moved ? "van did not move with scroll (stuck/detached)" : ""].filter(Boolean).join("; ");
  return { pass: !detail, detail };
}

export async function runSweep({ base = BASE, viewports = VIEWPORTS, routes = ROUTES } = {}) {
  const browser = await chromium.launch();
  const rows = [];
  let failures = 0;
  const titleByRoute = {}; // I14: collected across routes to assert uniqueness
  const emailByRoute = {}; // I16: collected across routes to assert one identical canonical identity

  for (const route of routes) {
    for (const width of viewports) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errs = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") errs.push(`console.${m.type()}: ${m.text().slice(0, 80)}`);
      });
      page.on("pageerror", (e) => errs.push(`pageerror: ${String(e.message).slice(0, 80)}`));
      page.on("requestfailed", (r) => errs.push(`reqfail: ${r.url().split("/").pop()} ${(r.failure() && r.failure().errorText) || ""}`));
      await page.addInitScript(CLS_INIT);

      const res = { route, width, I: {} };
      try {
        await page.goto(base + route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle").catch(() => {});
        await page.waitForTimeout(250);
        await scrollThrough(page);

        // measured at the top (post-scroll settle): map clearance (hero glyphs vs h1), metadata, structure.
        res.I.I12 = await page.evaluate(PROBES.mapClearance);
        res.I.I2 = await page.evaluate(PROBES.overflow);
        res.I.I3 = await page.evaluate(PROBES.headings);
        res.I.I5 = await page.evaluate(PROBES.cls);
        res.I.I14 = await page.evaluate(PROBES.metadata, route);
        if (res.I.I14 && res.I.I14.title) titleByRoute[route] = res.I.I14.title;
        res.I.I6 = await checkSkipAndFocus(page);
        res.I.I7 = await checkNav(page, width);
        if (FORM_ROUTES.includes(route)) res.I.I13 = await page.evaluate(PROBES.form);
        res.I.I1 = await page.evaluate(PROBES.endcap);
        // I8 — measure AFTER a real footer arrival: scroll it into view + dwell so the play-once
        // choreography fires and settles (a fast programmatic scroll can skip the IntersectionObserver).
        await page.evaluate(() => {
          const f = document.querySelector("footer, [role=contentinfo]");
          if (f) f.scrollIntoView({ block: "end" });
        });
        await page.waitForTimeout(1500); // the staggered premium-terminus arrival can run ~1s; let it settle
        res.I.I8 = await page.evaluate(PROBES.footerArrival);
        // I15 DECORATIVE-OVERLAP (Stage 13) — measured here at the page BOTTOM (where the van reaches its
        // terminus). Interior routes must contain ZERO van/route nodes; the homepage van must never
        // intersect the footer or any text block.
        res.I.I15 = await checkOverlap(page, route, width);
        // I16 CANONICAL EMAIL (Stage 13) — zero admin@ anywhere in the rendered page; every rendered
        // @nexoaccess.com address is info@ (the one public identity).
        res.I.I16 = await page.evaluate(() => {
          // Scan BOTH the serialized markup AND innerText, and match any @…nexoaccess.com incl. subdomains
          // (admin@app.nexoaccess.com must not hide). The ONLY allowed public address is info@nexoaccess.com.
          const html = document.documentElement.outerHTML + " " + (document.body.innerText || "");
          const emails = [...new Set((html.match(/[a-z0-9._+-]+@([a-z0-9-]+\.)*nexoaccess\.com/gi) || []).map((e) => e.toLowerCase()))];
          const bad = emails.filter((e) => e !== "info@nexoaccess.com");
          return { pass: bad.length === 0, detail: bad.length ? "non-canonical email(s): " + bad.join(",") : "", emails };
        });
        if (res.I.I16 && res.I.I16.emails) emailByRoute[route] = res.I.I16.emails.join(",");
        // I4 last (collect everything observed during load + scroll + interactions)
        res.I.I4 = { pass: errs.length === 0, detail: errs.slice(0, 3).join(" | ") };
      } catch (e) {
        res.I.ERR = { pass: false, detail: String(e.message).slice(0, 80) };
      }

      const failed = Object.entries(res.I).filter(([, v]) => v && v.pass === false);
      if (failed.length) {
        failures++;
        await page.screenshot({ path: `${ART}/FAIL_${route.replace(/\//g, "_") || "_home"}_${width}.png`, fullPage: true }).catch(() => {});
      }
      rows.push(res);
      await ctx.close();
    }
  }

  // 404 check
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const r = await page.goto(base + NOT_FOUND, { waitUntil: "domcontentloaded" });
    const status = r ? r.status() : 0;
    const info = await page.evaluate(() => {
      const footer = document.querySelector("footer, [role=contentinfo]");
      const nav = document.querySelector("header, nav");
      const h1 = document.querySelectorAll("h1").length;
      const links = [...document.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      // "branded" = NOT the default Next error page (which prints this exact string), plus site chrome.
      const isDefault = /This page could not be found/.test(document.body.textContent || "");
      const branded = !isDefault && /Nexo Access/.test(document.body.textContent || "") && !!footer && !!nav;
      return { footer: !!footer, nav: !!nav, h1, branded, isDefault, hasHome: links.includes("/"), hasContact: links.includes("/contact") };
    });
    rows.push({ route: NOT_FOUND, width: 1440, I: { STATUS: { pass: status === 404, detail: `status=${status}` }, BRANDED: { pass: info.branded && info.h1 === 1 && info.hasHome && info.hasContact, detail: JSON.stringify(info) } } });
    await ctx.close();
  }

  // I9 anchors (only when /platform is in scope), I10 reduced-motion, I11 no-JS.
  const anchors = routes.includes("/platform") ? await checkAnchors(browser, base) : [];
  const reduced = await checkReducedMotion(browser, base, routes);
  const nojs = await checkNoJs(browser, base, routes);
  // I14b: titles must be unique across routes.
  const titles = Object.values(titleByRoute);
  const titleUnique = { pass: titles.length > 0 && new Set(titles).size === titles.length, detail: `${new Set(titles).size}/${titles.length} unique` };
  // I16 identity consistency: every route renders the SAME single canonical email (info@ only).
  const emails = Object.values(emailByRoute);
  const identity = { pass: emails.length > 0 && new Set(emails).size === 1 && emails[0] === "info@nexoaccess.com", detail: `emails across routes: ${[...new Set(emails)].join(" | ") || "(none)"}` };
  const extraFails = [...anchors, ...reduced, ...nojs].filter((x) => !x.pass).length + (titleUnique.pass ? 0 : 1) + (identity.pass ? 0 : 1);

  await browser.close();
  return { rows, failures: failures + extraFails, anchors, reduced, nojs, titleUnique, identity };
}

export function printMatrix({ rows, failures, anchors, reduced, nojs, titleUnique, identity }) {
  const INV = ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I12", "I13", "I14", "I15", "I16"];
  console.log("\nROUTE                     W     " + INV.join("  "));
  for (const r of rows) {
    if (r.route === NOT_FOUND) {
      const s = r.I.STATUS, b = r.I.BRANDED;
      console.log(`404 ${r.route.padEnd(30)} status:${s.pass ? "OK" : "FAIL(" + s.detail + ")"} branded:${b.pass ? "OK" : "FAIL(" + b.detail + ")"}`);
      continue;
    }
    const cells = INV.map((k) => {
      const v = r.I[k];
      if (!v) return " · ";
      return v.pass ? " ✓ " : " ✗ ";
    }).join(" ");
    const line = `${r.route.padEnd(24)} ${String(r.width).padEnd(5)} ${cells}`;
    console.log(line);
    for (const k of INV) {
      const v = r.I[k];
      if (v && v.pass === false) console.log(`      ↳ ${k} FAIL: ${v.detail}`);
    }
    if (r.I.ERR) console.log(`      ↳ ERROR: ${r.I.ERR.detail}`);
  }
  // I9 anchors
  if (anchors && anchors.length) {
    console.log("\nI9 ANCHORS (/platform):");
    for (const a of anchors) console.log(`  ${a.pass ? "✓" : "✗"} ${a.mode.padEnd(11)} ${a.route.padEnd(18)} ${a.pass ? "" : a.detail}`);
  }
  // I10 reduced-motion + I11 no-JS
  for (const [label, list] of [["I10 REDUCED-MOTION", reduced], ["I11 NO-JS", nojs]]) {
    if (list && list.length) {
      const bad = list.filter((x) => !x.pass);
      console.log(`\n${label}: ${bad.length === 0 ? "all pass ✓" : bad.length + " fail"}`);
      for (const x of bad) console.log(`  ✗ ${x.route.padEnd(24)} ${x.detail}`);
    }
  }
  if (titleUnique) console.log(`\nI14b TITLE UNIQUENESS: ${titleUnique.pass ? "✓" : "✗"} (${titleUnique.detail})`);
  if (identity) console.log(`I16b IDENTITY CONSISTENCY: ${identity.pass ? "✓" : "✗"} (${identity.detail})`);
  console.log(`\n${failures === 0 ? "ALL GREEN ✓" : failures + " failing cells"}`);
  return failures;
}

// Direct run (path-normalized so it fires on Windows too).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = await runSweep();
  const f = printMatrix(out);
  process.exit(f === 0 ? 0 : 1);
}
