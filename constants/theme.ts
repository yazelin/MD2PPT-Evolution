/**
 * MD2PPT Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export const PPT_THEME = {
  FONTS: {
    MAIN: '"Segoe UI", "Microsoft JhengHei", sans-serif',
    CODE: '"JetBrains Mono", "Consolas", monospace',
    HEADING: '"Segoe UI", "Microsoft JhengHei", sans-serif',
  },
  
  COLORS: {
    PRIMARY: "EA580C",   // 琥珀暖橘
    SECONDARY: "0369A1", // 鋼鐵藍
    ACCENT: "F59E0B",    
    BG_SLIDE: "FFFFFF",   
    BG_CODE: "F5F5F4",   // 暖灰
    TEXT_MAIN: "1C1917", // 石墨黑
    TEXT_MUTED: "57534E",
    BORDER_CODE: "E7E5E4",
  },

  LAYOUT: {
    WIDTH: 10,
    HEIGHT: 5.625,
    MARGIN: 0.6,
  },
  
  FONT_SIZES: {
    TITLE: 36,
    SUBTITLE: 28,
    BODY: 20,
    CODE: 14,
    FOOTER: 12
  }
};

export const UI_THEME = {
  FONTS: {
    PREVIEW: `"Segoe UI", "Microsoft JhengHei", sans-serif`
  },
  COLORS: {
    BRAND: {
      DEFAULT: "#EA580C",
      DARK: "#C2410C",
      LIGHT: "#FB923C",
      SURFACE: "#FFF7ED"
    },
    ACCENT: {
      DEFAULT: "#0369A1",
      DARK: "#075985",
      LIGHT: "#0EA5E9"
    },
    // 暖色系介面背景
    LIGHT: {
      BG: "#FDFCFB",
      SURFACE: "#FFFFFF",
      TEXT: "#1C1917",
      BORDER: "#E7E5E4"
    },
    DARK: {
      BG: "#1C1917",
      SURFACE: "#292524",
      TEXT: "#FAFAF9",
      BORDER: "#44403C"
    }
  }
};