import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';

describe('Remark Directive Support', () => {
  it('should parse container directives with standard syntax (:::chart[title]{key=val})', async () => {
    const markdown = `:::chart[My Chart]{type="bar"}\n\nContent here\n\n:::`;
    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective);

    const ast: any = processor.parse(markdown);
    const directiveNode = ast.children[0];
    
    expect(directiveNode.type).toBe('containerDirective');
    expect(directiveNode.name).toBe('chart');
    expect(directiveNode.attributes.type).toBe('bar');
  });

  it('should parse leaf directives (::right)', async () => {
    const markdown = `::right`;
    const processor = unified()
      .use(remarkParse)
      .use(remarkDirective);

    const ast: any = processor.parse(markdown);
    const directiveNode = ast.children[0];
    
    expect(directiveNode.type).toBe('leafDirective');
    expect(directiveNode.name).toBe('right');
  });
});