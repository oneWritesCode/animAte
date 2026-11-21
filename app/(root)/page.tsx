import AboutLibrary from "@/components/AboutLibrary";
import AboutPlayground from "@/components/AboutPlayground";
import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import HowToContribute from "@/components/HowToContribute";
import HowToUse from "@/components/HowToUse";
import { Library } from "@/components/Library";
import { Navbar } from "@/components/Navbar";
import Sponsors from "@/components/Sponsors";

export default function Page() {
  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <AboutLibrary />
      {/* <section className="w-full h-[40vh]"></section> */}
      {/* about playground */} <AboutPlayground />
      {/* how to use  */} <HowToUse />
      {/* how to contribute <HowToContribute /> */}
      {/* sponsors */} <Sponsors />
      {/* footer */} <Footer />
    </main>
  );
}
