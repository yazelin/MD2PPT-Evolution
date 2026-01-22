/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * 
 * New AST Parser pipeline using Unified/Remark
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { BlockType, ParsedBlock } from '../types';

/**
 * Remark Plugin: Slide Splitter
 * Identifies '===' thematic breaks or paragraphs as slide separators.
 */
const remarkSlideSplitter = () => {
  return (tree: any) => {
    const children = tree.children || [];
    const slides: any[] = [];
    let currentSlideNodes: any[] = [];

    const isSeparator = (node: any) => {
      if (node.type === 'thematicBreak') return true;
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
    
    if (currentSlideNodes.length > 0 || slides.length === 0) {
      slides.push(currentSlideNodes);
    }

    tree.children = slides.map((nodes, idx) => ({
      type: 'slide',
      id: idx,
      children: nodes,
      position: nodes.length > 0 ? {
        start: nodes[0].position.start,
        end: nodes[nodes.length - 1].position.end
      } : undefined
    }));
  };
};

/**
 * Remark Plugin: Directive Fixer
 * Attempts to parse MD2PPT's legacy JSON attributes in directives.
 * e.g., ::: chart { "type": "bar" }
 */
const remarkDirectiveFixer = () => {
  return (tree: any) => {
    // Traverse tree and look for containerDirectives with text that looks like JSON
    const visit = (node: any) => {
      if (node.type === 'containerDirective' || node.type === 'leafDirective') {
        // If the directive has no standard attributes, try to find JSON in its first child
        // remark-directive might have failed to parse { "json": true }
        // For now, let's assume standard remark-directive will be used for new content.
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
  };
};

import { BlockType, ParsedBlock } from '../types';



/**

 * Mapper: Converts Remark AST nodes to MD2PPT ParsedBlocks

 */

const mapNodeToBlock = (node: any): ParsedBlock[] => {

  const blocks: ParsedBlock[] = [];

  const sourceLine = node.position?.start?.line || 0;

  const startIndex = node.position?.start?.offset || 0;

  const endIndex = node.position?.end?.offset || 0;



  const base = { sourceLine, startIndex, endIndex };



  switch (node.type) {

    case 'heading':

      const headingType = 

        node.depth === 1 ? BlockType.HEADING_1 :

        node.depth === 2 ? BlockType.HEADING_2 :

        BlockType.HEADING_3;

      blocks.push({

        ...base,

        type: headingType,

        content: node.children.map((c: any) => c.value).join('')

      });

      break;



    case 'paragraph':

      // Check for simple image

      if (node.children.length === 1 && node.children[0].type === 'image') {

        const img = node.children[0];

        blocks.push({

          ...base,

          type: BlockType.IMAGE,

          content: img.url,

          metadata: { alt: img.alt }

        });

        break;

      }



      blocks.push({

        ...base,

        type: BlockType.PARAGRAPH,

        content: node.children.map((c: any) => c.value || '').join('')

      });

      break;



    case 'code':

      if (node.lang === 'mermaid') {

        blocks.push({ ...base, type: BlockType.MERMAID, content: node.value });

      } else {

        blocks.push({ 

          ...base, 

          type: BlockType.CODE_BLOCK, 

          content: node.value, 

          metadata: { language: node.lang } 

        });

      }

      break;



    case 'list':

      node.children.forEach((item: any) => {

        blocks.push({

          ...base,

          type: node.ordered ? BlockType.NUMBERED_LIST : BlockType.BULLET_LIST,

          content: item.children.flatMap((c: any) => c.children || []).map((c: any) => c.value || '').join('')

        });

      });

      break;



    case 'table':

      const rows = node.children.map((row: any) => 

        row.children.map((cell: any) => 

          cell.children.map((c: any) => c.value || '').join('')

        )

      );

      blocks.push({

        ...base,

        type: BlockType.TABLE,

        content: '',

        tableRows: rows

      });

      break;



    case 'containerDirective':

      if (node.name === 'chart') {

        blocks.push({

          ...base,

          type: BlockType.CHART,

          content: '',

          metadata: {

            chartType: node.attributes?.type || 'bar',

            ...node.attributes

          },

          tableRows: node.children.filter((c: any) => c.type === 'table')[0]?.children.map((row: any) => 

            row.children.map((cell: any) => cell.children.map((c: any) => c.value || '').join(''))

          ) || []

        });

      }

      break;



    case 'leafDirective':

      if (node.name === 'right') {

        blocks.push({ ...base, type: BlockType.COLUMN_BREAK, content: '' });

      }

      break;

  }



  return blocks;

};



export const parseMarkdownWithAST = async (markdown: string): Promise<ParsedBlock[]> => {

  const processor = unified()

    .use(remarkParse)

    .use(remarkGfm)

    .use(remarkFrontmatter, ['yaml'])

    .use(remarkDirective)

    .use(remarkSlideSplitter);



  const ast = processor.parse(markdown);

  const transformedAst: any = await processor.run(ast);



  // Flatten the slides and their children into a flat list of ParsedBlocks

  // But we need to keep track of slide boundaries if needed

  // For now, we'll just return the blocks. SOM generation handles grouping.

  const allBlocks: ParsedBlock[] = [];

  transformedAst.children.forEach((slide: any) => {

    slide.children.forEach((node: any) => {

      allBlocks.push(...mapNodeToBlock(node));

    });

    // Add slide separator marker if needed, or rely on original logic

  });



  return allBlocks; 

};
