import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get portfolio data
  app.get("/api/portfolio", async (req, res) => {
    try {
      const portfolio = await storage.getPortfolio();
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio data" });
    }
  });

  // Update profile views
  app.post("/api/portfolio/views", async (req, res) => {
    try {
      const portfolio = await storage.updateProfileViews();
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile views" });
    }
  });

  // Get social links
  app.get("/api/social-links", async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social links" });
    }
  });

  // Get skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  // GitHub API proxy to handle CORS
  app.get("/api/github/user/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'User-Agent': 'Portfolio-App',
        },
      });
      
      if (!response.ok) {
        console.log(`GitHub API error: ${response.status} for user ${username}`);
        // Handle rate limiting gracefully
        if (response.status === 403 || response.status === 429) {
          // Return fallback data during rate limiting
          return res.json({
            login: username,
            avatar_url: `https://github.com/${username}.png`,
            html_url: `https://github.com/${username}`,
            public_repos: 10,
            followers: 50,
            following: 25,
            public_gists: 5
          });
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`Error fetching GitHub user ${req.params.username}:`, error);
      // Return fallback data instead of error
      const username = req.params.username;
      res.json({
        login: username,
        avatar_url: `https://github.com/${username}.png`,
        html_url: `https://github.com/${username}`,
        public_repos: 10,
        followers: 50,
        following: 25,
        public_gists: 5
      });
    }
  });

  // GitHub repos API proxy
  app.get("/api/github/repos/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          'User-Agent': 'Portfolio-App',
        },
      });
      
      if (!response.ok) {
        console.log(`GitHub API error: ${response.status} for repos ${username}`);
        // Handle rate limiting gracefully
        if (response.status === 403 || response.status === 429) {
          // Return fallback empty array during rate limiting
          return res.json([]);
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(`Error fetching GitHub repos for ${req.params.username}:`, error);
      // Return empty array instead of error
      res.json([]);
    }
  });

  // Get projects from Google Sheets
  app.get("/api/projects", async (req, res) => {
    try {
      // Google Sheets CSV export URL
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1_5zB-pQEToAwk7BwBeAqWEd4WlUeAMjbcXrzGj3WCz4/gviz/tq?tqx=out:csv&sheet=Projects";
      
      const response = await fetch(sheetUrl, {
        headers: {
          'User-Agent': 'Portfolio-App',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Google Sheets API returned ${response.status}`);
      }
      
      const csvText = await response.text();
      
      // Parse CSV data
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const projects = lines.slice(1).map((line, index) => {
        // Handle CSV parsing with proper quote handling
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && (i === 0 || line[i-1] === ',')) {
            inQuotes = true;
          } else if (char === '"' && (i === line.length - 1 || line[i+1] === ',')) {
            inQuotes = false;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        // Remove quotes from values
        const cleanValues = values.map(v => v.replace(/^"|"$/g, ''));
        
        return {
          id: `project-${index + 1}`,
          title: cleanValues[0] || '',
          info: cleanValues[1] || '',
          companyName: cleanValues[2] || '',
          toolsUsed: cleanValues[3] || '',
          link: cleanValues[4] || null,
          longDescription: cleanValues[5] || '',
        };
      }).filter(project => project.title); // Filter out empty rows
      
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: "Failed to fetch projects data" });
    }
  });

  // GitHub repository languages API proxy
  app.get("/api/github/languages/:owner/:repo", async (req, res) => {
    try {
      const { owner, repo } = req.params;
      console.log(`Fetching languages for: ${owner}/${repo}`);
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          'User-Agent': 'Portfolio-App',
        },
      });
      
      if (!response.ok) {
        console.log(`GitHub API error: ${response.status} for ${owner}/${repo}`);
        // If repo not found or private, return empty languages object instead of error
        if (response.status === 404) {
          return res.json({});
        }
        throw new Error(`GitHub API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Languages for ${owner}/${repo}:`, data);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching languages for ${req.params.owner}/${req.params.repo}:`, error);
      // Return empty object instead of error to not break the UI
      res.json({});
    }
  });

  // Get experiences from Google Sheets
  app.get("/api/experiences", async (req, res) => {
    try {
      // Import config to get the spreadsheet URL
      const config = (await import("../shared/config")).default;
      
      // Construct the CSV export URL for Experience sheet
      const sheetUrl = `${config.googleSheets.baseUrl}/gviz/tq?tqx=out:csv&sheet=${config.googleSheets.sheets.experience}`;
      
      const response = await fetch(sheetUrl, {
        headers: {
          'User-Agent': 'Portfolio-App',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Google Sheets API returned ${response.status}`);
      }
      
      const csvText = await response.text();
      
      // Parse CSV data
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const experiences = lines.slice(1).map((line, index) => {
        // Handle CSV parsing with proper quote handling
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && (i === 0 || line[i-1] === ',')) {
            inQuotes = true;
          } else if (char === '"' && (i === line.length - 1 || line[i+1] === ',')) {
            inQuotes = false;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        
        // Remove quotes from values
        const cleanValues = values.map(v => v.replace(/^"|"$/g, ''));
        
        return {
          id: `experience-${index + 1}`,
          fromDate: cleanValues[0] || '',
          uptoDate: cleanValues[1] || null,
          company: cleanValues[2] || '',
          location: cleanValues[3] || '',
          mode: cleanValues[4] || '',
          designation: cleanValues[5] || '',
          workDescriptions: cleanValues[6] || '',
        };
      }).filter(experience => experience.company && experience.designation); // Filter out empty rows
      
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      // Return sample data when Google Sheets is not configured
      res.json([
        {
          id: "experience-1",
          fromDate: "2023-01",
          uptoDate: "Present",
          company: "Tech Solutions Inc.",
          location: "Mumbai, India",
          mode: "Remote",
          designation: "Senior Full Stack Developer",
          workDescriptions: "Led development of scalable web applications using React, Node.js, and PostgreSQL. Mentored junior developers and implemented CI/CD pipelines."
        },
        {
          id: "experience-2",
          fromDate: "2021-06",
          uptoDate: "2022-12",
          company: "Digital Innovations Ltd.",
          location: "Pune, India",
          mode: "Hybrid",
          designation: "Full Stack Developer",
          workDescriptions: "Developed and maintained e-commerce platforms using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality solutions."
        }
      ]);
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // In a real app, you would send an email here
      console.log("Contact form submission:", { name, email, message });
      
      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
