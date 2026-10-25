import { launchBrowser } from "./browser.mjs";
import assert from "node:assert/strict";
const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.screenshot({ path: "/home/user/desktop.png", fullPage: false });
await page.getByRole("button", { name: "Next featured vehicle" }).click();
assert.match(await page.locator(".vehicle-caption").innerText(), /BMW/);
await page.locator("#configurator").scrollIntoViewIfNeeded();
await page.locator("#vehicle").selectOption("3");
await page.getByRole("button", { name: "Electric blue", exact: true }).click();
assert.equal(
  await page
    .getByRole("button", { name: "Electric blue", exact: true })
    .getAttribute("aria-pressed"),
  "true",
);
await page.getByRole("button", { name: "Forged", exact: true }).click();
await page.getByRole("button", { name: "Rear", exact: true }).click();
await page.waitForTimeout(2000);
assert.match(
  await page.locator(".live-summary").innerText(),
  /Electric blue.*Forged/,
);
assert.equal(await page.locator("canvas").count(), 1);
await page.getByRole("button", { name: "Zoom in", exact: true }).click();
await page.getByRole("button", { name: "Zoom out", exact: true }).click();
await page.locator("canvas").focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("+");
await page.keyboard.press("Home");
await page.getByRole("button", { name: "Reset camera", exact: true }).click();
await page.screenshot({ path: "/home/user/config.png" });
await page.locator("#experience").scrollIntoViewIfNeeded();
for (let i = 0; i < 4; i++) {
  await page
    .getByRole("button", { name: new RegExp(`^Gallery scene ${i + 1}:`) })
    .click();
  await page.locator(".experience>img").evaluate((image) => image.decode());
  assert.equal(
    await page
      .locator(".experience>img")
      .evaluate((image) => image.naturalWidth > 0),
    true,
  );
}
await page.locator("#configurator").scrollIntoViewIfNeeded();
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.getByRole("button", { name: "SAVE YOUR CONFIGURATION" }).click(),
]);
assert.equal(download.suggestedFilename(), "NEW-COM-your-build.txt");
await page.locator(".contact-link").click();
await page.getByLabel("Your name").fill("Test Driver");
await page.getByLabel("Email address").fill("test@example.com");
await page.getByLabel("What moves you?").fill("A concept showroom enquiry.");
await Promise.all([
  page.waitForEvent("download"),
  page.getByRole("button", { name: "CREATE MESSAGE DRAFT" }).click(),
]);
assert.match(
  await page.locator(".sent-message").innerText(),
  /has not been sent/,
);
await page.getByRole("button", { name: "BACK TO THE SHOWROOM" }).click();
assert.equal(
  await page
    .locator(".contact-link")
    .evaluate((el) => el === document.activeElement),
  true,
  "Contact dialog returns keyboard focus",
);
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.screenshot({ path: "/home/user/mobile.png" });
assert.equal(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  ),
  true,
  "Mobile horizontal overflow",
);
await page.getByRole("button", { name: "Open menu" }).click();
await page
  .locator(".nav")
  .getByRole("link", { name: "CONFIGURATOR", exact: true })
  .click();
assert.equal(await page.locator(".nav").getAttribute("class"), "nav");
for (const width of [360, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    `Overflow at ${width}px`,
  );
}
await page.emulateMedia({ reducedMotion: "reduce" });
assert.equal(
  await page
    .locator(".hero-car")
    .evaluate((el) => getComputedStyle(el).animationName),
  "none",
);
assert.deepEqual(errors, []);
console.log(
  "PASS: vehicle switching, 3D loading, paint/wheel/camera and keyboard controls, all gallery images, build download, contact draft, mobile navigation, four responsive widths, reduced motion, no browser errors.",
);
await browser.close();
