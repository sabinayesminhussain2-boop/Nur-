import { launchBrowser } from "./browser.mjs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const browser = await launchBrowser();
const base = process.env.BASE_URL || "http://localhost:5173";
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(base, { waitUntil: "networkidle" });
// Every internal anchor resolves to a real section, including contact.
for (const href of await page
  .locator('a[href^="#"]')
  .evaluateAll((links) => links.map((a) => a.getAttribute("href"))))
  assert.ok(await page.locator(href).count(), `Dead anchor: ${href}`);
for (const link of await page.locator("nav a").all()) {
  await link.click();
  assert.equal(await page.locator("nav").getAttribute("class"), "nav");
}
for (const id of ["bmw", "amg", "porsche", "urus"]) {
  const panel = page.locator(`#vehicle-${id}`);
  for (const angle of await panel.locator(".vehicle-angles button").all()) {
    await angle.click();
    await panel.locator("img").evaluate((img) => img.decode());
    assert.equal(await angle.getAttribute("aria-pressed"), "true");
  }
  await panel.getByRole("button", { name: "EXPLORE", exact: true }).click();
  assert.match(
    await page
      .getByRole("combobox", { name: "Vehicle specifications" })
      .locator("option:checked")
      .innerText(),
    new RegExp(
      id === "amg" ? "MERCEDES" : id === "urus" ? "LAMBORGHINI" : id,
      "i",
    ),
  );
  await panel.getByRole("button", { name: "CONFIGURE", exact: true }).click();
  assert.equal(
    await page.locator("#vehicle").inputValue(),
    String({ porsche: 0, bmw: 1, amg: 2, urus: 3 }[id]),
  );
}
const canvas = page.locator("canvas");
const ready = async () => {
  await page
    .getByRole("button", { name: "Reset camera", exact: true })
    .waitFor();
  await page.waitForFunction(
    () =>
      !document
        .querySelector('[aria-label="Reset camera"]')
        .matches(":disabled"),
  );
};
const shot = async () => {
  await page.waitForTimeout(180);
  return createHash("sha256")
    .update(await canvas.screenshot())
    .digest("hex");
};
const changes = async (action, label) => {
  const before = await shot();
  await action();
  const after = await shot();
  assert.notEqual(after, before, `${label} must change rendered pixels`);
};
for (let i = 0; i < 4; i++) {
  await page.locator("#vehicle").selectOption(String(i));
  await ready();
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  for (const color of [
    "Metallic silver",
    "Gloss black",
    "Electric blue",
    "Racing red",
    "Pearl white",
    "Neon pink",
  ])
    await changes(
      () => page.getByRole("button", { name: color, exact: true }).click(),
      `Vehicle ${i}: ${color}`,
    );
  for (const wheel of ["Performance", "Forged", "Sport"])
    await changes(
      () => page.getByRole("button", { name: wheel, exact: true }).click(),
      `Vehicle ${i}: ${wheel} geometry`,
    );
}
for (const interior of ["Cognac", "Chalk", "Onyx"])
  await changes(
    () => page.getByRole("button", { name: interior, exact: true }).click(),
    `${interior} interior cutaway`,
  );
for (const lighting of ["Cool night", "Daylight", "Pink studio"])
  await changes(
    () => page.locator("#lighting").selectOption(lighting),
    `${lighting} lighting`,
  );
for (const view of ["Front", "Side", "Rear", "Interior"])
  await changes(
    () =>
      page
        .locator(".viewer-controls")
        .getByRole("button", { name: view, exact: true })
        .click(),
    `${view} camera`,
  );
for (const command of ["Zoom in", "Zoom out", "Reset camera"])
  await changes(
    () => page.getByRole("button", { name: command, exact: true }).click(),
    command,
  );
await canvas.focus();
for (const key of [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "+",
  "-",
  "ArrowLeft",
  "Home",
])
  await changes(() => page.keyboard.press(key), `Keyboard ${key}`);
await changes(async () => {
  const b = await canvas.boundingBox();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.7, b.y + b.height * 0.6, {
    steps: 12,
  });
  await page.mouse.up();
}, "Mouse orbit");
await page.locator("#vehicle").selectOption("2");
await ready();
await page.getByRole("button", { name: "Electric blue", exact: true }).click();
await page.getByRole("button", { name: "Forged", exact: true }).click();
await page.getByRole("button", { name: "Cognac", exact: true }).click();
await page.locator("#lighting").selectOption("Cool night");
await page
  .getByRole("button", { name: "RESET CONFIGURATION", exact: true })
  .click();
await ready();
assert.equal(await page.locator("#vehicle").inputValue(), "0");
assert.equal(
  await page
    .getByRole("button", { name: "Neon pink", exact: true })
    .getAttribute("aria-pressed"),
  "true",
);
assert.equal(
  await page
    .getByRole("button", { name: "Sport", exact: true })
    .getAttribute("aria-pressed"),
  "true",
);
assert.equal(
  await page
    .getByRole("button", { name: "Onyx", exact: true })
    .getAttribute("aria-pressed"),
  "true",
);
assert.equal(await page.locator("#lighting").inputValue(), "Pink studio");
for (const name of ["Next gallery image", "Previous gallery image"]) {
  const old = await page.locator(".experience>img").getAttribute("src");
  await page.getByRole("button", { name }).click();
  assert.notEqual(
    await page.locator(".experience>img").getAttribute("src"),
    old,
  );
}
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 950 });
  for (const id of [
    "home",
    "collection",
    "configurator",
    "experience",
    "performance",
    "about",
    "contact",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `${id} overflow at ${width}`,
    );
  }
}
// Graceful context-loss fallback: controls disabled, honest explanation, retry recovers.
await page.locator("#configurator").scrollIntoViewIfNeeded();
await canvas.evaluate((c) =>
  c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
);
await page.locator(".fallback").waitFor();
assert.equal(
  await page
    .getByRole("button", { name: "Reset camera", exact: true })
    .isDisabled(),
  true,
);
assert.match(await page.locator(".fallback").innerText(), /does not change/);
await page.getByRole("button", { name: "RETRY 3D VIEW" }).click();
await ready();
assert.equal(await canvas.count(), 1);
assert.deepEqual(errors, []);
// No WebGL: no uncaught error and vehicle selection/download still work.
const fallback = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await fallback.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    return type === "webgl2" ? null : original.call(this, type, ...args);
  };
});
await fallback.goto(base);
await fallback.locator("#configurator").scrollIntoViewIfNeeded();
await fallback.locator(".fallback").waitFor();
await fallback.locator("#vehicle").selectOption("1");
assert.match(
  await fallback.locator(".fallback img").getAttribute("alt"),
  /BMW/,
);
await Promise.all([
  fallback.waitForEvent("download"),
  fallback.getByRole("button", { name: "SAVE YOUR CONFIGURATION" }).click(),
]);
// Real touch events through CDP exercise OrbitControls' touch path.
const touch = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  reducedMotion: "reduce",
});
await touch.goto(base);
await touch.locator("#configurator").scrollIntoViewIfNeeded();
await touch.waitForFunction(
  () =>
    !document.querySelector('[aria-label="Reset camera"]').matches(":disabled"),
);
const tc = touch.locator("canvas");
await tc.scrollIntoViewIfNeeded();
const before = await tc.screenshot();
const b = await tc.boundingBox();
const cdp = await touch.context().newCDPSession(touch);
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchStart",
  touchPoints: [{ x: b.x + b.width * 0.4, y: b.y + b.height * 0.5 }],
});
for (let i = 1; i <= 8; i++)
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: b.x + b.width * (0.4 + i * 0.035), y: b.y + b.height * 0.5 },
    ],
  });
await cdp.send("Input.dispatchTouchEvent", {
  type: "touchEnd",
  touchPoints: [],
});
await touch.waitForTimeout(300);
assert.notDeepEqual(await tc.screenshot(), before, "Touch drag changes camera");
await browser.close();
console.log(
  "PASS: all vehicle scenes and galleries; all four GLBs; six paint colors; three wheel geometries; interior cutaways; lighting; every camera/keyboard command; mouse and touch orbit; full reset; contact anchor; five responsive widths; context-loss recovery; no-WebGL fallback and download. Rendered-pixel changes verified.",
);
