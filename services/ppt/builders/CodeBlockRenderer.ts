import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";
import { highlighterService } from "../HighlighterService";

export const codeBlockRenderer: BlockRenderer = {
  type: BlockType.CODE_BLOCK,
  render: async (block, ctx) => {
    const { slide, pptx, x, y, w, options } = ctx;
    const { isDark } = options;

    const lines = block.content.split('\n');
    const codeHeight = Math.min(lines.length * 0.22 + 0.3, 4.5 - y);
    if (codeHeight <= 0.3) return y;

    // Background
    slide.addShape(pptx.ShapeType.rect, { 
        x, y, w, h: codeHeight, 
        fill: { color: isDark ? "222222" : "F5F5F5" }, 
        line: { color: "DDDDDD", width: 1 } 
    });

    // Initialize Highlighter
    await highlighterService.init();
    const highlighter = highlighterService.getHighlighter();

    if (!highlighter) {
        // Fallback
        slide.addText(block.content, { 
            x: x + 0.1, y: y + 0.1, w: w - 0.2, h: codeHeight - 0.2, 
            fontSize: PPT_THEME.FONT_SIZES.CODE, 
            color: isDark ? "00FF99" : "D24726", 
            fontFace: PPT_THEME.FONTS.CODE,
            valign: 'top', 
            wrap: true 
        });
        return y + codeHeight + 0.3;
    }

    // Tokenize
    const lang = block.metadata?.language || 'text'; // Default to text if unknown
    const theme = isDark ? 'github-dark' : 'github-light';
    
    let tokens;
    try {
        tokens = highlighter.codeToTokens(block.content, { lang, theme }).tokens;
    } catch (e) {
        // Fallback for unknown language
        try {
            tokens = highlighter.codeToTokens(block.content, { lang: 'markdown', theme }).tokens;
        } catch (e2) {
             tokens = highlighter.codeToTokens(block.content, { lang: 'text', theme }).tokens;
        }
    }

    // Map to PptxGenJS text objects
    const textObjects: any[] = [];
    
    tokens.forEach((lineTokens: any[], lineIndex: number) => {
        lineTokens.forEach(token => {
            textObjects.push({
                text: token.content,
                options: {
                    color: token.color ? token.color.replace('#', '') : undefined,
                    fontFace: PPT_THEME.FONTS.CODE,
                    fontSize: PPT_THEME.FONT_SIZES.CODE
                }
            });
        });
        
        if (lineIndex < tokens.length - 1) {
             textObjects.push({ 
                 text: "\n", 
                 options: { fontFace: PPT_THEME.FONTS.CODE, fontSize: PPT_THEME.FONT_SIZES.CODE } 
             });
        }
    });

    slide.addText(textObjects, { 
        x: x + 0.1, y: y + 0.1, w: w - 0.2, h: codeHeight - 0.2, 
        valign: 'top', 
        wrap: true, 
    });

    return y + codeHeight + 0.3;
  }
};
