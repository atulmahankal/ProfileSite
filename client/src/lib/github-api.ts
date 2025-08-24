export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languages: { [key: string]: number };
  topRepos: GitHubRepo[];
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`/api/github/user/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
  }
  return response.json();
};

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(`/api/github/repos/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.statusText}`);
  }
  return response.json();
};

export const calculateGitHubStats = (repos: GitHubRepo[]): GitHubStats => {
  const stats: GitHubStats = {
    totalStars: 0,
    totalForks: 0,
    totalRepos: repos.length,
    languages: {},
    topRepos: [],
  };

  repos.forEach(repo => {
    stats.totalStars += repo.stargazers_count;
    stats.totalForks += repo.forks_count;
    
    if (repo.language) {
      stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
    }
  });

  // Get top 5 repos by stars
  stats.topRepos = repos
    .filter(repo => repo.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  return stats;
};

// Add function to get actual language bytes from each repository
export const fetchRepoLanguages = async (owner: string, repo: string): Promise<{ [key: string]: number }> => {
  const response = await fetch(`/api/github/languages/${owner}/${repo}`);
  if (!response.ok) {
    return {};
  }
  return response.json();
};

export const calculateLanguagePercentages = async (repos: GitHubRepo[]): Promise<{ [key: string]: number }> => {
  const languageBytes: { [key: string]: number } = {};
  
  // Fetch language data for each repository
  for (const repo of repos) {
    try {
      const repoLanguages = await fetchRepoLanguages(repo.full_name.split('/')[0], repo.name);
      
      // Aggregate bytes for each language
      for (const [language, bytes] of Object.entries(repoLanguages)) {
        languageBytes[language] = (languageBytes[language] || 0) + bytes;
      }
    } catch (error) {
      console.warn(`Failed to fetch languages for ${repo.name}`);
    }
  }
  
  // Calculate total bytes
  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
  
  // Convert to percentages
  const percentages: { [key: string]: number } = {};
  for (const [language, bytes] of Object.entries(languageBytes)) {
    percentages[language] = Number(((bytes / totalBytes) * 100).toFixed(2));
  }
  
  return percentages;
};
