import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import NewHero from "@/components/NewHero";
import { Navbar } from "@/components/Navbar";

export default function Page() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      {/* <NewHero/> */}
      <Library />
      <section className="w-full h-[40vh]"></section>
      {/* how to use  */}
      {/* how to contribute */}
      {/* sponsors */}
      {/* credits */}
      {/* footer */}
    </main>
  );
}
  