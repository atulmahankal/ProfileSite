import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Briefcase, Clock, Building, Search, Filter } from "lucide-react";
import type { Experience } from "@shared/schema";

function calculateDuration(fromDate: string, uptoDate: string | null): string {
  const from = new Date(fromDate + '-01');
  const to = uptoDate && uptoDate.toLowerCase() !== 'present' 
    ? new Date(uptoDate + '-01') 
    : new Date();
  
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const totalMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0 && months === 0) {
    return '1 month';
  } else if (years === 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else if (months === 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else {
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  }
}

function ExperienceSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  const { data: experiences, isLoading, error } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  // Filter experiences based on search and filters
  const filteredExperiences = experiences?.filter(experience => {
    const matchesSearch = searchTerm === "" || 
      experience.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (experience.workDescriptions && experience.workDescriptions.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMode = modeFilter === "all" || experience.mode === modeFilter;
    const matchesCompany = companyFilter === "all" || experience.company === companyFilter;
    
    return matchesSearch && matchesMode && matchesCompany;
  }) || [];

  // Get unique values for filters
  const uniqueModes = Array.from(new Set(experiences?.map(exp => exp.mode).filter(Boolean) || []));
  const uniqueCompanies = Array.from(new Set(experiences?.map(exp => exp.company) || []));

  if (isLoading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Briefcase className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-5xl font-bold text-white mb-4">Experience</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              My professional journey and career milestones
            </p>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Briefcase className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Experience</h2>
          <p className="text-xl text-red-400">Failed to load experience data. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Briefcase className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-white mb-4">Experience</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            My professional journey showcasing the roles and responsibilities that have shaped my career
          </p>
        </div>

        {experiences && experiences.length > 0 && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Filter Experience</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by role, company, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  data-testid="search-input"
                />
              </div>
              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white" data-testid="mode-filter">
                  <SelectValue placeholder="Filter by work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Modes</SelectItem>
                  {uniqueModes.map(mode => (
                    <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white" data-testid="company-filter">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {uniqueCompanies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || modeFilter !== "all" || companyFilter !== "all") && (
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredExperiences.length} of {experiences.length} experiences
              </div>
            )}
          </div>
        )}

        {filteredExperiences && filteredExperiences.length > 0 ? (
          <div className="space-y-8">
            {filteredExperiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300"
                data-testid={`card-experience-${experience.id}`}
              >
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl mb-2" data-testid={`text-designation-${experience.id}`}>
                        {experience.designation}
                      </CardTitle>
                      <div className="flex items-center text-blue-400 text-lg mb-3" data-testid={`text-company-${experience.id}`}>
                        <Building className="h-5 w-5 mr-2" />
                        {experience.company}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center" data-testid={`text-duration-${experience.id}`}>
                          <CalendarDays className="h-4 w-4 mr-2" />
                          <span>
                            {experience.fromDate} - {experience.uptoDate || 'Present'}
                            <span className="ml-2 text-blue-400 font-medium">
                              ({calculateDuration(experience.fromDate, experience.uptoDate)})
                            </span>
                          </span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center" data-testid={`text-location-${experience.id}`}>
                            <MapPin className="h-4 w-4 mr-2" />
                            {experience.location}
                          </div>
                        )}
                        {experience.mode && (
                          <div className="flex items-center" data-testid={`text-mode-${experience.id}`}>
                            <Clock className="h-4 w-4 mr-2" />
                            {experience.mode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {experience.workDescriptions && (
                  <CardContent>
                    <CardDescription 
                      className="text-gray-300 text-base leading-relaxed"
                      data-testid={`text-description-${experience.id}`}
                    >
                      {experience.workDescriptions}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : experiences && experiences.length > 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Matching Experience Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or filters to find relevant experience.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No Experience Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Experience data will appear here once it is added to the Google Spreadsheet.
            </p>
          </div>
        )}

        <div className="mt-16 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">📋 Google Spreadsheet Setup</h3>
          <p className="text-gray-300 mb-4">
            To populate this page with your work experience, create a Google Spreadsheet with an "Experience" sheet containing these columns:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-3">Experience Sheet Columns:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-blue-400">From</strong>
                <p className="text-gray-400">Start date (YYYY-MM format)</p>
              </div>
              <div>
                <strong className="text-blue-400">Upto</strong>
                <p className="text-gray-400">End date or "Present" (YYYY-MM format)</p>
              </div>
              <div>
                <strong className="text-blue-400">Company</strong>
                <p className="text-gray-400">Company or organization name</p>
              </div>
              <div>
                <strong className="text-blue-400">Location</strong>
                <p className="text-gray-400">Work location (City, Country)</p>
              </div>
              <div>
                <strong className="text-blue-400">Mode</strong>
                <p className="text-gray-400">Work mode (Remote, On-site, Hybrid)</p>
              </div>
              <div>
                <strong className="text-blue-400">Designation</strong>
                <p className="text-gray-400">Job title or position</p>
              </div>
              <div className="md:col-span-2">
                <strong className="text-blue-400">WorkDescriptions</strong>
                <p className="text-gray-400">Detailed description of responsibilities and achievements</p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mt-4 text-sm">
            💡 <strong>Tip:</strong> Update the spreadsheet URL in <code className="bg-gray-700 px-2 py-1 rounded">shared/config.ts</code> to connect your sheet.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <div className="min-h-screen bg-portfolio-background">
      <Navigation />
      <main className="pt-8">
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}