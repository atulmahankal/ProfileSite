import Navigation from "@/components/navigation";
import GitHubStatsSection from "@/components/github-stats-section";
import Footer from "@/components/footer";

export default function GitHub() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-16">
        <GitHubStatsSection />
      </main>
      <Footer />
    </div>
  );
}