import { chromium as playwright } from "@playwright/test";
import chromium from "@sparticuz/chromium";
import { brotliDecompressSync } from "node:zlib";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function launchBrowser() {
  const directory = join(tmpdir(), "newcom-browser-libraries");
  const libraryPath = join(directory, "lib");
  // The npm Chromium distribution includes the Linux libraries needed by
  // minimal containers. Extract these locally, without a browser CDN request.
  if (
    process.platform === "linux" &&
    !existsSync(join(libraryPath, "libnspr4.so"))
  ) {
    mkdirSync(directory, { recursive: true });
    const archive = join(directory, "libraries.tar");
    writeFileSync(
      archive,
      brotliDecompressSync(
        readFileSync(
          new URL(
            "../node_modules/@sparticuz/chromium/bin/al2023.tar.br",
            import.meta.url,
          ),
        ),
      ),
    );
    execFileSync("tar", ["-xf", archive, "-C", directory]);
  }
  return playwright.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    headless: true,
    env: {
      ...process.env,
      LD_LIBRARY_PATH: [libraryPath, process.env.LD_LIBRARY_PATH]
        .filter(Boolean)
        .join(":"),
    },
  });
}
