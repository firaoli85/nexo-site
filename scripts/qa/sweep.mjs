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
    // CROSS-ROUTE ERROR BLEED (Task #27). All routes share ONE page, and Next prefetches the links in
    // view. Navigating away ABORTS those in-flight prefetches, and WebKit reports each abort as a
    // console error that lands AFTER the next goto has started — so route N-1's aborted prefetch was
    // charged to route N. The tell is that the failing prefetch TARGET is always some unrelated page
    // ("/" or "/apply") while the BLAMED route changes every run. Measured over 12 sweeps per arm it
    // fired in 5/12 with this task's atmosphere layer and 6/12 WITHOUT it, i.e. it is pre-existing and
    // not caused by any page change. Park on about:blank first and let the aborts land THERE, then
    // clear and navigate for real. Detection is not weakened: about:blank runs no app code, so any
    // genuine error on the route under test still lands in the buffer after this point.
    await page.goto("about:blank").catch(() => {});
    await page.waitForTimeout(150);
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
    const n = await page.evaluate(() => document.querySelectorAll(".route-van").length
      + document.querySelectorAll(".route-overlay svg .route-path").length
      + document.querySelectorAll(".route-overlay svg .route-strand").length);
    return { pass: n === 0, detail: n ? `interior route has ${n} van/route/strand nodes` : "" };
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
      const van = document.querySelector(".route-van .route-van-art") || document.querySelector(".route-van");
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
  // STRAND STROKE (promoted from the Task #31 bench probe into a shipped invariant). On the Noir
  // Bench the braid once rendered with no stroke at all — the colour rules were scoped to a class
  // the host element did not carry — and nothing caught it, because a stroke-less path is still a
  // path and still has a bounding box. An unpainted signature is a blank page that measures fine.
  const strandBad = await page.evaluate(() => {
    const paths = [...document.querySelectorAll(".route-overlay svg path.route-path, .route-overlay svg path.route-strand")];
    if (!paths.length) return null;
    const dead = paths.filter((p) => {
      const cs = getComputedStyle(p);
      return cs.stroke === "none" || cs.stroke === "rgba(0, 0, 0, 0)" || parseFloat(cs.strokeOpacity) === 0 || parseFloat(cs.strokeWidth) === 0;
    });
    return dead.length ? `${dead.length} of ${paths.length} route strands render with NO stroke` : null;
  });

  const moved = new Set(vanYs).size > 1;
  const detail = [missing, overlapText, gapBad, strandBad, vanYs.length && !moved ? "van did not move with scroll (stuck/detached)" : ""].filter(Boolean).join("; ");
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
  // THE CANONICAL-PATH LAW, made checkable. Since Task #34 the route is a braid: the lead is the
  // single truth (van + LUT + dash all consume it) and the companion strands are decorative
  // siblings. Binding to the attribute rather than to a class name means a future strand that
  // happens to pick up .route-path cannot quietly become a second truth.
  const canon = document.querySelectorAll("[data-route-canonical]");
  const path = canon[0];
  const van = document.querySelector(".route-van");
  if (!root || !path || !van) return { absent: true, why: "no route/van nodes" };
  if (canon.length !== 1) return { bad: `there are ${canon.length} canonical route paths; there must be exactly 1 (the companion strands are decorative and must never be canonical)` };
  if (getComputedStyle(van).display === "none") return { absent: true, why: "van display:none (overlay not armed - reduced-motion or pre-hydration)" };
  // NOTE: there is no offset-path gate any more. Task #22 moved the van INSIDE the svg as a <g>
  // positioned by transform, so it renders wherever the svg does — the old `@supports (offset-path)`
  // hide-the-van branch is gone, and checking offsetPath here would now report "none" on a perfectly
  // healthy van and silently skip the assertion.
  const p = parseFloat(getComputedStyle(root).getPropertyValue("--route-progress"));
  if (!isFinite(p)) return { bad: "--route-progress is not a number" };
  const m = path.getScreenCTM();
  const L = path.getTotalLength();
  const q = path.getPointAtLength(p * L);
  const hx = m.a * q.x + m.c * q.y + m.e;
  const hy = m.b * q.x + m.d * q.y + m.f;
  // MEASURE THE VAN GROUP'S OWN ORIGIN, not its bounding box. Since Task #22 the van is a <g>
  // inside the svg, and getBoundingClientRect() on a <g> INCLUDES its children's transforms — so it
  // would fold in the deliberate +/-12px lane offset and the nose rotation and report a 12px error
  // on a perfectly-placed van. getScreenCTM() returns the mapping for the group's OWN coordinate
  // origin, which is exactly the point that rides the path. The old HTML parent's border box
  // excluded the child transform for free; the svg group does not, and that difference is real.
  const vm = van.getScreenCTM();
  // THE LINE'S OWN CLAIM (Task #25). I20 used to compare the van against the path GEOMETRY and never
  // asked what the line was actually DRAWING. FO-3's real defect lived exactly in that blind spot:
  // `stroke-dashoffset: calc(1 - var(...))` is invalid CSS (the property takes a length, not a bare
  // number), so Gecko dropped the declaration, the offset fell back to 0, and with dasharray 1 that
  // paints the WHOLE path — a fully-drawn line beside a correctly-placed van. Blink and WebKit
  // coerced the number and hid it. Firefox is already a cube engine, so asserting the dash here is
  // what would have caught it. Note the serialisation trap too: Blink returns `calc(0.61px)`, and
  // parseFloat on that is NaN — which is what crashed the second field probe.
  const dofRaw = getComputedStyle(path).strokeDashoffset;
  const dofNum = parseFloat(String(dofRaw).trim().replace(/^calc\((.*)\)$/, "$1"));
  const seam = document.querySelector("[data-route-seam]");
  return {
    p: +p.toFixed(4),
    // SINGLE-TRUTH RECEIPT: an identity CTM is what makes the line and the van one coordinate
    // system. If someone reinstates h-full/w-full or preserveAspectRatio on that svg, this moves
    // off 1 and the detail string says so by name.
    ctmA: +m.a.toFixed(4), ctmD: +m.d.toFixed(4),
    delta: +Math.hypot(vm.e - hx, vm.f - hy).toFixed(3),
    dashoffsetRaw: String(dofRaw),
    dashFinite: isFinite(dofNum),
    lineP: isFinite(dofNum) ? +(1 - dofNum).toFixed(4) : null,
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
    // THE LINE MUST AGREE WITH THE VARIABLE IT CLAIMS TO BE DRAWING (Task #25, FO-3 root cause).
    // I20 previously compared the van against the path GEOMETRY and never asked what the line was
    // actually drawing, which is precisely where the defect lived.
    if (!o.dashFinite)
      problems.push(`${label}: stroke-dashoffset does not parse to a number (raw: ${o.dashoffsetRaw}) so the line cannot be verified`);
    else if (Math.abs(o.lineP - o.p) > 0.02)
      problems.push(`${label}: THE LINE DISAGREES WITH THE VARIABLE. dashoffset says the line is drawn to ${o.lineP} while --route-progress is ${o.p} (raw: ${o.dashoffsetRaw}). A bare number in stroke-dashoffset is invalid CSS: Gecko drops the declaration and paints the whole path.`);
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

  // (a2) THE WARP LEG (Task #34). Two things are asserted and they are different claims.
  //   OBEDIENCE: --route-progress must be MONOTONE NON-DECREASING as the reader scrolls down.
  //     D29's split ruling put autonomous drama in the W2 hero script precisely so the page route
  //     could stay obedient to the scroll, and a law nothing can check is a preference. A warp is
  //     a reparameterisation; if it ever runs backwards under a forward scroll it is an animation.
  //   COVERAGE: the old ladder scrolled to DOCUMENT fractions and relied on 0.9 landing deep in
  //     the terminus. Under a warp that correspondence is a side effect, not a guarantee, so this
  //     asserts directly that some sample is genuinely in-curve rather than trusting the proxy.
  {
    const warp = await page.evaluate(async () => {
      const root = document.querySelector(".route-overlay");
      const path = document.querySelector("[data-route-canonical]");
      if (!root || !path) return null;
      const span = (root.dataset.routeSpan || "").split(",").map(Number);
      if (span.length !== 2 || !isFinite(span[0]) || !isFinite(span[1])) return { noSpan: true };
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const rows = [];
      for (let i = 0; i <= 48; i++) {
        window.scrollTo({ top: Math.round((max * i) / 48), behavior: "instant" });
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const p = Math.min(1, Math.max(0, (window.scrollY - span[0]) / span[1]));
        const s = parseFloat(getComputedStyle(root).getPropertyValue("--route-progress"));
        const q = path.getPointAtLength(Math.min(1, Math.max(0, s)) * path.getTotalLength());
        const q0 = path.getPointAtLength(0);
        rows.push({ p: +p.toFixed(5), s: +s.toFixed(5), dx: +(q.x - q0.x).toFixed(1) });
      }
      return { rows };
    });
    if (warp && warp.noSpan) problems.push("the route publishes no data-route-span, so scroll-obedience cannot be verified");
    else if (warp && warp.rows) {
      const rows = warp.rows;
      let back = null;
      for (let i = 1; i < rows.length; i++) {
        if (!isFinite(rows[i].s)) { back = `--route-progress is not finite at p=${rows[i].p}`; break; }
        if (rows[i].s < rows[i - 1].s - 1e-4) { back = `the route ran BACKWARDS under a forward scroll: ${rows[i - 1].s} -> ${rows[i].s}`; break; }
      }
      if (back) problems.push(`warp obedience: ${back}`);
      const inCurve = rows.filter((r) => Math.abs(r.dx) > 20 && r.s < 0.999).length;
      if (!inCurve) problems.push("warp coverage: no sample landed in a curved part of the route, so the in-curve agreement was never actually tested");
      const dev = Math.max(...rows.map((r) => Math.abs(r.s - r.p)));
      if (dev > 0.25) problems.push(`the warp deviates ${(dev * 100).toFixed(1)}% from linear scroll — far enough that the van can leave the viewport`);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
  }

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

// ── I20 ZOOM LEG (Task #21, FO-3) ───────────────────────────────────────────────────────────────
// FO-3 reported the van ignoring the terminus curve on a Yoga-class machine, with page zoom as the
// prime suspect. Instruments did NOT convict it — four emulation lanes across three engines all
// measured under 1px, and the "error proportional to path x" prediction did not hold. But I20 as
// shipped only ever looked at zoom 1, so it was BLIND to the whole class either way, and a blind
// spot a field report has already pointed at is worth closing whether or not this particular report
// turns out to live there.
//
// CHROMIUM-ONLY, AND IT SAYS SO IN ITS OWN OUTPUT. Page zoom is not emulable in the webkit and
// firefox lanes (no CDP, and Playwright exposes no zoom control), so this leg covers one engine.
// A visible partial is honest; an invisible gap is not — the detail string always names the coverage
// so nobody reads a green I20 as "zoom verified everywhere".
//
// It samples MID-CURVE deliberately. The reported signature is invisible on the straight leg, where
// the path's x is constant, and only expresses as x grows through the terminus curve — so a sample
// taken anywhere else would be a sample taken where the defect is defined not to appear.
const I20_ZOOM_PROBE = () => {
  const root = document.querySelector(".route-overlay");
  const path = document.querySelector(".route-path");
  const van = document.querySelector(".route-van");
  if (!root || !path || !van) return { absent: "no route/van nodes (below lg, or torn down)" };
  const cs = getComputedStyle(van);
  if (cs.display === "none") return { absent: "van hidden (overlay not armed)" };
  // (no offset-path gate since Task #22 — see the note in I20_PROBE)
  const p = parseFloat(getComputedStyle(root).getPropertyValue("--route-progress"));
  // Without this guard getPointAtLength(NaN) THROWS, and the failure surfaces as an opaque "lane
  // error TypeError" instead of naming the real cause — which is the FO-3 signature itself.
  if (!isFinite(p)) return { bad: "--route-progress is not a number" };
  const m = path.getScreenCTM();
  const L = path.getTotalLength();
  const q = path.getPointAtLength(p * L);
  const q0 = path.getPointAtLength(0);
  const hx = m.a * q.x + m.c * q.y + m.e, hy = m.b * q.x + m.d * q.y + m.f;
  const vm = van.getScreenCTM(); // the group's own origin — see the note in I20_PROBE
  return {
    p: +p.toFixed(4),
    dxFromGutter: +(q.x - q0.x).toFixed(1),
    delta: +Math.hypot(vm.e - hx, vm.f - hy).toFixed(3),
  };
};

export async function checkVanRidesLineZoom({ base = BASE, sabotage = false } = {}) {
  const LANES = [
    { name: "css-zoom", factor: 1.25 },
    { name: "css-zoom", factor: 1.5 },
    { name: "device-metrics", factor: 1.25 },
    // FRACTIONAL-DPR LANE (Task #22). The FO-3 field probe came from a machine at dpr 1.25 (Windows
    // 125% scaling), and the owner's zoom ladder correlated exactly with the EFFECTIVE fractional
    // scale — 100%x1.25 large gap, 90%x1.25 small gap, 80%x1.25 perfect. THIS LANE IS A GUARD, NOT A
    // REPRODUCTION, and the distinction matters: Task #21's 51-sample matrix (this same emulation,
    // among others) measured everything within 1px, so lab emulation demonstrably does NOT reproduce
    // the field defect. It is here so that a future regression at fractional DPR cannot pass unseen —
    // the owner's field re-test remains the closing proof for FO-3 itself.
    { name: "dpr", factor: 1.25, dsf: 1.25 },
    // dpr 2 lane (Task #25). The field machine that produced the LINE-FULL/VAN-MID report ran at
    // dpr 2 and I20 had never exercised it. The defect turned out to be engine strictness rather
    // than device pixel ratio, but the lane stays: it was an untested corner of a real reader's
    // configuration, and the cost of covering it is one more context.
    { name: "dpr", factor: 2, dsf: 2 },
  ];
  const browser = await chromium.launch();
  const problems = [], samples = [];
  try {
    for (const lane of LANES) {
      const tag = lane.name + "@" + lane.factor;
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: lane.dsf || 1 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      try {
        await page.goto(base + "/", { waitUntil: "networkidle" });
        await page.waitForTimeout(600);
        if (lane.name === "dpr") {
          // nothing to emulate beyond the context deviceScaleFactor already set above
        } else if (lane.name === "device-metrics") {
          await cdp.send("Emulation.setDeviceMetricsOverride", {
            width: Math.round(1440 / lane.factor), height: Math.round(900 / lane.factor),
            deviceScaleFactor: lane.factor, mobile: false,
          });
        } else {
          await page.evaluate((z) => { document.documentElement.style.zoom = String(z); }, lane.factor);
        }
        await page.waitForTimeout(700);
        if (sabotage) {
          // Break agreement the way a stale or duplicated path representation would: hand the van
          // its OWN copy of the geometry, shifted. That is exactly what the pre-url() architecture
          // made possible, and what offset-path: url(#id) removes by construction.
          await page.evaluate(() => {
            // Displace the van group. Since Task #22 the van is positioned by a transform ATTRIBUTE
            // rewritten every frame, and a CSS transform beats a presentation attribute — so this
            // wins on every frame and produces exactly the disagreement I20 exists to catch.
            const st = document.createElement("style");
            st.textContent = ".route-van { transform: translate(40px, 120px); }";
            document.head.appendChild(st);
          });
          await page.waitForTimeout(250);
        }
        const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        const seen = [];
        let absent = null;
        // Sweep the whole descent rather than stopping at the first curved hit: zoom shrinks the
        // layout viewport, so the page bottom arrives sooner and the naive early-exit landed on
        // p=1 (the terminus ENDPOINT) instead of a genuinely mid-curve point.
        //
        // RUNG LIST RE-DERIVED IN TASK #34, and the derivation is worth recording because it is
        // not obvious. CSS `zoom` shrinks the effective CSS viewport (1440/1.5 = 960), which
        // collapses the content container's left offset to 0, which puts the weave under its own
        // deadband — so UNDER ZOOM THE ROUTE IS CORRECTLY STRAIGHT and the terminus is the only
        // curve there is. Measured on the braided build: at zoom 1.25 exactly one rung (f=0.8)
        // landed in-curve; at zoom 1.5 the ladder jumped from p=0.8637 (still straight) straight
        // to p=1 (saturated) and reached NO mid-curve sample at all. The fixed ladder therefore
        // adds low rungs for the un-zoomed serpentine and, when the coarse pass still finds
        // nothing, BISECTS the bracket between the last un-saturated rung and the first saturated
        // one. A ladder that cannot find the curve it exists to sample is a blind spot.
        for (const f of [0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.86, 0.9, 0.93, 0.96, 0.985, 1]) {
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(max * f));
          await page.waitForTimeout(240);
          const o = await page.evaluate(I20_ZOOM_PROBE);
          if (o.absent) { absent = o.absent; continue; }
          seen.push({ ...o, f });
        }
        if (!seen.length) {
          samples.push({ tag, skipped: absent || "no samples" });
        } else {
          // REFINEMENT: if the coarse ladder never landed mid-curve, bisect the bracket between
          // the last un-saturated sample and the first saturated one. Under zoom that window can
          // be a few percent of the scroll range wide, and a fixed ladder can step straight over it.
          if (!seen.some((o) => Math.abs(o.dxFromGutter) > 20 && o.p < 0.999)) {
            const lo = [...seen].reverse().find((o) => o.p < 0.999);
            const hi = seen.find((o) => o.p >= 0.999);
            if (lo && hi) {
              let a = lo.f, c = hi.f;
              for (let k = 0; k < 7; k++) {
                const mid = (a + c) / 2;
                await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(max * mid));
                await page.waitForTimeout(200);
                const o = await page.evaluate(I20_ZOOM_PROBE);
                if (o.absent || o.bad) break;
                seen.push({ ...o, f: mid });
                if (o.p >= 0.999) c = mid; else a = mid;
                if (Math.abs(o.dxFromGutter) > 20 && o.p < 0.999) break;
              }
            }
          }
          const control = seen.find((o) => o.dxFromGutter < 1);
          // prefer a point genuinely INSIDE the curve over the endpoint at p=1
          // ABSOLUTE VALUE, since Task #34. The serpentine's lateral excursion is NEGATIVE (the
          // weave extends left of the gutter, because the only horizontal room on the page is
          // there), so a signed `> 20` gate could never see the braid at all — only the terminus,
          // which curves right. A gate that cannot match the geometry it is meant to cover is a
          // blind spot that reports green.
          const curved = seen.find((o) => Math.abs(o.dxFromGutter) > 20 && o.p < 0.999);
          if (curved) samples.push({ tag, ...curved });
          else problems.push(tag + ": never reached a curved sample (|dxFromGutter| never exceeded 20 below p=0.999)");
          if (control) samples.push({ tag: tag + " straight-control", ...control });
          // ASSERT ON EVERY SAMPLE, not only the curved one. The first version of this leg checked
          // the tolerance on the curved sample alone, so a 16px error on the straight leg passed —
          // its own negative test is what caught that.
          for (const o of seen) {
            if (o.delta > I20_TOL) {
              problems.push(tag + ": van is " + o.delta + "px off the drawn head at p=" + o.p +
                " (dxFromGutter " + o.dxFromGutter + ", tolerance " + I20_TOL + "px)");
              break;
            }
          }
        }
      } catch (e) {
        problems.push(tag + ": lane error " + String(e.message).slice(0, 60));
      }
      await ctx.close();
    }
  } finally { await browser.close(); }
  const measured = samples.filter((x) => !x.skipped);
  // Same absolute value, and the p<0.999 filter that the summary was missing: without it a run
  // that only ever saturated at the endpoint still printed "N of them MID-CURVE".
  const curvedOnes = measured.filter((x) => Math.abs(x.dxFromGutter) > 20 && x.p < 0.999);
  const worst = measured.length ? measured.reduce((a, c) => (c.delta > a.delta ? c : a)) : null;
  return {
    pass: problems.length === 0 && curvedOnes.length > 0,
    detail: problems.length
      ? problems.slice(0, 3).join("; ")
      : "chromium only — the zoom lanes need CDP, and the DPR lane rides along in the same browser rather than tripling the sweep — " + measured.length +
        " samples across css-zoom 1.25/1.5, device-metrics 1.25 and fractional-DPR 1.25 plus 2, " + curvedOnes.length +
        " of them MID-CURVE, worst delta " + (worst ? worst.delta : "n/a") + "px against a " + I20_TOL + "px tolerance",
    samples,
  };
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
      // Radix MOUNTS the Indicator on open, and aria-expanded flips BEFORE that mount lands. A fixed
      // 340ms wait raced it in WebKit: roughly 1 run in 10 measured while the indicator was still
      // absent and reported "no-indicator" on a randomly varying trigger. Characterised in Task #27
      // over 30 runs — the rate was IDENTICAL with and without that task's atmosphere layer (9/10
      // both ways), and a mount-aware wait passed 10/10 with a worst offset of 0px, so the site was
      // never at fault. Wait for the indicator to exist and paint a non-zero bar, THEN settle.
      // THIS DOES NOT WEAKEN THE INVARIANT: the Stage-16 defect I17 exists to catch is a FROZEN
      // indicator, which is mounted with a real width, so this wait returns immediately and the
      // +/-4px assertion below still convicts it. A genuinely absent indicator still falls through
      // the timeout to the existing no-indicator failure.
      await page
        .waitForFunction(() => {
          for (const ind of document.querySelectorAll(`.nav-indicator[data-state="visible"]`)) {
            const bar = ind.querySelector(".nav-indicator-bar") || ind;
            if (bar.getBoundingClientRect().width > 0) return true;
          }
          return false;
        }, null, { timeout: 3000 })
        .catch(() => {});
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
        // A FIXED DWELL WAS A RACE BY CONSTRUCTION (Task #28). scrollIntoView() here inherits
        // `scroll-behavior: smooth`, so on a ~5.5k-pixel page the animated scroll can eat most of the
        // budget before the IntersectionObserver has even fired, leaving the 600ms staggered arrival
        // unfinished when the probe measures. At w1920 it had tipped from marginal to deterministic:
        // 6/6 runs failed — AND 6/6 failed on the PRE-conversion build too, which is how it was ruled
        // pre-existing rather than caused by the motion-safe conversion.
        // Wait for the arrival to be TRIGGERED, then dwell only for the choreography itself.
        // Detection is not weakened: if the reveal never fires, the wait times out and the probe still
        // measures the hidden state and still fails — which is the regression I8 exists to catch.
        await page
          .waitForFunction(() => {
            const card = document.querySelector("[data-route-seam]");
            if (!card) return true;                                    // no terminus card on this route
            if (!card.hasAttribute("data-terminus-live")) return true; // never armed (footer in view at mount, or reduced motion)
            return card.hasAttribute("data-terminus-in");              // armed: wait for the IO to fire
          }, null, { timeout: 8000 })
          .catch(() => {});
        await page.waitForTimeout(900); // the staggered settle ends at 600ms; 900 leaves margin
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
