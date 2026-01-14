/**
 * MD2PPT Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

// --- PowerPoint Theme Configuration ---

export const PPT_THEME = {
  FONTS: {
    MAIN: "Arial",
    CODE: "Consolas",
    HEADING: "Arial",
  },
  
  COLORS: {
    // Brand Colors (Evolution Theme)
    PRIMARY: "D24726",    // PowerPoint Orange-Red
    SECONDARY: "FF8C00",  // Dark Orange
    ACCENT: "00FF99",     // Neon Green (Keep for some contrast)
    
    // Backgrounds
    BG_SLIDE: "1A1A1A",   // Dark Gray
    BG_CODE: "2D2D2D",
    
    // Text
    TEXT_MAIN: "FFFFFF",
    TEXT_MUTED: "A0A0A0",
    
    // Borders
    BORDER_CODE: "404040",
  },

  LAYOUT: {
    WIDTH: 10,
    HEIGHT: 5.625,
    MARGIN: 0.5,
  },
  
  FONT_SIZES: {
    TITLE: 32,
    SUBTITLE: 24,
    BODY: 18,
    CODE: 14,
    FOOTER: 12
  }
};

// --- UI Theme Configuration (For React Components) ---

export const UI_THEME = {
  FONTS: {
    PREVIEW: `"${PPT_THEME.FONTS.MAIN}", sans-serif`
  }
};
