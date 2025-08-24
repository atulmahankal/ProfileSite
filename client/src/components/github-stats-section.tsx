import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, Code, Flame } from "lucide-react";
import { useGitHubUser, useGitHubStats } from "@/hooks/use-github-stats";

export default function GitHubStatsSection() {
  const { data: githubUser, isLoading: userLoading } = useGitHubUser("atulmahankal");
  const { data: githubStats, isLoading: statsLoading } = useGitHubStats("atulmahankal");

  const isLoading = userLoading || statsLoading;

  const topLanguages = githubStats?.languages ? 
    Object.entries(githubStats.languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6) : []; // Show top 6 to include CSS

  return (
    <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="github-stats-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="github-stats-title">
            GitHub <span className="text-portfolio-accent">Statistics</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-portfolio-accent to-portfolio-success mx-auto mb-4"></div>
          <p className="text-slate-400 max-w-2xl mx-auto" data-testid="github-stats-description">
            Here's a snapshot of my coding activity and contributions
          </p>
        </div>
        
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-32 w-full bg-portfolio-primary" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-64 w-full bg-portfolio-primary" />
              <Skeleton className="h-64 w-full bg-portfolio-primary" />
            </div>
          </div>
        ) : (
          <>
            {/* GitHub User Overview */}
            <div className="text-center mb-12">
              <Card className="glass border-portfolio-accent/20 hover-lift inline-block" data-testid="github-overview">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-portfolio-accent" data-testid="stat-repos">
                        {githubUser?.public_repos || 0}
                      </div>
                      <div className="text-sm text-slate-400">Public Repos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-portfolio-success" data-testid="stat-followers">
                        {githubUser?.followers || 0}
                      </div>
                      <div className="text-sm text-slate-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400" data-testid="stat-following">
                        {githubUser?.following || 0}
                      </div>
                      <div className="text-sm text-slate-400">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400" data-testid="stat-total-stars">
                        {githubStats?.totalStars || 0}
                      </div>
                      <div className="text-sm text-slate-400">Total Stars</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* GitHub Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* GitHub Activity */}
              <Card className="glass border-portfolio-accent/20 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center" data-testid="github-activity-title">
                    <Github className="mr-2" size={20} />
                    GitHub Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Repositories</span>
                      <span className="text-portfolio-accent font-semibold" data-testid="activity-repos">
                        {githubStats?.totalRepos || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Stars Earned</span>
                      <span className="text-yellow-400 font-semibold" data-testid="activity-stars">
                        {githubStats?.totalStars || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Forks</span>
                      <span className="text-portfolio-success font-semibold" data-testid="activity-forks">
                        {githubStats?.totalForks || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Languages */}
              <Card className="glass border-portfolio-accent/20 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center" data-testid="github-most-used-languages-title">
                    <Code className="mr-2" size={20} />
                    Github Most Used Languages
                  </h3>
                  <div className="space-y-3">
                    {topLanguages.length > 0 ? (
                      topLanguages.map(([language, count], index) => (
                        <div key={language} className="flex justify-between items-center" data-testid={`language-${language.toLowerCase()}`}>
                          <span className="text-slate-300">{language}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-portfolio-secondary rounded-full h-2">
                              <div 
                                className="bg-portfolio-accent h-2 rounded-full"
                                style={{ 
                                  width: `${(count / Math.max(...topLanguages.map(([,c]) => c))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-portfolio-accent font-semibold text-sm">{count}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-center">No language data available</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* GitHub Contribution Streak */}
            <div className="text-center">
              <Card className="glass border-orange-500/20 hover-lift inline-block">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center justify-center" data-testid="contribution-streak-title">
                    <Flame className="mr-2 text-orange-500" size={20} />
                    Contribution Activity
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Member since {githubUser?.created_at ? new Date(githubUser.created_at).getFullYear() : '2021'}
                  </p>
                  <div className="flex justify-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500" data-testid="years-active">
                        {githubUser?.created_at ? 
                          new Date().getFullYear() - new Date(githubUser.created_at).getFullYear() : 3
                        }+
                      </div>
                      <div className="text-sm text-slate-400">Years Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-portfolio-success" data-testid="public-gists">
                        {githubUser?.public_gists || 0}
                      </div>
                      <div className="text-sm text-slate-400">Public Gists</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
