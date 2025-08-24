import Navigation from "@/components/navigation";
import SkillsSection from "@/components/skills-section";
import Footer from "@/components/footer";

export default function Skills() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-8">
        <SkillsSection />
      </main>
      <Footer />
    </div>
  );
}