// Global configuration for the application
export const config = {
  // Google Sheets configuration
  googleSheets: {
    // Get spreadsheet ID from environment variable or use default
    spreadsheetId: process.env.GOOGLE_SHEETS_ID || "1_5zB-pQEToAwk7BwBeAqWEd4WlUeAMjbcXrzGj3WCz4",
    
    // Construct base URL from spreadsheet ID
    get baseUrl() {
      return process.env.GOOGLE_SHEETS_URL || `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`;
    },
    
    // Sheet names for different pages - can be overridden by environment variables
    sheets: {
      projects: process.env.GOOGLE_SHEETS_PROJECTS_SHEET || "Projects",
      experience: process.env.GOOGLE_SHEETS_EXPERIENCE_SHEET || "Experience",
      // Add more sheets here as needed for other pages
      // portfolio: process.env.GOOGLE_SHEETS_PORTFOLIO_SHEET || "Portfolio",
      // testimonials: process.env.GOOGLE_SHEETS_TESTIMONIALS_SHEET || "Testimonials"
    }
  }
};

export default config;