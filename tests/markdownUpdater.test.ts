import { describe, it, expect } from 'vitest';
import { updateSlideYaml } from '../services/markdownUpdater';

describe('Markdown Updater', () => {
  it('should add YAML to a slide without one', () => {
    const content = `# Slide 1
===
# Slide 2`;
    const updated = updateSlideYaml(content, 1, 'bgImage', 'img.png');
    
    expect(updated).toContain('bgImage: "img.png"');
    expect(updated).toContain('# Slide 2');
    // Ensure structure is roughly correct: separator -> yaml -> content
    expect(updated).toMatch(/===\s+---\s+bgImage: "img.png"\s+---\s+# Slide 2/);
  });

  it('should update existing key in YAML', () => {
    const content = `# Slide 1
===
---
layout: grid
bgImage: "old.png"
---
# Slide 2`;
    const updated = updateSlideYaml(content, 1, 'bgImage', 'new.png');
    
    expect(updated).toContain('bgImage: "new.png"');
    expect(updated).toContain('layout: grid');
  });

  it('should append new key to existing YAML', () => {
    const content = `# Slide 1
===
---
layout: grid
---
# Slide 2`;
    const updated = updateSlideYaml(content, 1, 'bgImage', 'img.png');
    
    expect(updated).toContain('layout: grid');
    expect(updated).toContain('bgImage: "img.png"');
  });
});
