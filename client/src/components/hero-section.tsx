import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useGitHubUser } from "@/hooks/use-github-stats";
import type { Portfolio } from "@shared/schema";

export default function HeroSection() {
  const queryClient = useQueryClient();

  const { data: portfolio, isLoading } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const { data: githubUser, isLoading: githubLoading } = useGitHubUser("atulmahankal");

  const updateViewsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/portfolio/views", { method: "POST" });
      if (!response.ok) throw new Error("Failed to update views");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });

  const handleViewPortfolio = () => {
    updateViewsMutation.mutate();
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContact = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading || githubLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-portfolio-accent">Loading...</div>
      </section>
    );
  }

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-16"
      data-testid="hero-section"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-portfolio-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div 
          className="absolute top-40 right-20 w-72 h-72 bg-portfolio-success rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" 
          style={{ animationDelay: "2s" }}
        ></div>
        <div 
          className="absolute -bottom-32 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" 
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Profile picture with gradient border */}
          <div className="w-32 h-32 mx-auto mb-8 relative" data-testid="profile-avatar">
            <div className="absolute inset-0 gradient-border rounded-full p-1">
              <div className="w-full h-full bg-portfolio-background rounded-full flex items-center justify-center overflow-hidden">
                {githubUser?.avatar_url ? (
                  <img 
                    src={githubUser.avatar_url} 
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User size={48} className="text-portfolio-accent" />
                )}
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
            Hi 👋, I'm <span className="text-portfolio-accent">Atul</span>
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-8 font-light" data-testid="hero-subtitle">
            {portfolio?.title || "A passionate fullstack developer from India"}
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
            {portfolio?.bio || "Building modern web applications with cutting-edge technologies."}
          </p>
        </div>
        
        {/* GitHub Profile Views Counter */}
        <div className="mb-8" data-testid="profile-views">
          <div className="inline-flex items-center bg-portfolio-primary/50 px-4 py-2 rounded-full border border-portfolio-accent/20">
            <span className="text-sm text-slate-400 mr-2">GitHub Profile views:</span>
            <span className="text-portfolio-accent font-semibold">
              1,361
            </span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleContact}
            className="bg-portfolio-accent hover:bg-blue-600 text-white px-8 py-3 font-semibold transition-all duration-300 hover-lift"
            data-testid="button-contact"
          >
            Get In Touch
          </Button>
          <Button
            variant="outline"
            onClick={handleViewPortfolio}
            className="glass px-8 py-3 font-semibold transition-all duration-300 hover-lift border-portfolio-accent/20 text-slate-300 hover:text-white"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
