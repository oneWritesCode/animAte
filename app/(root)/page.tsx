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
      <Library />
      {/* <section className="w-full h-[40vh]"></section> */}
      {/* how to use  */} <HowToUse />
      {/* about playground */} <AboutPlayground />
      {/* how to contribute <HowToContribute /> */}
      {/* sponsors */} <Sponsors />
      {/* footer */} <Footer />
    </main>
  );
}
