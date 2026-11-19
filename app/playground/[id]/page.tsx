import { Suspense } from "react";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Playground from "@/components/playground/Playground";
import { componentAnimations } from "@/lib/animations/registry.generated";
import type { AnimationCode } from "@/lib/types";

// Only component (gsap / framer-motion / React) animations open here; CSS ones still use the modal.
export function generateStaticParams() {
  return componentAnimations.map((animation) => ({ id: animation.id }));
}

export default function AnimationPlaygroundPage({ params }: PageProps<"/playground/[id]">) {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <AnimationPlayground params={params} />
    </Suspense>
  );
}

async function AnimationPlayground({ params }: { params: PageProps<"/playground/[id]">["params"] }) {
  const { id } = await params;
  const animation = componentAnimations.find((item) => item.id === id);
  if (!animation) notFound();

  // Written by scripts/build-registry.ts
  const json = await readFile(path.join(process.cwd(), "public/r", `${id}.json`), "utf8");
  const { files } = JSON.parse(json) as AnimationCode;

  return (
    <Playground
      title={animation.name}
      initialFiles={files.map(({ name, code }) => ({ name, code }))}
    />
  );
}
