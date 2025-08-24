import { type User, type InsertUser, type Portfolio, type InsertPortfolio, type SocialLink, type InsertSocialLink, type Skill, type InsertSkill, type Project, type InsertProject, type PhotoAlbum, type InsertPhotoAlbum, type Photo, type InsertPhoto } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolio(): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updateProfileViews(): Promise<Portfolio | undefined>;
  
  getSocialLinks(): Promise<SocialLink[]>;
  createSocialLink(link: InsertSocialLink): Promise<SocialLink>;
  
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getPhotoAlbums(): Promise<PhotoAlbum[]>;
  createPhotoAlbum(album: InsertPhotoAlbum): Promise<PhotoAlbum>;
  getPhotosByAlbumId(albumId: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolio: Portfolio | undefined;
  private socialLinks: Map<string, SocialLink>;
  private skills: Map<string, Skill>;
  private projects: Map<string, Project>;
  private photoAlbums: Map<string, PhotoAlbum>;
  private photos: Map<string, Photo>;

  constructor() {
    this.users = new Map();
    this.socialLinks = new Map();
    this.skills = new Map();
    this.projects = new Map();
    this.photoAlbums = new Map();
    this.photos = new Map();
    
    // Initialize with Atul's portfolio data
    this.initializePortfolio();
  }

  private initializePortfolio() {
    const portfolioId = randomUUID();
    
    // Create portfolio
    this.portfolio = {
      id: portfolioId,
      name: "Atul Devichand Mahankal",
      title: "A passionate fullstack developer from India",
      bio: "Building modern web applications with cutting-edge technologies. Passionate about creating seamless user experiences and robust backend solutions.",
      githubUsername: "atulmahankal",
      profileViews: 1250,
    };

    // Create social links
    const socialLinksData = [
      { platform: "Twitter", url: "https://twitter.com/atulmahankal", icon: "fab fa-twitter", portfolioId },
      { platform: "LinkedIn", url: "https://linkedin.com/in/atulmahankal", icon: "fab fa-linkedin", portfolioId },
      { platform: "GitHub", url: "https://github.com/atulmahankal", icon: "fab fa-github", portfolioId },
      { platform: "Stack Overflow", url: "https://stackoverflow.com/users/8054241", icon: "fab fa-stack-overflow", portfolioId },
      { platform: "Instagram", url: "https://instagram.com/atulmahankal", icon: "fab fa-instagram", portfolioId },
    ];

    socialLinksData.forEach(link => {
      const id = randomUUID();
      this.socialLinks.set(id, { id, ...link, portfolioId: portfolioId });
    });

    // Create skills
    const skillsData = [
      { name: "HTML5", category: "Frontend", icon: "fab fa-html5", color: "text-orange-500", portfolioId },
      { name: "JavaScript", category: "Frontend", icon: "fab fa-js-square", color: "text-yellow-500", portfolioId },
      { name: "Bootstrap", category: "Frontend", icon: "fab fa-bootstrap", color: "text-purple-500", portfolioId },
      { name: "Tailwind CSS", category: "Frontend", icon: "fas fa-palette", color: "text-cyan-500", portfolioId },
      { name: "PHP", category: "Backend", icon: "fab fa-php", color: "text-indigo-500", portfolioId },
      { name: "Laravel", category: "Backend", icon: "fab fa-laravel", color: "text-red-500", portfolioId },
      { name: "Node.js", category: "Backend", icon: "fab fa-node-js", color: "text-green-500", portfolioId },
      { name: "Django", category: "Backend", icon: "fab fa-python", color: "text-blue-400", portfolioId },
      { name: "MySQL", category: "Database", icon: "fas fa-database", color: "text-blue-500", portfolioId },
      { name: "Git", category: "Tools", icon: "fab fa-git-alt", color: "text-orange-600", portfolioId },
      { name: "Linux", category: "Tools", icon: "fab fa-linux", color: "text-yellow-600", portfolioId },
      { name: "Cordova", category: "Mobile", icon: "fas fa-mobile-alt", color: "text-green-600", portfolioId },
    ];

    skillsData.forEach(skill => {
      const id = randomUUID();
      this.skills.set(id, { id, ...skill, portfolioId: portfolioId });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolio(): Promise<Portfolio | undefined> {
    return this.portfolio;
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { ...insertPortfolio, id, profileViews: 0 };
    this.portfolio = portfolio;
    return portfolio;
  }

  async updateProfileViews(): Promise<Portfolio | undefined> {
    if (this.portfolio) {
      this.portfolio.profileViews = (this.portfolio.profileViews || 0) + 1;
    }
    return this.portfolio;
  }

  async getSocialLinks(): Promise<SocialLink[]> {
    return Array.from(this.socialLinks.values());
  }

  async createSocialLink(insertLink: InsertSocialLink): Promise<SocialLink> {
    const id = randomUUID();
    const link: SocialLink = { ...insertLink, id };
    this.socialLinks.set(id, link);
    return link;
  }

  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id, link: insertProject.link || null };
    this.projects.set(id, project);
    return project;
  }

  async getPhotoAlbums(): Promise<PhotoAlbum[]> {
    return Array.from(this.photoAlbums.values());
  }

  async createPhotoAlbum(insertAlbum: InsertPhotoAlbum): Promise<PhotoAlbum> {
    const id = randomUUID();
    const album: PhotoAlbum = { 
      ...insertAlbum, 
      id, 
      description: insertAlbum.description || null,
      dateCreated: insertAlbum.dateCreated || null,
      category: insertAlbum.category || "General"
    };
    this.photoAlbums.set(id, album);
    return album;
  }

  async getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
    return Array.from(this.photos.values())
      .filter(photo => photo.albumId === albumId)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = randomUUID();
    const photo: Photo = { 
      ...insertPhoto, 
      id,
      title: insertPhoto.title || null,
      description: insertPhoto.description || null,
      thumbnailUrl: insertPhoto.thumbnailUrl || null,
      orderIndex: insertPhoto.orderIndex || 0
    };
    this.photos.set(id, photo);
    return photo;
  }
}

export const storage = new MemStorage();
