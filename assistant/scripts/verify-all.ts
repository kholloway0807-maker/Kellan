/** Runs every verify-tier*.ts in order, stopping on the first failure. */
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = readdirSync(here)
  .filter((f) => /^verify-tier\d+\.ts$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));

for (const script of scripts) {
  execFileSync("npx", ["tsx", path.join(here, script)], {
    stdio: "inherit",
    env: { ...process.env, KELLAN_PROVIDER: "mock" },
  });
}
console.log(`\nall ${scripts.length} tier verifications passed`);
