import { createHighlighter, Highlighter } from 'shiki';

class HighlighterService {
  private highlighter: Highlighter | null = null;
  private initPromise: Promise<void> | null = null;

  async init() {
    if (this.highlighter) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'python', 'java', 'bash', 'sql']
    }).then(h => {
      this.highlighter = h;
    });

    return this.initPromise;
  }

  getHighlighter() {
    return this.highlighter;
  }
}

export const highlighterService = new HighlighterService();
