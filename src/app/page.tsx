import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { ResumeCTA } from "@/components/ResumeCTA";
import { Skills } from "@/components/Skills";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const portfolioData = await getPortfolioData();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020403] text-slate-100">
      <AnimatedBackground />

      <div className="relative z-10">
        <Navbar siteConfig={portfolioData.siteConfig} />
        <Hero
          siteProfile={portfolioData.siteProfile}
          projects={portfolioData.projects}
          skillCategories={portfolioData.skillCategories}
          experiences={portfolioData.experiences}
          achievements={portfolioData.achievements}
          certifications={portfolioData.certifications}
        />
        <About siteProfile={portfolioData.siteProfile} />
        <Skills skillCategories={portfolioData.skillCategories} />
        <Projects projects={portfolioData.projects} />
        <Experience experiences={portfolioData.experiences} />
        <Achievements achievements={portfolioData.achievements} />
        <Certifications certifications={portfolioData.certifications} />
        <ResumeCTA siteProfile={portfolioData.siteProfile} />
        <Contact siteProfile={portfolioData.siteProfile} />
        <Footer siteProfile={portfolioData.siteProfile} />
      </div>
    </main>
  );
}
