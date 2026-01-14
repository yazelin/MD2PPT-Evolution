import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { BlockType } from '../services/types';

describe('markdownParser', () => {
  it('should parse frontmatter correctly', () => {
    const input = [
      '---',
      'title: My Book',
      'author: Eric',
      '---',
      '# Heading 1'
    ].join('\n');
    const { blocks, meta } = parseMarkdown(input);
    expect(meta.title).toBe('My Book');
    expect(meta.author).toBe('Eric');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toBe('Heading 1');
  });

  it('should parse headers correctly', () => {
    const input = [
      '# Heading 1',
      '## Heading 2',
      '### Heading 3'
    ].join('\n');
    const { blocks } = parseMarkdown(input);
    expect(blocks).toHaveLength(3);
    expect(blocks[0].type).toBe(BlockType.HEADING_1);
    expect(blocks[0].content).toBe('Heading 1');
    expect(blocks[1].type).toBe(BlockType.HEADING_2);
    expect(blocks[1].content).toBe('Heading 2');
    expect(blocks[2].type).toBe(BlockType.HEADING_3);
    expect(blocks[2].content).toBe('Heading 3');
  });

  it('should parse paragraphs correctly', () => {
    const input = [
      'Paragraph 1',
      '',
      'Paragraph 2'
    ].join('\n');
    const { blocks } = parseMarkdown(input);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].type).toBe(BlockType.PARAGRAPH);
    expect(blocks[0].content).toBe('Paragraph 1');
  });

  it('should parse code blocks correctly', () => {
    const input = [
      '```typescript',
      'const a = 1;',
      '```'
    ].join('\n');
    const { blocks } = parseMarkdown(input);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe(BlockType.CODE_BLOCK);
    expect(blocks[0].content).toBe('const a = 1;');
    expect(blocks[0].metadata?.language).toBe('typescript');
  });

  it('should parse code block metadata (line numbers)', () => {
    const input = [
      '```ts:ln',
      'line 1',
      '```',
      '```js:no-ln',
      'line 2',
      '```'
    ].join('\n');
    const { blocks } = parseMarkdown(input);
    
    expect(blocks[0].metadata?.showLineNumbers).toBe(true);
    expect(blocks[0].metadata?.language).toBe('ts');
    
    expect(blocks[1].metadata?.showLineNumbers).toBe(false);
    expect(blocks[1].metadata?.language).toBe('js');
  });

  it('should parse tables correctly', () => {
    const input = [
      '| Header 1 | Header 2 |',
      '| -------- | -------- |',
      '| Cell 1   | Cell 2   |'
    ].join('\n');
    const { blocks } = parseMarkdown(input);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe(BlockType.TABLE);
    expect(blocks[0].tableRows).toEqual([
      ['Header 1', 'Header 2'],
      ['Cell 1', 'Cell 2']
    ]);
  });

  it('should parse standalone images as IMAGE blocks', () => {
    const md = '![Alt Text](https://example.com/image.png)';
    const { blocks } = parseMarkdown(md);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe(BlockType.IMAGE);
    expect(blocks[0].content).toBe('https://example.com/image.png');
    expect(blocks[0].metadata?.alt).toBe('Alt Text');
  });
});
