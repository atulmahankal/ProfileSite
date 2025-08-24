// Global configuration for the application
export const config = {
  // Google Sheets configuration
  googleSheets: {
    // Using the same spreadsheet as Projects - contains multiple sheets for different pages
    spreadsheetId: "1_5zB-pQEToAwk7BwBeAqWEd4WlUeAMjbcXrzGj3WCz4",
    baseUrl: "https://docs.google.com/spreadsheets/d/1_5zB-pQEToAwk7BwBeAqWEd4WlUeAMjbcXrzGj3WCz4",
    
    // Sheet names for different pages
    sheets: {
      projects: "Projects",
      experience: "Experience",
      // Add more sheets here as needed for other pages
      // portfolio: "Portfolio",
      // testimonials: "Testimonials"
    }
  }
};

export default config;