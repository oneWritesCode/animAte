/**
 * Bundles the preview iframe's runtime into public/playground-runtime.js.
 *
 *   npx tsx scripts/build-playground-runtime.ts      (or: npm run playground:runtime)
 *
 * The bundle contains React, GSAP, framer-motion and Sucrase, taken from your node_modules,
 * so the playground always runs the same versions as the rest of the site.
 */

import { copyFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const projectRoot = process.cwd();

async function main() {
  const result = await build({
    entryPoints: [path.join(projectRoot, "lib/playground/runtime-entry.ts")],
    outfile: path.join(projectRoot, "public/playground-runtime.js"),
    bundle: true,
    minify: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    legalComments: "none",
    metafile: true,
    define: { "process.env.NODE_ENV": '"production"' },
    // framer-motion ships "use client" markers that mean nothing in a plain browser bundle.
    logOverride: { "unsupported-directive": "silent" },
    logLevel: "warning",
  });

  // Tailwind (v4, in-browser) so className="flex bg-red-500" works inside the preview.
  await copyFile(
    path.join(projectRoot, "node_modules/@tailwindcss/browser/dist/index.global.js"),
    path.join(projectRoot, "public/playground-tailwind.js"),
  );

  const bytes = Object.values(result.metafile.outputs).reduce((total, output) => total + output.bytes, 0);
  console.log(`Playground runtime built: public/playground-runtime.js (${(bytes / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
