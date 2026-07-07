/**
 * scrape-reviews.js
 * ─────────────────────────────────────────────────────────
 * Scrapes all reviews from the Gateway Academy JustDial page
 * and writes them to public/reviews.json.
 *
 * Usage:
 *   npm run scrape-reviews          (runs once)
 *   npm run scrape-reviews:watch    (runs every 12 hours)
 *
 * Requirements: playwright is already in devDependencies.
 * First time: npx playwright install chromium
 * ─────────────────────────────────────────────────────────
 */

import { firefox } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JUSTDIAL_URL =
  "https://www.justdial.com/Kanniyakumari/Gateway-Academy-Manoj-Medical-Backside-Thingal-Nagar/9999P4653-4653-250426144943-T3J2_BZDET";

const OUTPUT_PATH = path.join(__dirname, "../public/reviews.json");

// ── How often to re-scrape when running in watch mode (ms) ──
const WATCH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

// ── Read existing reviews (to preserve data between runs) ───
function loadExisting() {
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { reviews: [] };
  }
}

// ── Merge new reviews with existing (no duplicates by name) ─
function mergeReviews(existing, fresh) {
  const map = new Map(existing.map((r) => [r.name.toLowerCase(), r]));
  for (const r of fresh) {
    map.set(r.name.toLowerCase(), r); // fresh data wins
  }
  return Array.from(map.values());
}

// ── Main scrape function ─────────────────────────────────────
async function scrape() {
  console.log("\n🔍 Launching browser…");
  const browser = await firefox.launch({
    headless: true,
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
    extraHTTPHeaders: {
      "Accept-Language": "en-IN,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  // Hide automation fingerprint
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    console.log("📡 Navigating to JustDial page…");
    await page.goto(JUSTDIAL_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait for JS to hydrate and reviews to render
    await page.waitForTimeout(6000);

    // Scroll gradually to trigger lazy-loaded reviews
    for (let i = 0; i < 8; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(700);
    }

    // Scroll back to top then wait once more
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // ── Extract reviews ────────────────────────────────────
    const freshReviews = await page.evaluate(() => {
      const results = [];

      // JustDial review selectors (they change occasionally; try multiple)
      const reviewContainers = document.querySelectorAll(
        [
          "[class*='reviewListing'] li",
          "[class*='ratingreviews'] li",
          "[class*='review-listing'] li",
          ".reviewrating li",
          "[data-type='review']",
          ".ratingReviews",
        ].join(", ")
      );

      reviewContainers.forEach((el) => {
        // Name
        const nameEl = el.querySelector(
          "[class*='reviewer'], [class*='user-name'], [class*='reviewername'], strong, b"
        );
        const name = nameEl ? nameEl.innerText.trim() : "";

        // Stars
        const starEls = el.querySelectorAll(
          "[class*='star']:not([class*='empty']), .rated, .yellow-star"
        );
        const rating = starEls.length || 5;

        // Review text
        const textEl = el.querySelector(
          "[class*='review-text'], [class*='reviewtext'], [class*='comment'], p"
        );
        const review = textEl ? textEl.innerText.trim() : "";

        // Date
        const dateEl = el.querySelector(
          "[class*='date'], [class*='time'], time, [class*='ago']"
        );
        const date = dateEl ? dateEl.innerText.trim() : "";

        if (name && review) {
          results.push({ name, rating, review, date });
        }
      });

      return results;
    });

    await browser.close();

    if (freshReviews.length === 0) {
      console.warn(
        "⚠️  No reviews found via DOM selectors — JustDial may have changed their HTML.\n" +
          "   The existing reviews.json has NOT been overwritten.\n" +
          "   Update the selectors in scripts/scrape-reviews.js and try again."
      );
      return;
    }

    console.log(`✅ Found ${freshReviews.length} reviews from JustDial`);

    // Merge with existing so manually-added reviews aren't lost
    const existing = loadExisting();
    const merged = mergeReviews(existing.reviews || [], freshReviews);

    const output = {
      lastUpdated: new Date().toISOString(),
      source: "JustDial",
      totalRating: 4.9,
      profileUrl: JUSTDIAL_URL,
      reviews: merged,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
    console.log(`💾 Saved ${merged.length} reviews → ${OUTPUT_PATH}`);
  } catch (err) {
    console.error("❌ Scrape failed:", err.message);
    await browser.close();
  }
}

// ── Entry point ──────────────────────────────────────────────
const watchMode = process.argv.includes("--watch");

if (watchMode) {
  console.log(`⏰ Watch mode: scraping every ${WATCH_INTERVAL_MS / 3600000}h`);
  scrape();
  setInterval(scrape, WATCH_INTERVAL_MS);
} else {
  scrape();
}
