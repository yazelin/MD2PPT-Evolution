import { BlockType } from "../../types";
import { PPT_THEME } from "../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const codeBlockRenderer: BlockRenderer = {
  type: BlockType.CODE_BLOCK,
  render: (block, ctx) => {
    const { slide, pptx, x, y, w, options } = ctx;
    const { isDark } = options;

    const codeHeight = Math.min(block.content.split('\n').length * 0.22 + 0.3, 4.5 - y);
    if (codeHeight <= 0.3) return y;

    slide.addShape(pptx.ShapeType.rect, { 
        x, y, w, h: codeHeight, 
        fill: { color: isDark ? "222222" : "F5F5F5" }, 
        line: { color: "DDDDDD", width: 1 } 
    });
    
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
};
