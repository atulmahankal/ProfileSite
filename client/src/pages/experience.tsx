import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Briefcase, Clock, Building } from "lucide-react";
import type { Experience } from "@shared/schema";

function ExperienceSection() {
  const { data: experiences, isLoading, error } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

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

        {experiences && experiences.length > 0 ? (
          <div className="space-y-8">
            {experiences.map((experience) => (
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
                          {experience.fromDate} - {experience.uptoDate || 'Present'}
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
                    <div className="flex flex-wrap gap-2">
                      {experience.mode && (
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-600 text-white"
                          data-testid={`badge-mode-${experience.id}`}
                        >
                          {experience.mode}
                        </Badge>
                      )}
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