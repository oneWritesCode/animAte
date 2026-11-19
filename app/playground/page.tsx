import Playground from "@/components/playground/Playground";
import { STARTER_FILES } from "@/lib/playground/boilerplate";

export const metadata = { title: "Playground · animAte" };

export default function PlaygroundPage() {
  return <Playground title="Playground" initialFiles={STARTER_FILES} />;
}
