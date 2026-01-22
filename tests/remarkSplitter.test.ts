import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { Node } from 'unist';

// Custom plugin to group nodes by "===" paragraph or thematicBreak
const remarkSlideSplitter = () => {
  return (tree: Node) => {
    const children = (tree as any).children || [];
    const slides: any[] = [];
    let currentSlideNodes: any[] = [];

    const isSeparator = (node: any) => {
      // 1. Standard thematicBreak (---)
      if (node.type === 'thematicBreak') return true;
      
      // 2. MD2PPT custom separator: paragraph with only ===
      if (node.type === 'paragraph' && 
          node.children?.length === 1 && 
          node.children[0].type === 'text' && 
          node.children[0].value.trim() === '===') {
        return true;
      }
      
      return false;
    };

    for (const node of children) {
      if (isSeparator(node)) {
        slides.push([...currentSlideNodes]);
        currentSlideNodes = [];
      } else {
        currentSlideNodes.push(node);
      }
    }
    
    if (currentSlideNodes.length > 0 || (slides.length === 0 && children.length > 0)) {
      slides.push(currentSlideNodes);
    }

    return { 
      type: 'root', 
      children: slides.map((nodes, idx) => ({ 
        type: 'slide', 
        id: idx,
        children: nodes 
      })) 
    };
  };
};

describe('Remark Slide Splitter', () => {
  it('should split content by custom separators (===)', async () => {
    const markdown = `# Slide 1\n\n===\n\n# Slide 2`;
    const processor = unified()
      .use(remarkParse)
      .use(remarkSlideSplitter);

    const ast: any = processor.parse(markdown);
    const transformed: any = await processor.run(ast);

    expect(transformed.children.length).toBe(2);
    expect(transformed.children[0].type).toBe('slide');
    expect(transformed.children[1].children[0].children[0].value).toBe('Slide 2');
  });

  it('should handle thematic break (---) as slide separator too', async () => {
    const markdown = `# S1\n\n---\n\n# S2`;
    const processor = unified()
      .use(remarkParse)
      .use(remarkSlideSplitter);

    const transformed: any = await processor.run(processor.parse(markdown));
    expect(transformed.children.length).toBe(2);
  });
});