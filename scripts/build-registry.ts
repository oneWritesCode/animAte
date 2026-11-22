/**
 * Builds the animation registry from the real component files in src/animations.
 *
 *   npx tsx scripts/build-registry.ts        (or: npm run registry)
 *
 * Each animation is a folder:
 *   lib/animations/tsx/<animation-name>/
 *     meta.ts      -> metadata (not copied by users)
 *     index.tsx    -> the component, default export (copied by users)
 *     *.css, *.ts  -> optional extra files the component imports (copied by users)
 *
 * Output:
 *   public/r/<id>.json                         code + dependencies, fetched when the code panel opens
 *   lib/animations/registry.generated.ts       metadata + lazy loaders for live previews (no code)
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type {
  AnimationCode,
  CodeFile,
  CodeLanguage,
  ComponentAnimationItem,
  ComponentAnimationMeta,
} from "@/lib/types";

const projectRoot = process.cwd();
// Works with or without a `src/` folder (the "@/" alias points at whichever you use).
const sourceRoot = fs.existsSync(path.join(projectRoot, "src", "app"))
  ? path.join(projectRoot, "src")
  : projectRoot;
const animationsDirectory = path.join(sourceRoot, "lib/animations/tsx");
const publicOutputDirectory = path.join(projectRoot, "public/r");
const registryOutputFile = path.join(
  sourceRoot,
  "lib/animations/registry.generated.ts",
);

const META_FILE_NAME = "meta.ts";
const ENTRY_FILE_NAME = "index.tsx";
const IMPLICIT_PACKAGES = new Set(["react", "react-dom"]);
const LANGUAGE_BY_EXTENSION: Record<string, CodeLanguage> = {
  ".tsx": "tsx",
  ".ts": "ts",
  ".jsx": "jsx",
  ".js": "js",
  ".css": "css",
  ".html": "html",
};
const SCRIPT_LANGUAGES = new Set<CodeLanguage>(["tsx", "ts", "jsx", "js"]);

const errors: string[] = [];
const reportError = (folderName: string, message: string) =>
  errors.push(`${folderName}: ${message}`);

/* -------------------------------------------------------------------------- */
/*  Reading the animation folders                                              */
/* -------------------------------------------------------------------------- */

function findAnimationFolders(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const hasMeta = entries.some(
    (entry) => entry.isFile() && entry.name === META_FILE_NAME,
  );
  if (hasMeta) return [directory];

  return entries
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => findAnimationFolders(path.join(directory, entry.name)));
}

function readCodeFiles(folder: string): CodeFile[] {
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== META_FILE_NAME)
    .filter((entry) => LANGUAGE_BY_EXTENSION[path.extname(entry.name)])
    .map((entry) => ({
      name: entry.name,
      language: LANGUAGE_BY_EXTENSION[path.extname(entry.name)],
      code:
        fs.readFileSync(path.join(folder, entry.name), "utf8").trimEnd() + "\n",
    }))
    .sort((a, b) => {
      if (a.name === ENTRY_FILE_NAME) return -1;
      if (b.name === ENTRY_FILE_NAME) return 1;
      return a.name.localeCompare(b.name);
    });
}

/* -------------------------------------------------------------------------- */
/*  Validation: a snippet must work when pasted into a stranger's project      */
/* -------------------------------------------------------------------------- */

const IMPORT_SPECIFIER_PATTERN =
  /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)["']([^"']+)["']/g;

function findImportSpecifiers(code: string): string[] {
  return [...code.matchAll(IMPORT_SPECIFIER_PATTERN)].map((match) => match[1]);
}

function getPackageName(specifier: string): string {
  const segments = specifier.split("/");
  return specifier.startsWith("@")
    ? segments.slice(0, 2).join("/")
    : segments[0];
}

function relativeImportExists(
  specifier: string,
  fileNames: Set<string>,
): boolean {
  const normalized = path.posix.normalize(specifier);
  if (normalized.startsWith("..")) return false;

  const extensions = Object.keys(LANGUAGE_BY_EXTENSION);
  const candidates = [
    normalized,
    ...extensions.map((extension) => `${normalized}${extension}`),
    ...extensions.map((extension) => `${normalized}/index${extension}`),
  ];
  return candidates.some((candidate) => fileNames.has(candidate));
}

function validateSnippet(
  folderName: string,
  meta: ComponentAnimationMeta,
  files: CodeFile[],
) {
  const entryFile = files.find((file) => file.name === ENTRY_FILE_NAME);
  if (!entryFile) {
    reportError(folderName, `missing ${ENTRY_FILE_NAME}`);
    return;
  }
  if (!/export\s+default\b/.test(entryFile.code)) {
    reportError(
      folderName,
      `${ENTRY_FILE_NAME} needs a default export (the component)`,
    );
  }

  const fileNames = new Set(files.map((file) => file.name));
  const declaredPackages = new Set(meta.dependencies);

  for (const file of files.filter((candidate) =>
    SCRIPT_LANGUAGES.has(candidate.language),
  )) {
    for (const specifier of findImportSpecifiers(file.code)) {
      if (specifier.startsWith(".")) {
        if (!relativeImportExists(specifier, fileNames)) {
          reportError(
            folderName,
            `${file.name} imports "${specifier}", which is not in this folder`,
          );
        }
        continue;
      }

      if (specifier.startsWith("@/")) {
        reportError(
          folderName,
          `${file.name} imports "${specifier}": project aliases can't be pasted into a user's project`,
        );
        continue;
      }

      const packageName = getPackageName(specifier);
      if (
        !IMPLICIT_PACKAGES.has(packageName) &&
        !declaredPackages.has(packageName)
      ) {
        reportError(
          folderName,
          `${file.name} imports "${specifier}" but "${packageName}" is not listed in meta.dependencies`,
        );
      }
    }
  }

  // The reverse mistake: declaring a package nobody imports.
  const importedPackages = new Set(
    files
      .flatMap((file) => findImportSpecifiers(file.code))
      .map(getPackageName),
  );
  for (const declared of declaredPackages) {
    if (!importedPackages.has(declared)) {
      reportError(
        folderName,
        `meta.dependencies lists "${declared}" but no file imports it`,
      );
    }
  }
}

function validateMeta(
  folderName: string,
  meta: Partial<ComponentAnimationMeta> | undefined,
) {
  if (!meta) return reportError(folderName, "meta.ts needs a default export");
  for (const field of ["id", "name", "category", "dependencies"] as const) {
    if (meta[field] === undefined)
      reportError(folderName, `meta.${field} is required`);
  }
  if (meta.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.id)) {
    reportError(folderName, `meta.id "${meta.id}" must be kebab-case`);
  }
}

/* -------------------------------------------------------------------------- */
/*  Output                                                                     */
/* -------------------------------------------------------------------------- */

function toPreviewImportPath(folder: string): string {
  const relativePath = path
    .relative(sourceRoot, folder)
    .split(path.sep)
    .join("/");
  return `@/${relativePath}`;
}

function renderRegistryFile(
  items: ComponentAnimationItem[],
  importPathById: Map<string, string>,
): string {
  const loaderLines = items.map(
    (item) =>
      `  ${JSON.stringify(item.id)}: () => import(${JSON.stringify(importPathById.get(item.id))}),`,
  );

  return [
    "// AUTO-GENERATED by scripts/build-registry.ts. Do not edit by hand.",
    'import type { ComponentType } from "react";',
    'import type { ComponentAnimationItem } from "@/lib/types";',
    "",
    `export const componentAnimations: ComponentAnimationItem[] = ${JSON.stringify(items, null, 2)};`,
    "",
    "export const componentLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {",
    ...loaderLines,
    "};",
    "",
  ].join("\n");
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const folders = findAnimationFolders(animationsDirectory).sort();
  const items: ComponentAnimationItem[] = [];
  const importPathById = new Map<string, string>();
  const codeById = new Map<string, AnimationCode>();
  const folderById = new Map<string, string>();

  for (const folder of folders) {
    const folderName = path.relative(animationsDirectory, folder);
    const metaModule = await import(
      pathToFileURL(path.join(folder, META_FILE_NAME)).href
    );
    const meta: ComponentAnimationMeta | undefined = metaModule.default;

    validateMeta(folderName, meta);
    if (!meta?.id) continue;

    if (folderById.has(meta.id)) {
      reportError(
        folderName,
        `duplicate id "${meta.id}" (also used by ${folderById.get(meta.id)})`,
      );
      continue;
    }
    folderById.set(meta.id, folderName);

    const files = readCodeFiles(folder);
    validateSnippet(folderName, meta, files);

    items.push({
      source: "component",
      id: meta.id,
      name: meta.name,
      category: meta.category,
      tag: meta.tag,
      kind: meta.kind ?? "custom",
      dependencies: meta.dependencies,
      previewText: meta.previewText,
    });
    importPathById.set(meta.id, toPreviewImportPath(folder));
    codeById.set(meta.id, { dependencies: meta.dependencies, files });
  }

  if (errors.length > 0) {
    console.error(`\nRegistry not written. ${errors.length} problem(s):\n`);
    errors.forEach((message) => console.error(`  x ${message}`));
    process.exit(1);
  }

  items.sort((a, b) => a.id.localeCompare(b.id));

  fs.mkdirSync(publicOutputDirectory, { recursive: true });
  for (const stale of fs.readdirSync(publicOutputDirectory)) {
    if (stale.endsWith(".json"))
      fs.rmSync(path.join(publicOutputDirectory, stale));
  }
  for (const [id, code] of codeById) {
    fs.writeFileSync(
      path.join(publicOutputDirectory, `${id}.json`),
      JSON.stringify(code, null, 2) + "\n",
    );
  }

  fs.mkdirSync(path.dirname(registryOutputFile), { recursive: true });
  fs.writeFileSync(
    registryOutputFile,
    renderRegistryFile(items, importPathById),
  );

  console.log(`Registry built: ${items.length} component animation(s).`);
}

main();
