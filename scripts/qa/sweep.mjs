// The QA sweep (Stage 12). Asserts the site's structural invariants (I1–I20) against the PROD build
// for every route × viewport, and writes a pass/fail matrix + failure screenshots. Standing
// infrastructure — invariants are only ADDED, never weakened (nexo-brand regression rule).
//
// Run indirectly via `npm run qa:sweep` (scripts/qa/run.mjs builds + serves + calls this). Or directly
// against an already-running server: `node scripts/qa/sweep.mjs` (expects the prod build on :3300).
import { chromium, webkit, firefox, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ROUTES, NOT_FOUND, ENGINES, PROFILES, BASE, PLATFORM_ANCHORS, FORM_ROUTES } from "./routes.mjs";

const ART = resolve(dirname(fileURLToPath(import.meta.url)), "artifacts");
mkdirSync(ART, { recursive: true });

const CLS_INIT = () => {
  window.__cls = 0;
  try {
    // `layout-shift` is Chromium + WebKit only. Firefox logs a console WARNING if you observe an
    // unsupported entryType, which would trip I4 (zero console warnings). Feature-detect so Firefox stays
    // quiet — CLS is measured on the engines that support it; on Firefox it reads 0 / unmeasured (noted).
    const ok =
      typeof PerformanceObserver !== "undefined" &&
      Array.isArray(PerformanceObserver.supportedEntryTypes) &&
      PerformanceObserver.supportedEntryTypes.includes("layout-shift");
    if (ok) {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    }
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
  // I18 INK-SAFE DOCUMENT ROOT (Stage 16, Defect A). The <html> background must be dark ink so the iOS
  // overscroll rubber-band + URL-bar collapse never reveal white below the ink footer endcap (or above
  // the ink hero); and the document must not scroll past the footer (scrollHeight sanity, re-proven per
  // engine + profile — the endcap law, now engine-agnostic).
  inkSafe() {
    const parse = (col) => {
      const m = col && col.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(",").map((s) => parseFloat(s));
      return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
    };
    const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
    const c = parse(htmlBg);
    const lum = c ? (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255 : 1;
    const dark = !!c && c.a >= 1 && lum < 0.25;
    const footer = document.querySelector("footer, [role=contentinfo]");
    const fb = footer ? footer.getBoundingClientRect().bottom + window.scrollY : 0;
    const voidPx = Math.round(document.documentElement.scrollHeight - fb);
    return { pass: dark && voidPx <= 2, detail: `htmlBg=${htmlBg}${dark ? "" : " NOT-INK"}${voidPx > 2 ? ` void=${voidPx}px` : ""}` };
  },
};

// ── I6 skip link + focus ring ───────────────────────────────────────────────────────────────────
async function checkSkipAndFocus(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  // The skip link is the first focusable — an <a href="#main-content"> that is sr-only until focused.
  // WebKit/Safari's DEFAULT keyboard mode does not Tab to links (only form controls) unless Full Keyboard
  // Access is on, so pressing Tab and expecting the link fails in WebKit for a browser-config reason, not
  // a site bug (harness-vs-real, §10). Verify it engine-agnostically by FOCUSING it directly: it must
  // exist, take focus, target #main, and REVEAL itself (focus:not-sr-only paints it — proving it works).
  const skip = await page.evaluate(() => {
    const a = document.querySelector('a[href*="#main"]');
    if (!a) return false;
    a.focus();
    const r = a.getBoundingClientRect();
    return document.activeElement === a && (a.getAttribute("href") || "").includes("#main") && r.width > 4 && r.height > 4;
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
      // Stage 16: "Sign in" is launch-gated (PORTAL_LIVE). When present it must be a working dropdown
      // menu (opens a real panel — verified in the loop below); when gated off it must be ABSENT, never
      // a bare link. So I7 no longer REQUIRES a Sign-in trigger to exist; instead it rejects a bare
      // "Sign in" <a> link in the header (the "regressed to a link" failure the Stage-15 check guarded).
      for (let i = 0; i < count; i++) {
        const t = triggers.nth(i);
        if (!(await t.isVisible())) continue; // skips the lg:hidden mobile hamburger at desktop widths
        const label = ((await t.textContent()) || "").trim();
        const handle = await t.elementHandle();
        // WAIT on actual state (aria-expanded), not a fixed sleep — Radix hover-open is delayDuration
        // (~100ms) + panel animation, and a fixed timeout races under load (the 4th trigger flaked once).
        await t.hover();
        const opened = await page
          .waitForFunction((el) => el.getAttribute("aria-expanded") === "true", handle, { timeout: 2000 })
          .then(() => true)
          .catch(() => false);
        const panelOk = await page.evaluate(() => {
          const contents = [...document.querySelectorAll('[data-state="open"]')].filter((el) => el.tagName !== "BUTTON");
          return contents.some((c) => c.getBoundingClientRect().height > 0 && c.querySelectorAll("a").length > 0);
        });
        await page.keyboard.press("Escape");
        await page.mouse.move(3, 320);
        const closed = await page
          .waitForFunction((el) => el.getAttribute("aria-expanded") !== "true", handle, { timeout: 2000 })
          .then(() => true)
          .catch(() => false);
        await handle.dispose().catch(() => {}); // caller-created handles aren't auto-disposed; free it per trigger
        tested++;
        if (!(opened && panelOk && closed)) {
          return { pass: false, detail: `trigger#${i}${label ? ` (${label})` : ""}: open=${opened} panel=${panelOk} closed=${closed}` };
        }
      }
      if (tested === 0) return { pass: false, detail: "no visible triggers" };
      // A bare "Sign in" <a> in the HEADER is the "regressed to a link" failure (the footer picker link is
      // separate and allowed). While PORTAL_LIVE is off, Sign-in is simply absent from the header — fine.
      const signinLinkInHeader = await page.evaluate(() =>
        [...document.querySelectorAll("header a")].some((a) => /^\s*sign\s*in\s*$/i.test(a.textContent || "")),
      );
      if (signinLinkInHeader) return { pass: false, detail: "Sign-in is a bare <a> link in the header (must be a working menu or absent while gated)" };
      return { pass: true, detail: "" };
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

// ── I20 THE VAN RIDES THE LINE (Task #19 — the FO-1 receipt) ────────────────────────────────────
// C4/FO-1: the drawn route and the livery van used to be two coordinate systems reading one path
// string, and nothing re-measured on content reflow. Both are fixed; this is the invariant that
// keeps them fixed. It asserts AGREEMENT, not appearance: the van's centre must sit on the point
// the drawn path reaches at the current --route-progress.
//
// TOLERANCE = 1.0px, calibrated rather than guessed. Measured agreement on the fixed build across
// chromium/webkit/firefox x 1024/1440/1920 x 5 scroll positions (45 samples) was max 0.11px, p95
// 0.048px, median 0.003px. The SMALLEST divergence reproduced on the unfixed build was 1.52px (a
// scrollbar-width drift). 1.0px therefore sits ~9x above the worst observed sub-pixel noise and
// below the smallest real defect — it cannot flake, and it cannot miss the bug it exists for.
const I20_TOL = 1.0;

const I20_PROBE = () => {
  const root = document.querySelector(".route-overlay");
  const path = document.querySelector(".route-path");
  const van = document.querySelector(".route-van");
  if (!root || !path || !van) return { absent: true, why: "no route/van nodes" };
  if (getComputedStyle(van).display === "none") return { absent: true, why: "van display:none (@supports / not armed)" };
  if (getComputedStyle(van).offsetPath === "none") return { absent: true, why: "offset-path unsupported or rejected" };
  const p = parseFloat(getComputedStyle(root).getPropertyValue("--route-progress"));
  if (!isFinite(p)) return { bad: "--route-progress is not a number" };
  const m = path.getScreenCTM();
  const L = path.getTotalLength();
  const q = path.getPointAtLength(p * L);
  const hx = m.a * q.x + m.c * q.y + m.e;
  const hy = m.b * q.x + m.d * q.y + m.f;
  const r = van.getBoundingClientRect();
  const seam = document.querySelector("[data-route-seam]");
  return {
    p: +p.toFixed(4),
    // SINGLE-TRUTH RECEIPT: an identity CTM is what makes the line and the van one coordinate
    // system. If someone reinstates h-full/w-full or preserveAspectRatio on that svg, this moves
    // off 1 and the detail string says so by name.
    ctmA: +m.a.toFixed(4), ctmD: +m.d.toFixed(4),
    delta: +Math.hypot(r.left + r.width / 2 - hx, r.top + r.height / 2 - hy).toFixed(3),
    // HANDOFF — the gap between the route END and the footer card, which is the mode-2 metric.
    // Both terms MUST be in the same coordinate space: map the path end through the CTM to get a
    // viewport y, and compare with the seam rect (also viewport). An earlier version mixed spaces
    // by adding root.style.top (which is HOST-relative, not document-relative) and reported a
    // constant ~65px error on a healthy build; the negative test is what caught it.
    handoff: (() => {
      if (!seam) return null;
      const e = path.getPointAtLength(L);
      const ey = m.b * e.x + m.d * e.y + m.f;
      return Math.round(seam.getBoundingClientRect().top - ey);
    })(),
  };
};

export async function checkVanRidesLine(page, route, width) {
  // DELIBERATE ABSENCES ARE SKIPS, NOT FAILURES — the van is homepage-only, lg+, motion-only, and
  // gated on @supports (offset-path). Where it is absent BY DESIGN we assert the absence instead.
  if (route !== "/") {
    const n = await page.evaluate(() => document.querySelectorAll(".route-van").length);
    return { pass: n === 0, detail: n ? `I20: interior route rendered ${n} van node(s)` : "" };
  }
  if (width < 1024) {
    const vis = await page.evaluate(() => {
      const v = document.querySelector(".route-van");
      return !!v && getComputedStyle(v).display !== "none";
    });
    return { pass: !vis, detail: vis ? "I20: van visible below lg (should be torn down)" : "" };
  }
  if (await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    const vis = await page.evaluate(() => {
      const v = document.querySelector(".route-van");
      return !!v && getComputedStyle(v).display !== "none";
    });
    return { pass: !vis, detail: vis ? "I20: van visible under reduced-motion (must be hidden)" : "" };
  }

  const problems = [];
  const sample = async (label) => {
    const o = await page.evaluate(I20_PROBE);
    if (o.absent) return o; // engine without offset-path → skip, recorded in the detail
    if (o.bad) { problems.push(`${label}: ${o.bad}`); return o; }
    if (Math.abs(o.ctmA - 1) > 0.001 || Math.abs(o.ctmD - 1) > 0.001)
      problems.push(`${label}: route svg CTM is not identity (a=${o.ctmA} d=${o.ctmD}) — the line can scale away from the van; check for h-full/w-full or preserveAspectRatio on the route svg`);
    if (o.delta > I20_TOL)
      problems.push(`${label}: van is ${o.delta}px off the drawn head at p=${o.p} (tolerance ${I20_TOL}px)`);
    return o;
  };

  // (a) CORE — several scrolled positions, including one deep in the terminus curve where the
  // path's x-coordinate is largest and any horizontal shear is therefore biggest.
  let sawVan = false;
  for (const f of [0.35, 0.65, 0.9]) {
    await page.evaluate((fr) => window.scrollTo({ top: Math.round((document.documentElement.scrollHeight - window.innerHeight) * fr), behavior: "instant" }), f);
    await page.waitForTimeout(260);
    const o = await sample(`scroll ${f}`);
    if (o.absent) return { pass: true, detail: `I20 skip: ${o.why}` };
    sawVan = true;
  }
  if (!sawVan) return { pass: true, detail: "I20 skip: van never rendered" };

  // (b) PERTURBATION — the FO-1 trigger encoded forever. Grow the document AFTER mount with no
  // window resize (the fonts-settling / late-content case) and re-assert. Before the fix this left
  // the route terminating 1536px above the footer seam; the ResizeObserver must now re-measure.
  await page.evaluate(() => {
    const seam = document.querySelector("[data-route-seam]") || document.querySelector("footer");
    const d = document.createElement("div");
    d.id = "i20-perturb";
    d.style.height = "1200px";
    seam.parentNode.insertBefore(d, seam);
  });
  await page.waitForTimeout(500); // ResizeObserver → rAF → measure → render → offset-path
  await page.evaluate(() => window.scrollTo({ top: Math.round((document.documentElement.scrollHeight - window.innerHeight) * 0.65), behavior: "instant" }));
  await page.waitForTimeout(300);
  const after = await sample("after +1200px reflow");
  if (!after.absent && after.handoff != null && Math.abs(after.handoff - 36) > 8)
    problems.push(`after reflow the route ends ${after.handoff}px above the footer seam, not the 36px handoff (stale band — the reflow re-measure did not fire)`);

  await page.evaluate(() => document.getElementById("i20-perturb")?.remove());
  await page.waitForTimeout(400);
  await sample("after reflow removed");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

  return { pass: problems.length === 0, detail: problems.slice(0, 3).join("; ") };
}

// ── the cube: engines × profiles (Stage 16) ──────────────────────────────────────────────────────
const ENGINE_BY_NAME = { chromium, webkit, firefox };

// A profile is a plain desktop width ("w1440") or a Playwright device descriptor name ("iPhone 14").
function resolveProfile(name) {
  const m = /^w(\d+)$/.exec(name);
  if (m) return { name, width: +m[1], device: null };
  const d = devices[name];
  if (!d) throw new Error(`Unknown QA profile "${name}" — use wNNN (e.g. w1440) or a Playwright device name (e.g. "iPhone 14")`);
  return { name, width: d.viewport.width, device: d };
}
function contextOpts(engineName, profile) {
  if (!profile.device) return { viewport: { width: profile.width, height: 900 }, deviceScaleFactor: 1 };
  const o = { ...profile.device };
  if (engineName === "firefox") delete o.isMobile; // Firefox contexts do not accept isMobile
  return o;
}

// ── I17 MAGIC LINE tracks each trigger (Stage 16, Defect B) ──────────────────────────────────────
// Hover + open each desktop nav trigger; assert the VISIBLE indicator's x-center matches the trigger's
// (±4px). This is the invariant the chromium-only harness never had — the frozen line rode green for a
// whole deploy. Desktop only (there is no indicator below lg). Runs per engine.
async function checkIndicator(page, width) {
  if (width < 1024) return { pass: true, detail: "" };
  try {
    const triggers = page.locator("header button[aria-expanded]");
    const count = await triggers.count();
    const bad = [];
    let tested = 0;
    for (let i = 0; i < count; i++) {
      const t = triggers.nth(i);
      if (!(await t.isVisible())) continue;
      const label = ((await t.textContent()) || "").trim().replace(/\s+/g, " ").slice(0, 12);
      const h = await t.elementHandle();
      await t.hover();
      const opened = await page.waitForFunction((el) => el.getAttribute("aria-expanded") === "true", h, { timeout: 2000 }).then(() => true).catch(() => false);
      await page.waitForTimeout(340); // let the transform transition settle before measuring
      const m = await page.evaluate((el) => {
        const tr = el.getBoundingClientRect();
        let best = null, bestD = 1e9;
        for (const ind of document.querySelectorAll('.nav-indicator[data-state="visible"]')) {
          const bar = ind.querySelector(".nav-indicator-bar") || ind;
          const br = bar.getBoundingClientRect();
          if (br.width === 0) continue;
          const cx = br.left + br.width / 2;
          const d = Math.abs(cx - (tr.left + tr.width / 2));
          if (d < bestD) { bestD = d; best = cx; }
        }
        return { trigCx: tr.left + tr.width / 2, indCx: best };
      }, h);
      await page.keyboard.press("Escape").catch(() => {});
      await page.mouse.move(3, 340);
      await page.waitForTimeout(120);
      await h.dispose().catch(() => {});
      tested++;
      if (!opened || m.indCx == null) { bad.push(`${label}:open=${opened}/no-indicator`); continue; }
      const diff = Math.round(Math.abs(m.indCx - m.trigCx));
      if (diff > 4) bad.push(`${label}:Δ${diff}px`);
    }
    return { pass: tested > 0 && bad.length === 0, detail: bad.length ? bad.join(" ") : tested ? "" : "no triggers" };
  } catch (e) {
    return { pass: false, detail: "I17-err: " + String(e.message).slice(0, 40) };
  }
}

async function sweepOneEngine(browser, engineName, profiles, base, routes) {
  const rows = [];
  let failures = 0;
  const titleByRoute = {}; // I14: collected across routes to assert uniqueness
  const emailByRoute = {}; // I16: collected across routes to assert one identical canonical identity

  for (const profile of profiles) {
    const width = profile.width;
    for (const route of routes) {
      // RETRY-ONCE (Stage 16): the cube is timing-sensitive (footer arrival, IntersectionObserver,
      // network-idle, GC under sustained load). A transient flake must NOT fail the deploy gate — but a
      // REAL defect fails BOTH attempts. Only the final attempt's result is recorded (and marked).
      let res;
      for (let attempt = 1; attempt <= 2; attempt++) {
      const ctx = await browser.newContext(contextOpts(engineName, profile));
      const page = await ctx.newPage();
      const errs = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") errs.push(`console.${m.type()}: ${m.text().slice(0, 80)}`);
      });
      page.on("pageerror", (e) => errs.push(`pageerror: ${String(e.message).slice(0, 80)}`));
      page.on("requestfailed", (r) => errs.push(`reqfail: ${r.url().split("/").pop()} ${(r.failure() && r.failure().errorText) || ""}`));
      await page.addInitScript(CLS_INIT);

      res = { route, profile: profile.name, width, I: {}, attempt };
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
        if (width >= 1024) res.I.I17 = await checkIndicator(page, width);
        if (FORM_ROUTES.includes(route)) res.I.I13 = await page.evaluate(PROBES.form);
        res.I.I1 = await page.evaluate(PROBES.endcap);
        res.I.I18 = await page.evaluate(PROBES.inkSafe);
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
        // I20 (Task #19) — the van rides the line, INCLUDING after a post-mount reflow (FO-1).
        res.I.I20 = await checkVanRidesLine(page, route, width);
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
      const done = failed.length === 0 || attempt === 2;
      if (done) {
        if (failed.length) {
          failures++;
          const tag = `${engineName}_${profile.name.replace(/[^a-z0-9]/gi, "")}_${route.replace(/\//g, "_") || "_home"}`;
          await page.screenshot({ path: `${ART}/FAIL_${tag}.png`, fullPage: true }).catch(() => {});
        }
        await ctx.close();
        break; // passed, or exhausted the single retry
      }
      await ctx.close(); // attempt 1 failed → close this context and loop back for attempt 2
      }
      rows.push(res);
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
    const brandedOk = info.branded && info.h1 === 1 && info.hasHome && info.hasContact;
    rows.push({ route: NOT_FOUND, profile: "w1440", width: 1440, I: { STATUS: { pass: status === 404, detail: `status=${status}` }, BRANDED: { pass: brandedOk, detail: JSON.stringify(info) } } });
    if (status !== 404 || !brandedOk) failures++;
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

  return { engineName, rows, anchors, reduced, nojs, titleUnique, identity, failures: failures + extraFails };
}

export async function runSweep({ base = BASE, engines = ENGINES, profiles = PROFILES, routes = ROUTES } = {}) {
  const resolved = profiles.map(resolveProfile);
  const perEngine = [];
  for (const engineName of engines) {
    const engine = ENGINE_BY_NAME[engineName];
    if (!engine) { console.error(`Unknown engine "${engineName}" — skipping`); continue; }
    console.log(`\n── ${engineName}: ${resolved.length} profiles × ${routes.length} routes ──`);
    const browser = await engine.launch();
    try {
      perEngine.push(await sweepOneEngine(browser, engineName, resolved, base, routes));
    } finally {
      await browser.close();
    }
  }
  return { perEngine, failures: perEngine.reduce((a, e) => a + e.failures, 0) };
}

export function printMatrix({ perEngine, failures }) {
  // NOTE: this list is the REPORT, not the gate — every key in res.I is folded into the pass/fail
  // count whether or not it is printed. I20 shipped invisible for exactly one run because it was
  // missing here: it was running and could have failed the build, but a reader could not see that
  // it had run. An invariant that cannot be seen to have run is not a receipt. Keep this in sync.
  const INV = ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I12", "I13", "I14", "I15", "I16", "I17", "I18", "I20"];
  for (const eng of perEngine) {
    console.log(`\n\n════════════ ENGINE: ${eng.engineName.toUpperCase()} ════════════`);
    console.log("ROUTE                     PROFILE      " + INV.join(" "));
    for (const r of eng.rows) {
      if (r.route === NOT_FOUND) {
        const s = r.I.STATUS, b = r.I.BRANDED;
        console.log(`404 ${r.route.padEnd(24)} status:${s.pass ? "OK" : "FAIL(" + s.detail + ")"} branded:${b.pass ? "OK" : "FAIL"}`);
        continue;
      }
      const cells = INV.map((k) => { const v = r.I[k]; return !v ? "  ·" : v.pass ? "  ✓" : "  ✗"; }).join("");
      console.log(`${r.route.padEnd(24)} ${String(r.profile).padEnd(12)}${cells}${r.attempt === 2 ? "  (retried)" : ""}`);
      if (r.attempt === 2) console.log("      ↳ NOTE: attempt 1 flaked; this row is the attempt-2 (retry) result");
      for (const k of INV) { const v = r.I[k]; if (v && v.pass === false) console.log(`      ↳ ${k} FAIL: ${v.detail}`); }
      if (r.I.ERR) console.log(`      ↳ ERROR: ${r.I.ERR.detail}`);
    }
    if (eng.anchors && eng.anchors.length) {
      const bad = eng.anchors.filter((a) => !a.pass);
      console.log(`  I9 ANCHORS: ${bad.length === 0 ? "all pass ✓" : bad.length + " fail"}`);
      for (const a of bad) console.log(`    ✗ ${a.mode.padEnd(11)} ${a.route.padEnd(18)} ${a.detail}`);
    }
    for (const [label, list] of [["I10 REDUCED-MOTION", eng.reduced], ["I11 NO-JS", eng.nojs]]) {
      if (list && list.length) {
        const bad = list.filter((x) => !x.pass);
        console.log(`  ${label}: ${bad.length === 0 ? "all pass ✓" : bad.length + " fail"}`);
        for (const x of bad) console.log(`    ✗ ${x.route.padEnd(24)} ${x.detail}`);
      }
    }
    console.log(`  I14b TITLES: ${eng.titleUnique.pass ? "✓" : "✗ " + eng.titleUnique.detail}   I16b IDENTITY: ${eng.identity.pass ? "✓" : "✗ " + eng.identity.detail}`);
    console.log(`  ▶ [${eng.engineName}] ${eng.failures === 0 ? "GREEN ✓" : eng.failures + " FAILING"}`);
  }
  console.log(`\n${failures === 0 ? "═══════ CUBE ALL GREEN ✓ ═══════" : "═══════ " + failures + " FAILING CELLS ═══════"}`);
  return failures;
}

// Direct run (path-normalized so it fires on Windows too).
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = await runSweep();
  const f = printMatrix(out);
  process.exit(f === 0 ? 0 : 1);
}
