import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Server, Wrench, Code } from "lucide-react";
import type { Skill } from "@shared/schema";

export default function SkillsSection() {
  const { data: skills = [], isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  const frontendSkills = getSkillsByCategory("Frontend");
  const backendSkills = getSkillsByCategory("Backend");
  const toolsSkills = [...getSkillsByCategory("Database"), ...getSkillsByCategory("Tools"), ...getSkillsByCategory("Mobile")];

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-portfolio-primary">
        <div className="text-center">
          <div className="animate-pulse text-portfolio-accent">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-portfolio-primary" data-testid="skills-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center" data-testid="skills-title">
            <Code className="mr-3 text-portfolio-accent" size={32} />
            Languages & <span className="text-portfolio-accent ml-2">Tools</span>
            <Wrench className="ml-3 text-portfolio-accent" size={32} />
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-portfolio-accent to-portfolio-success mx-auto mb-4"></div>
          <p className="text-slate-400 max-w-2xl mx-auto" data-testid="skills-description">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
          {skills.map((skill) => (
            <Card 
              key={skill.id} 
              className="glass border-portfolio-accent/20 hover-lift group"
              data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              <CardContent className="p-4 text-center">
                <i className={`${skill.icon} text-4xl ${skill.color} mb-2 group-hover:animate-bounce-slow`}></i>
                <p className="text-sm text-slate-300">{skill.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Skill Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass border-portfolio-accent/20 hover-lift">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-portfolio-accent flex items-center" data-testid="category-frontend">
                <Laptop className="mr-2" size={20} />
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontendSkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant="secondary" 
                    className="bg-portfolio-secondary text-slate-300 flex items-center gap-1"
                    data-testid={`frontend-skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <i className={`${skill.icon} text-sm ${skill.color}`}></i>
                    {skill.name}
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-portfolio-secondary text-slate-300 flex items-center gap-1">
                  <i className="fab fa-css3-alt text-sm text-blue-400"></i>
                  Tailwind CSS
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-portfolio-success/20 hover-lift">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-portfolio-success flex items-center" data-testid="category-backend">
                <Server className="mr-2" size={20} />
                Backend
              </h3>
              <div className="flex flex-wrap gap-2">
                {backendSkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant="secondary" 
                    className="bg-portfolio-secondary text-slate-300 flex items-center gap-1"
                    data-testid={`backend-skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <i className={`${skill.icon} text-sm ${skill.color}`}></i>
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass border-purple-400/20 hover-lift">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center" data-testid="category-tools">
                <Wrench className="mr-2" size={20} />
                Tools & Others
              </h3>
              <div className="flex flex-wrap gap-2">
                {toolsSkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant="secondary" 
                    className="bg-portfolio-secondary text-slate-300 flex items-center gap-1"
                    data-testid={`tools-skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <i className={`${skill.icon} text-sm ${skill.color}`}></i>
                    {skill.name}
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-portfolio-secondary text-slate-300 flex items-center gap-1">
                  <i className="fas fa-rocket text-sm text-orange-400"></i>
                  Postman
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
