import { useQuery } from "@tanstack/react-query";
import { fetchGitHubUser, fetchGitHubRepos, calculateGitHubStats, calculateLanguagePercentages, type GitHubUser, type GitHubStats } from "@/lib/github-api";

export const useGitHubUser = (username: string) => {
  return useQuery<GitHubUser>({
    queryKey: ["github", "user", username],
    queryFn: () => fetchGitHubUser(username),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useGitHubStats = (username: string) => {
  return useQuery<GitHubStats>({
    queryKey: ["github", "stats", username],
    queryFn: async () => {
      const repos = await fetchGitHubRepos(username);
      const basicStats = calculateGitHubStats(repos);
      
      // Get real language percentages
      try {
        const realLanguagePercentages = await calculateLanguagePercentages(repos);
        return {
          ...basicStats,
          languages: realLanguagePercentages
        };
      } catch (error) {
        console.warn("Failed to get real language percentages, using basic stats");
        return basicStats;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
