import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, Building2, Code, Filter } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Get unique companies for filter (filter out empty values)
  const companies = Array.from(new Set(projects.map(p => p.companyName).filter(name => name && name.trim()))).sort();

  // Filter projects based on search term and company
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.info.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.toolsUsed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = companyFilter === "all" || project.companyName === companyFilter;
    
    return matchesSearch && matchesCompany;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-background">
        <div className="animate-pulse text-portfolio-accent">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="projects-title">
            My <span className="text-portfolio-accent">Projects</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore my portfolio of web applications, mobile apps, and software solutions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-portfolio-primary/30 p-6 rounded-lg border border-portfolio-accent/20">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search projects by title, description, or tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-portfolio-background/50 border-portfolio-accent/20"
              data-testid="search-projects"
            />
          </div>
          
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-full md:w-[200px] bg-portfolio-background/50 border-portfolio-accent/20" data-testid="filter-company">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-4">No projects found matching your criteria</div>
            <Button 
              variant="outline" 
              onClick={() => {setSearchTerm(""); setCompanyFilter("all");}}
              className="border-portfolio-accent/20 text-slate-300"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Project Details Modal */}
        {selectedProject && (
          <ProjectDetailsModal 
            project={selectedProject} 
            open={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const tools = project.toolsUsed.split(',').map(tool => tool.trim()).filter(Boolean);

  return (
    <Card 
      className="group cursor-pointer hover-lift bg-portfolio-primary/30 border-portfolio-accent/20 hover:border-portfolio-accent/40 transition-all duration-300"
      onClick={onClick}
      data-testid={`card-project-${project.id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 group-hover:text-portfolio-accent transition-colors" data-testid={`text-project-title-${project.id}`}>
              {project.title}
            </CardTitle>
            <div className="flex items-center text-slate-400 mb-2">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="text-sm" data-testid={`text-company-${project.id}`}>{project.companyName}</span>
            </div>
          </div>
          {project.link && (
            <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-portfolio-accent transition-colors" />
          )}
        </div>
        <CardDescription className="text-slate-300 line-clamp-3" data-testid={`text-project-info-${project.id}`}>
          {project.info}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center text-slate-400 mb-3">
          <Code className="w-4 h-4 mr-2" />
          <span className="text-sm">Tools & Technologies</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tools.slice(0, 4).map((tool, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-portfolio-accent/10 text-portfolio-accent border-portfolio-accent/20"
              data-testid={`badge-tool-${tool.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {tool}
            </Badge>
          ))}
          {tools.length > 4 && (
            <Badge variant="outline" className="border-slate-500 text-slate-400">
              +{tools.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectDetailsModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

function ProjectDetailsModal({ project, open, onClose }: ProjectDetailsModalProps) {
  const tools = project.toolsUsed.split(',').map(tool => tool.trim()).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-portfolio-primary border-portfolio-accent/20">
        <DialogHeader>
          <DialogTitle className="text-2xl text-portfolio-accent mb-2" data-testid={`modal-title-${project.id}`}>
            {project.title}
          </DialogTitle>
          <DialogDescription className="flex items-center text-slate-400 mb-4">
            <Building2 className="w-4 h-4 mr-2" />
            <span data-testid={`modal-company-${project.id}`}>{project.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Short Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-slate-300" data-testid={`modal-overview-${project.id}`}>{project.info}</p>
          </div>

          {/* Long Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Detailed Description</h3>
            <div className="text-slate-300" data-testid={`modal-description-${project.id}`}>
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Style markdown components to match our dark theme
                    h1: ({children}) => <h1 className="text-2xl font-bold text-portfolio-accent mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold text-slate-200 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-medium text-slate-200 mb-2">{children}</h3>,
                    h4: ({children}) => <h4 className="text-base font-medium text-slate-200 mb-2">{children}</h4>,
                    h5: ({children}) => <h5 className="text-sm font-medium text-slate-200 mb-1">{children}</h5>,
                    h6: ({children}) => <h6 className="text-sm font-medium text-slate-200 mb-1">{children}</h6>,
                    p: ({children}) => <p className="text-slate-300 mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside text-slate-300 mb-3 space-y-1 pl-4">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside text-slate-300 mb-3 space-y-1 pl-4">{children}</ol>,
                    li: ({children}) => <li className="text-slate-300 mb-1">{children}</li>,
                    strong: ({children}) => <strong className="text-portfolio-accent font-semibold">{children}</strong>,
                    b: ({children}) => <b className="text-portfolio-accent font-semibold">{children}</b>,
                    em: ({children}) => <em className="text-slate-200 italic">{children}</em>,
                    i: ({children}) => <i className="text-slate-200 italic">{children}</i>,
                    code: ({children}) => <code className="bg-portfolio-primary/50 text-portfolio-accent px-2 py-1 rounded text-sm font-mono">{children}</code>,
                    pre: ({children}) => <pre className="bg-portfolio-primary/50 p-4 rounded-lg overflow-x-auto mb-3 text-sm">{children}</pre>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-portfolio-accent pl-4 text-slate-300 italic mb-3 bg-portfolio-primary/20 py-2">{children}</blockquote>,
                    a: ({children, href}) => <a href={href} className="text-portfolio-accent hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer">{children}</a>,
                    hr: () => <hr className="border-slate-600 my-4" />,
                    br: () => <br className="mb-2" />,
                    table: ({children}) => <div className="overflow-x-auto mb-4"><table className="min-w-full border border-slate-600">{children}</table></div>,
                    thead: ({children}) => <thead className="bg-portfolio-primary/50">{children}</thead>,
                    tbody: ({children}) => <tbody>{children}</tbody>,
                    tr: ({children}) => <tr className="border-b border-slate-600">{children}</tr>,
                    th: ({children}) => <th className="px-4 py-2 text-left text-slate-200 font-semibold">{children}</th>,
                    td: ({children}) => <td className="px-4 py-2 text-slate-300">{children}</td>,
                  }}
                >
                  {project.longDescription || 'No detailed description available.'}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Tools & Technologies */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-portfolio-accent/10 text-portfolio-accent border-portfolio-accent/20"
                  data-testid={`modal-tool-${tool.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Link */}
          {project.link && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Link</h3>
              <Button 
                asChild 
                className="bg-portfolio-accent hover:bg-blue-600"
                data-testid={`button-visit-project-${project.id}`}
              >
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Project
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}