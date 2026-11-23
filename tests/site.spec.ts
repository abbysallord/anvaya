import { expect, test } from "@playwright/test";

/* The bundles-first site (15 November 2026). The specs for the earlier glass-fan design are kept, unrun, in
   tests/legacy for reference. Tests never call the email provider or the assistant model: both keys are blank. */

const seen = (page: import("@playwright/test").Page) => page.addInitScript(() => { try { sessionStorage.setItem("anvaya-intention-intro", "1"); } catch { /* blocked */ } });
const project = () => test.info().project.name;
const phone = () => /mobile/.test(project());
const reduced = () => project() === "reduced-motion";

test("home opens on the glass-fan hero, shows the work and the bundles", async ({ page }) => {
  await seen(page); await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Ambitious ideas. Built to last.");
  await expect(page.locator(".hero-fallback")).toHaveCount(1);
  await expect(page.locator(".hero").getByRole("link", { name: "Start a Project" })).toBeVisible();
  await expect(page.locator(".hero-clock")).toContainText("IST");
  await expect(page.getByRole("heading", { name: /West Road Residence/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Launch Essential" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/coming soon/i);
  expect(await page.locator("main s").count()).toBe(0); // no struck-through prices
});

test("the glass scene goes live, or its CSS fan stays", async ({ page }) => {
  await seen(page); await page.goto("/");
  if (reduced()) { await page.waitForTimeout(1500); await expect(page.locator(".live-scene")).toHaveCount(0); await expect(page.locator(".hero-fallback")).toHaveCount(1); return; }
  // Shader compilation under software rendering (headless CI) can take several seconds.
  await expect(page.locator(".live-scene")).toHaveAttribute("data-scene", /ready|failed/, { timeout: 15_000 });
  // The headline entrance finishes with every letter visible.
  await expect.poll(() => page.locator(".hero-lede-top").evaluate(el => getComputedStyle(el).opacity), { timeout: 8000 }).toBe("1");
});

test("WebGL failure keeps the fan, the headline and the actions", async ({ page }) => {
  await seen(page);
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) { if (/webgl/i.test(type)) return null; return (original as (...a: unknown[]) => unknown).call(this, type, ...args); } as typeof original; });
  await page.goto("/");
  if (!reduced()) await expect(page.locator(".live-scene")).toHaveAttribute("data-scene", "failed", { timeout: 15_000 });
  await expect(page.locator(".hero-fallback")).toBeVisible();
  await page.locator(".hero").getByRole("link", { name: "Start a Project" }).click(); await expect(page).toHaveURL(/\/project$/);
});

test("content is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: "http://127.0.0.1:3107" }); const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".opening")).toBeHidden();
  await expect(page.getByRole("heading", { name: "Launch Essential" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /West Road/ })).toBeVisible();
  await context.close();
});

test("the opening plays once per session on Home only", async ({ page }) => {
  test.skip(reduced(), "the opening never plays under reduced motion");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-opening", "done", { timeout: 5000 });
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-opening", /.+/);
  await page.evaluate(() => sessionStorage.clear()); await page.goto("/pricing");
  await expect(page.locator("html")).not.toHaveAttribute("data-opening", /.+/);
});

test("reduced motion shows everything at once", async ({ page }) => {
  test.skip(!reduced(), "reduced-motion project only");
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/anim/);
  await expect(page.locator("html")).not.toHaveAttribute("data-opening", /.+/);
  expect(await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("main h2, main [data-rise]")].filter(el => { const s = getComputedStyle(el); return s.visibility === "hidden" || s.opacity === "0"; }).length)).toBe(0);
});

test("navigation: a nav pill on desktop, a dock on phones", async ({ page }) => {
  await seen(page); await page.goto("/");
  if (phone()) {
    await expect(page.locator(".bar-nav")).toBeHidden();
    await expect(page.locator(".dock")).toBeVisible();
    await page.locator(".dock").getByRole("link", { name: "Bundles" }).click();
  } else {
    await expect(page.locator(".dock")).toBeHidden();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Bundles" }).click();
  }
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Bundles and pricing.");
  await expect(page.locator(".route-veil")).toBeHidden({ timeout: 6000 });
  await page.goBack(); await expect(page).toHaveURL(/\/$/);
});

test("home reads in one order and both bundle sets are visible with prices", async ({ page }) => {
  await seen(page); await page.goto("/");
  const order = await page.locator("main > section").evaluateAll(sections => sections.map(s => s.id).filter(Boolean));
  expect(order).toEqual(["top", "what-we-build", "work", "how", "bundles", "faq", "next-move"]);
  const bundles = page.locator("#bundles");
  for (const [name, price] of [["Launch Essential", "$1,500"], ["Launch Pro", "$3,500"], ["Get Found", "$600"], ["Get Booked", "$1,200"]]) {
    const card = bundles.locator("article", { has: page.getByRole("heading", { name }) });
    await expect(card).toBeVisible(); await expect(card).toContainText(price);
  }
  await expect(bundles.locator(".bundle-flag")).toHaveCount(2);
  expect(await page.locator("[role=tab]").count()).toBe(0);
  await page.goto("/project?bundle=get-booked");
  await expect(page.getByRole("checkbox", { name: /Websites & Branding/ })).toBeChecked();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.locator("textarea[name=outcome]")).toHaveValue(/Get Booked \(\$1,200\)/);
});

test("the assistant opens and hands off when no model key is configured", async ({ page }) => {
  await seen(page); await page.goto("/");
  if (phone()) await page.locator(".dock").getByRole("button", { name: "Ask" }).click();
  else await page.getByRole("button", { name: "Ask Anvaya" }).click();
  const panel = page.getByRole("dialog", { name: "Ask Anvaya" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "How do payments work?" }).click();
  await expect(panel.getByRole("status")).toContainText(/project form/);
  await expect(panel.getByRole("link", { name: "Project form" })).toHaveAttribute("href", "/project");
  await page.keyboard.press("Escape"); await expect(panel).toBeHidden();
});

test("search data: canonical, structured data, robots and sitemap", async ({ page, request }) => {
  await seen(page); await page.goto("/");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
  expect(await page.locator("meta[property='og:image']").getAttribute("content")).not.toMatch(/localhost/);
  const graph = JSON.parse(await page.locator("script[type='application/ld+json']").first().textContent() || "{}")["@graph"];
  const studio = graph.find((node: { "@type": string }) => node["@type"] === "ProfessionalService");
  expect(studio.hasOfferCatalog.itemListElement).toHaveLength(5);
  expect(studio.hasOfferCatalog.itemListElement[0]).toMatchObject({ priceCurrency: "INR", price: "70000" });
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/OAI-SearchBot/); expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/); expect(robots).not.toMatch(/localhost/);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toMatch(/\/pricing</); expect(sitemap).not.toMatch(/\/about</); expect(sitemap).not.toMatch(/digital-products/);
});

test("narrow screens never scroll sideways", async ({ page }) => {
  await seen(page);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    for (const path of ["/", "/pricing", "/work", "/project"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${path} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
