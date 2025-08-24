// Global configuration for the application
export const config = {
  // Google Sheets configuration
  googleSheets: {
    // Replace YOUR_SPREADSHEET_ID with your actual Google Spreadsheet ID
    // To get your spreadsheet ID:
    // 1. Open your Google Sheet
    // 2. Copy the ID from the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    // 3. Replace YOUR_SPREADSHEET_ID below with your actual ID
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