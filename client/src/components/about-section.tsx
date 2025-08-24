import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Rocket, CheckCircle } from "lucide-react";
import type { Portfolio } from "@shared/schema";

export default function AboutSection() {
  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="about-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="about-title">
            About <span className="text-portfolio-accent">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-portfolio-accent to-portfolio-success mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-portfolio-accent" data-testid="about-role">
              Full Stack Developer
            </h3>
            <p className="text-slate-300 leading-relaxed" data-testid="about-description-1">
              With expertise in both frontend and backend technologies, I create comprehensive web solutions 
              that deliver exceptional user experiences. My journey in software development spans multiple 
              technologies and frameworks.
            </p>
            <p className="text-slate-300 leading-relaxed" data-testid="about-description-2">
              I'm passionate about writing clean, efficient code and staying up-to-date with the latest 
              industry trends. Whether it's building responsive UIs or designing scalable backend architectures, 
              I bring dedication and innovation to every project.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="glass border-portfolio-accent/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-portfolio-accent" data-testid="stat-experience">
                    3+
                  </div>
                  <div className="text-sm text-slate-400">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="glass border-portfolio-accent/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-portfolio-success" data-testid="stat-projects">
                    50+
                  </div>
                  <div className="text-sm text-slate-400">Projects Completed</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Technical Expertise */}
            <Card className="glass border-portfolio-accent/20 hover-lift">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-4 text-portfolio-accent flex items-center" data-testid="expertise-title">
                  <Code className="mr-2" size={20} />
                  Technical Expertise
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center" data-testid="expertise-fullstack">
                    <CheckCircle className="text-portfolio-success mr-2" size={16} />
                    Full Stack Web Development
                  </li>
                  <li className="flex items-center" data-testid="expertise-api">
                    <CheckCircle className="text-portfolio-success mr-2" size={16} />
                    API Design & Integration
                  </li>
                  <li className="flex items-center" data-testid="expertise-database">
                    <CheckCircle className="text-portfolio-success mr-2" size={16} />
                    Database Architecture
                  </li>
                  <li className="flex items-center" data-testid="expertise-mobile">
                    <CheckCircle className="text-portfolio-success mr-2" size={16} />
                    Mobile App Development
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Current Focus */}
            <Card className="glass border-portfolio-success/20 hover-lift">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-4 text-portfolio-success flex items-center" data-testid="focus-title">
                  <Rocket className="mr-2" size={20} />
                  Current Focus
                </h4>
                <p className="text-slate-300" data-testid="focus-description">
                  Currently exploring cloud technologies and DevOps practices to build more scalable 
                  and maintainable applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
