// Global configuration for the application
export const config = {
  // Google Sheets configuration
  googleSheets: {
    // Replace this URL with your actual Google Spreadsheet URL
    // Format: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid={SHEET_ID}
    baseUrl: "https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID",
    
    // Sheet names for different pages
    sheets: {
      photography: "Photography",
      // Add more sheets here as needed for other pages
      // portfolio: "Portfolio",
      // testimonials: "Testimonials"
    }
  }
};

export default config;