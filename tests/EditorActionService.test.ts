import { describe, it, expect, vi } from 'vitest';
import { EditorActionService } from '../services/editorActionService';

// Mock TextArea
const createMockTextArea = () => {
  return {
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    setRangeText: vi.fn(),
    focus: vi.fn(),
    setSelectionRange: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

describe('EditorActionService (TextArea)', () => {
  it('should insert text at cursor position using setRangeText', () => {
    const textarea = createMockTextArea();
    const service = new EditorActionService(textarea as any);
    const setContent = vi.fn();
    
    service.insertText('Hello World', setContent);
    
    expect(textarea.setRangeText).toHaveBeenCalledWith('Hello World', 0, 0, 'select');
    expect(setContent).toHaveBeenCalled();
  });

  it('should handle $cursor placeholder', () => {
    const textarea = createMockTextArea();
    const service = new EditorActionService(textarea as any);
    const setContent = vi.fn();
    const template = 'Start |$cursor| End';
    
    service.insertText(template, setContent);
    
    expect(textarea.setRangeText).toHaveBeenCalledWith('Start || End', 0, 0, 'select');
    // We expect cursor positioning logic to be applied.
    // In textarea, setRangeText with 'select' selects the inserted text.
    // We might need manual cursor adjustment if we want specific cursor placement within the text.
  });
});